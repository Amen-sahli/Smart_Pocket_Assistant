def compute_financials(transactions):
    revenus = 0
    depenses = {}

    for t in transactions:
        if t.type == "credit":
            revenus += t.amount
        else:
            depenses[t.category] = depenses.get(t.category, 0) + t.amount

    total_dep = sum(depenses.values())
    solde = revenus - total_dep

    score = 0
    if revenus > 0:
        score = int((solde / revenus) * 100)

    return {
        "revenus": revenus,
        "depenses": depenses,
        "total_depenses": total_dep,
        "solde": solde,
        "score": score,
    }