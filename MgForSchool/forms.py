from django import forms
from .models import OrderRecord

class OrderForm(forms.  ModelForm):
    class Meta:
        model = OrderRecord
        exclude = ['user', 'is_val',]
