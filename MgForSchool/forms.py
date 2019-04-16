from django import forms
from .models import OrderRecord

class OrderForm(forms.  ModelForm):
    date_start = forms.DateField(
        widget=forms.SelectDateWidget()
    )
    class Meta:
        model = OrderRecord
        exclude = ['user', 'date_end', 'is_val',]
