from .analytics_core import compute_financials
from .groq_ai import generate_ai_insights


def full_analysis(transactions):
    financials = compute_financials(transactions)

    ai_insights = generate_ai_insights(financials)

    return {
        **financials,
        "insights": ai_insights
    }