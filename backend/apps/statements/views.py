from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .services.save_to_db import save_transactions_to_db
from .services.pdf_extractor import extract_text_from_pdf
from .services.parser import extract_transactions_table
from .services.exporter import export_transactions_to_csv,export_transaction_to_excel
from django.http import HttpResponse
from rest_framework.permissions import IsAuthenticated
from .models import Transaction
from collections import defaultdict
from datetime import datetime


@api_view(['GET'])
def test_api(request):
    return Response({
        "message": "Backend is working"
    })
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_statement(request):
    print(request.FILES)

    uploaded_file = request.FILES.get('file')
    print("uploaded_file =", uploaded_file)

    if uploaded_file is None:
        return Response({
            "status": "error",
            "message": "No file was sent"
        }, status=400)

    file_name = uploaded_file.name
    print("file_name =", file_name)

    if not file_name.lower().endswith('.pdf'):
        return Response({
            "status": "error",
            "message": "Only PDF files are allowed"
        }, status=400)

    try:
        extracted_text = extract_text_from_pdf(uploaded_file)
        transactions = extract_transactions_table(uploaded_file)
        saved=save_transactions_to_db(transactions, request.user)



        return Response({
            "status": "success",
            "message": "PDF received and text extracted successfully",
            "saved": saved,
            "filename": file_name,
            "text_preview": extracted_text[:1000],
            "transaction_count": len(transactions),
            "transactions": transactions
        }, status=200)
    

    except Exception as e:
        return Response({
            "status": "error",
            "warning": "Some transactions could not be saved to the database",
            "message": "Error while extracting text from PDF",
            "details": str(e)
        }, status=500)
@api_view(['POST'])
def export_csv(request):
    transactions = request.data.get("transactions", [])

    if not transactions:
        return Response({
            "status": "error",
            "message": "No transactions provided"
        }, status=400)

    csv_data = export_transactions_to_csv(transactions)

    response = HttpResponse(csv_data, content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="transactions.csv"'

    return response
@api_view(['POST'])
def export_excel(request):
    transactions = request.data.get("transactions", [])

    if not transactions:
        return Response({
            "status": "error",
            "message": "No transactions provided"
        }, status=400)

    excel_data =export_transaction_to_excel(transactions)

    response = HttpResponse(
        excel_data,
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = 'attachment; filename="transactions.xlsx"'

    return response

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transactions(request):
    transactions = Transaction.objects.filter(user=request.user).order_by('-date')

    data = [
        {
            "date": t.date,
            "desc": t.description,
            "amount": t.amount,
            "type": "income" if t.type == "credit" else "expense",
            "category": t.category
        }
        for t in transactions[:5]
    ]

    return Response(data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_stats(request):
    transactions = Transaction.objects.filter(user=request.user)
    total_income = sum(t.amount for t in transactions if t.type == "credit")
    total_expense = sum(t.amount for t in transactions if t.type == "debit")
    balance = sum(t.amount if t.type == "credit" else -t.amount for t in transactions)
    return Response({
        "income": total_income,
        "expenses": total_expense,
        "balance": balance
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_data(request):
    user = request.user
    transactions = Transaction.objects.filter(user=user)

    # ===== SUMMARY =====
    total_income = sum(t.amount for t in transactions if t.type == "credit")
    total_expenses = sum(t.amount for t in transactions if t.type == "debit")

    balance = total_income - total_expenses
    avg_daily = total_expenses / 30 if total_expenses else 0

    summary = {
        "balance": balance,
        "income": total_income,
        "expenses": total_expenses,
        "avg_daily": avg_daily
    }

    # ===== CATEGORY PIE (ONLY EXPENSES) =====
    category_totals = defaultdict(float)

    for t in transactions:
        if t.type == "debit":
            category_totals[t.category] += t.amount

    #two decimal places for frontend display
    pie_data = [
        {"name": k, "value": round(v, 2)}
        for k, v in category_totals.items()
    ]

    # ===== MONTHLY DATA =====
    monthly = defaultdict(lambda: {"income": 0, "expenses": 0})

    for t in transactions:
        month = t.date.strftime("%b")

        if t.type == "credit":
            monthly[month]["income"] += t.amount
        else:
            monthly[month]["expenses"] += t.amount

    months = sorted(monthly.keys(), key=lambda m: datetime.strptime(m, "%b"))

    # ===== INCOME VS EXPENSES =====
    income_vs_expenses = [
        {
            "month": m,
            "income": monthly[m]["income"],
            "expenses": monthly[m]["expenses"]
        }
        for m in months
    ]

    # ===== SPENDING LINE =====
    spending_line = [
        {
            "month": m,
            "spending": round(monthly[m]["expenses"], 2),
            "budget": round(monthly[m]["expenses"] * 1.2, 2)  #  dynamic
        }
        for m in months
    ]

    # ===== CATEGORY BAR =====
    category_bar = [
        {
            "category": k,
            "spent": round(v, 2),
            "avg": round(v * 0.8, 2)  # placeholder
        }
        for k, v in category_totals.items()
    ]

    # ===== TOP TRANSACTIONS =====
    top_transactions = sorted(
        transactions,
        key=lambda t: round(t.amount, 2),
        reverse=True
    )[:6]

    top_data = [
        {
            "desc": t.description,
            "amount": t.amount if t.type == "credit" else -t.amount,  # 👈 IMPORTANT
            "category": t.category,
            "date": t.date.strftime("%b %d")
        }
        for t in top_transactions
    ]

    return Response({
        "summary": summary,
        "pie": pie_data,
        "line": spending_line,
        "bar": category_bar,
        "area": income_vs_expenses,
        "top": top_data
    })



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_transaction(request):
    user = request.user

    data = request.data

    date = data.get("date")
    description = data.get("desc")
    amount = data.get("amount")
    tx_type = data.get("type")  # "income" or "expense"
    category = data.get("category", "Other")

    # ===== VALIDATION =====
    if not description or not amount or not date:
        return Response({
            "error": "Missing required fields"
        }, status=400)

    try:
        amount = float(amount)
    except:
        return Response({
            "error": "Invalid amount"
        }, status=400)

    # ===== MAP FRONTEND TYPE → DB TYPE =====
    if tx_type == "income":
        db_type = "credit"
    else:
        db_type = "debit"

    try:
        parsed_date = datetime.strptime(date, "%Y-%m-%d").date()
    except:
        return Response({
            "error": "Invalid date format"
        }, status=400)

    # ===== CREATE TRANSACTION =====
    transaction = Transaction.objects.create(
        user=user,
        date=parsed_date,
        description=description,
        amount=amount,
        type=db_type,
        category=category
    )

    return Response({
        "status": "success",
        "transaction": {
            "id": transaction.id,
            "date": transaction.date,
            "desc": transaction.description,
            "amount": amount if db_type == "credit" else -amount,
            "type": tx_type,
            "category": transaction.category
        }
    })