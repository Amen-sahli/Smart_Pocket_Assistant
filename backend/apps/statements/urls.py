from django.urls import path
from .views import get_transactions, test_api, upload_statement, export_csv, export_excel

urlpatterns = [
    path('test/', test_api),
    path('upload/', upload_statement),
    path('export/csv/', export_csv),
    path('export/excel/', export_excel),
    path('list/', get_transactions),
]