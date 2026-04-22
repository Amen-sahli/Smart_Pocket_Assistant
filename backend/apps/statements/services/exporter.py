import csv
from io import StringIO,BytesIO
from openpyxl import Workbook
def export_transactions_to_csv(transactions):
    output = StringIO()
    writer = csv.writer(output)

    writer.writerow(["date", "description", "amount", "type"])

    for transaction in transactions:
        writer.writerow([
            transaction.get("date", ""),
            transaction.get("description", ""),
            transaction.get("amount", ""),
            transaction.get("type", "")
        ])

    return output.getvalue()

def export_transaction_to_excel(transactions):
    output = BytesIO()
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Transactions"

    # header
    sheet.append(["date", "description", "amount", "type"])

    # rows
    for transaction in transactions:
        sheet.append([
            transaction.get("date", ""),
            transaction.get("description", ""),
            transaction.get("amount", ""),
            transaction.get("type", "")
        ])

    workbook.save(output)
    output.seek(0)
    return output.getvalue()