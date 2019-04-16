from django.shortcuts import render
from MgForSchool.models import OrderRecord

def warning_login_required(request):
    if request.user.is_authenticated:
        try:
            OrderRecord.objects.get(is_val='True')
            return render(request, 'index.html')
        except OrderRecord.DoesNotExist:
            return render(
                request,
                'MgForSchoolTemp/warning_login_required.html',
                {'warning_msg':'您目前没有有效的课程订购', 'relocate':'/'}
            )
    else:
        return render(
            request,
            'MgForSchoolTemp/warning_login_required.html',
            {'warning_msg':'访问节点魔方教学课程请先登录', 'relocate':'/accounts/login/',}
        )
