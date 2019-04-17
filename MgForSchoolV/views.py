from django.shortcuts import render
from django.views.generic.base import TemplateView
from django.contrib.auth.decorators import login_required
from MgForSchool.models import OrderRecord

def NPlusT(func):#验证是否有活动的订单-TRUE
    def wrapper(request,*args,**kwargs):
        try:
            orders = request.user.orders
            val_order = orders.get(is_val=True)
        except OrderRecord.DoesNotExist:
            return render(
                request,
                'MgForSchoolTemp/warning.html',
                {'warning_msg':'您还未订购Node  plus会员', 'relocation':'订购页面', 'relocate':'/order/',}
            )
        return  func(request,*args, **kwargs)
    return wrapper

@login_required(login_url='/accounts/login/')
@NPlusT
def MgForSchool(request):
    if request.user.is_authenticated:
            return render(request, 'index.html')
    else:
        return render(
            request,
            'MgForSchoolTemp/warning_login_required.html',
            {'warning_msg':'访问节点魔方教学课程请先登录', 'relocation':'登录页面', 'relocate':'/accounts/login/',}
        )
