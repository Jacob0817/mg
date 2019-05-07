from django.contrib import admin
from .models import OrderRecord, Nresault
# Register your models here.


class OrderRecordAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,               {'fields': ['user']}),
        (None,               {'fields': ['group_order']}),
        (None,               {'fields': ['date_start']}),
        (None,               {'fields': ['date_end']}),
        (None,               {'fields': ['date_last']}),
        (None,               {'fields': ['SOM']}),
        (None,               {'fields': ['is_val']}),
    ]
    list_display = ('user', 'group_order', 'date_add', 'date_last', 'is_val') #add more columns.
    list_filter = ['is_val'] #add filter function.
    search_fields = ['user'] #add search function.

admin.site.register(OrderRecord, OrderRecordAdmin)

class NresaultAdmin(admin.ModelAdmin):
    fieldsets = [
        (None,               {'fields': ['value1']}),
        (None,               {'fields': ['value2']}),
        (None,               {'fields': ['value3']}),
        (None,               {'fields': ['value4']}),
        (None,               {'fields': ['value5']}),
    ]
    list_display = ('user', 'competitionId', 'eventId', 'roundTypeId', 'pos', 'best', 'average', 'value1', 'value2', 'value3', 'value4', 'value5') #add more columns.
    list_filter = ['competitionId', 'eventId'] #add filter function.
    search_fields = ['user'] #add search function.

admin.site.register(Nresault, NresaultAdmin)