import os
import json
import re
from pathlib import Path
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent / ".env")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")


def generate_ai_insights(financials):
    if not GROQ_API_KEY:
        return [
            {
                "type": "tip",
                "icon": "💡",
                "title": "AI unavailable",
                "body": "No Groq API key configured."
            }
        ]

    revenus = financials["revenus"]
    depenses = financials["depenses"]
    solde = financials["solde"]
    score = financials["score"]

    dep_text = "\n".join([
        f"- {cat}: {amt:.2f}"
        for cat, amt in depenses.items()
    ]) or "- No expenses recorded"

    prompt = f"""You are a financial advisor. Analyze the user's finances and return exactly 4 insights.

User financial data:
- Income: {revenus:.2f}
- Expenses: {sum(depenses.values()):.2f}
- Balance: {solde:.2f}
- Score: {score}/100

Expenses by category:
{dep_text}

Return ONLY a JSON array. No explanation, no markdown. Exactly this format:
[{{"type":"positive","icon":"🏆","title":"title","body":"insight text"}},{{"type":"warning","icon":"⚠️","title":"title","body":"insight text"}},{{"type":"tip","icon":"💡","title":"title","body":"insight text"}},{{"type":"tip","icon":"📊","title":"title","body":"insight text"}}]

type must be one of: positive, warning, tip."""

    try:
        client = ChatGroq(
            api_key=GROQ_API_KEY,
            model="llama-3.1-8b-instant",
            temperature=0.7,
            max_tokens=1024,
        )

        response = client.invoke([
            {"role": "user", "content": prompt}
        ])

        raw = response.content.strip()
        print("Groq raw response:", raw)

        # Strip markdown code fences if present
        raw = re.sub(r"```(?:json)?\s*", "", raw)
        raw = re.sub(r"```\s*$", "", raw)
        raw = raw.strip()

        # Extract JSON array — find first [ and last ]
        start = raw.find("[")
        end = raw.rfind("]")
        if start != -1:
            raw = raw[start:]
            if end == -1:
                raw += "]"

        # Fix trailing commas before ] or }
        raw = re.sub(r",\s*([}\]])", r"\1", raw)

        result = json.loads(raw)

        if isinstance(result, list) and len(result) > 0:
            return result

        raise ValueError("Response is not a non-empty JSON array")

    except Exception as e:
        print("Groq error:", e)
        print("Groq raw after cleanup:", raw)
        return [
            {
                "type": "tip",
                "icon": "💡",
                "title": "AI unavailable",
                "body": "Could not generate AI insights. Please try again later."
            }
        ]
