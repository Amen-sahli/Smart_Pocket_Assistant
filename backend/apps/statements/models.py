from django.db import models
from django.contrib.auth.models import User

class Transaction(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    description = models.TextField()
    amount = models.FloatField()
    type = models.CharField(max_length=100, blank=True)
    category = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.amount}"