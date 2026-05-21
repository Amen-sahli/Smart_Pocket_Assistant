import os
from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")


def generate_ai_insights(financials):
    if not GROQ_API_KEY:
        return []

    revenus = financials["revenus"]
    depenses = financials["depenses"]
    solde = financials["solde"]
    score = financials["score"]

    dep_text = "\n".join([
        f"- {cat}: {amt:.2f}"
        for cat, amt in depenses.items()
    ])

    prompt = f"""
You are a financial advisor.

User financial data:
- Income: {revenus}
- Expenses: {sum(depenses.values())}
- Balance: {solde}
- Score: {score}/100

Expenses by category:
{dep_text}

Return ONLY a JSON array of 4 insights.

Format:
[
  {{
    "type": "positive" | "warning" | "tip",
    "icon": "emoji",
    "title": "short title",
    "body": "2 sentence insight"
  }}
]
"""

    try:
        client = ChatGroq(
            api_key=GROQ_API_KEY,
            model="llama-3.1-8b-instant",
            temperature=0.7,
            max_tokens=500,
        )

        response = client.invoke([
            {"role": "user", "content": prompt}
        ])

        import json
        raw = response.content.strip().replace("```json", "").replace("```", "")

        return json.loads(raw)

    except Exception as e:
        print("Groq error:", e)
        return []