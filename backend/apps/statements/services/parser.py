import re
import pdfplumber
from datetime import datetime

def extract_transactions_table(pdf_file):
    transactions = []
    pdf_file.seek(0)

    with pdfplumber.open(pdf_file) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()

            for table in tables:
                if not table:
                    continue

                for row in table:
                    if not row or len(row) < 5:
                        continue

                    cells = []
                    for cell in row:
                        if cell is None:
                            cells.append("")
                        else:
                            cells.append(str(cell).strip())

                    date = cells[0]
                    try:
                        date_obj = datetime.strptime(date, "%d/%m/%Y")
                        date = date_obj.strftime("%Y-%m-%d")
                    except:
                        continue
                    description = cells[1]
                    description = re.sub(r'\s+', ' ', description).strip()
                    debit = cells[2]
                    credit = cells[3]
                    balance = cells[4]
                    
                    if "SOLDE REPORTE" in description.upper():
                        continue

                    if debit:
                        amount_str = debit
                        transaction_type = "debit"
                    elif credit:
                        amount_str = credit
                        transaction_type = "credit"
                    else:
                        continue

                    amount = float(amount_str.replace(" ", "").replace(",", "."))

                    transactions.append({
                        "date": date,
                        "description": description,
                        "amount": amount,
                        "type": transaction_type
                    })

    return transactions
