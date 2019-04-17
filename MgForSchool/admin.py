from django.contrib import admin
from .models import OrderRecord
# Register your models here.


class OrderRecordAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,               {'fields': ['user']}),
        (None,               {'fields': ['date_start']}),
        (None,               {'fields': ['date_end']}),
        (None,               {'fields': ['SOM']}),
        (None,               {'fields': ['is_val']}),
    ]
    list_display = ('user', 'date_add',  'is_val') #add more columns.
    list_filter = ['is_val'] #add filter function.
    search_fields = ['user'] #add search function.

admin.site.register(OrderRecord, OrderRecordAdmin)