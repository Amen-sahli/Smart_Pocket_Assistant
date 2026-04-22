from rest_framework.response import Response
from rest_framework.decorators import api_view

from .services.save_to_db import save_transactions_to_db
from .services.pdf_extractor import extract_text_from_pdf
from .services.parser import extract_transactions_table
from .services.exporter import export_transactions_to_csv,export_transaction_to_excel
from django.http import HttpResponse
@api_view(['GET'])
def test_api(request):
    return Response({
        "message": "Backend is working"
    })
@api_view(['POST'])
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
    