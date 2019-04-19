from django import forms
from MgForSchool.models import OrderRecord

class OrderForm(forms.  ModelForm):

    class Meta:
        model = OrderRecord
        exclude = ['user', 'date_start', 'date_end', 'date_last', 'is_val', 'SOM']
