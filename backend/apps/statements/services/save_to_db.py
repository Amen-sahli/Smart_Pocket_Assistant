from apps.statements.models import Transaction

def save_transactions_to_db(transactions, user):
    transactions_list =[]
    for transaction in transactions:
        t=Transaction(
            user=user,
            date=transaction.get("date"),
            description=transaction.get("description"),
            amount=transaction.get("amount"),
            type=transaction.get("type")
        )
        transactions_list.append(t)
    Transaction.objects.bulk_create(transactions_list)
    try:
        return {"status": "success", "message": f"{len(transactions)} transactions saved to the database"}
    except Exception as e:
        return {"status": "error", "message": "Error while saving transactions to database", "details": str(e)}