from collections import defaultdict
import random

def generate_insights(transactions):
    revenus = 0
    depenses = {}

    for t in transactions:
        if t.type == "credit":
            revenus += t.amount
        else:
            depenses[t.category] = depenses.get(t.category, 0) + t.amount

    total_dep = sum(depenses.values())
    solde = revenus - total_dep

    insights = []

    # 🔥 Insight 1
    if solde < 0:
        insights.append({
            "type": "warning",
            "icon": "⚠️",
            "title": "Overspending detected",
            "body": f"You spent more than your income by ${abs(solde)}."
        })

    # 🔥 Insight 2
    if revenus > 0:
        savings_rate = (solde / revenus) * 100

        if savings_rate > 30:
            insights.append({
                "type": "positive",
                "icon": "🏆",
                "title": "Great savings rate",
                "body": f"You saved {savings_rate:.1f}% of your income. Excellent!"
            })
        elif savings_rate < 10:
            insights.append({
                "type": "warning",
                "icon": "📉",
                "title": "Low savings",
                "body": "Try to save at least 20% of your income."
            })

    # 🔥 Insight 3
    if depenses.get("Food", 0) > revenus * 0.2:
        insights.append({
            "type": "warning",
            "icon": "🍔",
            "title": "High food spending",
            "body": "Food expenses exceed 20% of your income."
        })

    # 🔥 Insight 4
    insights.append({
        "type": "tip",
        "icon": "💡",
        "title": "Budget tip",
        "body": "Try setting monthly limits per category to control spending."
    })

    return {
        "insights": insights,
        "score": int((solde / revenus) * 100) if revenus > 0 else 0
    }