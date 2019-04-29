from django.db import models

class ResultField(models.IntegerField):
    description = "field for competition results"

    def __init__(self, *args, **kwargs):
        super(ResultField, self).__init__(*args, **kwargs)

    #读取数据库
    def from_db_value(self, value, expression, conn, context):
        if not value:
            return('NULL')
        else:
            if (value == '-1'):
                return('DNF')
            elif (value == '-2'):
                return('DNS')
            else:
                if(value >= 6000):
                    value = (int(value / 6000)) * 10000 + value - 6000 * (int(value / 6000))
                    reverse_value = str(value)[::-1]
                arr = [reverse_value[i:i + 2] for i in range(0, len(reverse_value), 2)]
                time = '.'.join(arr)
                return time[::-1]
    def get_prep_value(self, value):
        if not value:
            value = -1
            return value
        elif value == -1 or value == -2:
            return value
        else:
            if value >6000:
                value = int(value / 10000 )*6000 +value % 10000
            return value