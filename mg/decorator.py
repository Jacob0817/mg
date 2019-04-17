from django.shortcuts import render
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

def NPlusF(func):#验证是否有活动的订单-FALSE
    def wrapper(request,*args,**kwargs):
        try:
            orders = request.user.orders
            val_order = orders.get(is_val=True)
        except OrderRecord.DoesNotExist:
            return  func(request,*args, **kwargs)
        return render(
                request,
                'MgForSchoolTemp/warning.html',
                {'warning_msg':'您已经有可用的订购', 'relocation':'首页', 'relocate':'/',}
            )
    return wrapper

def NPlusWait(func):#验证是否有活动的订单-FALSE
    def wrapper(request,*args,**kwargs):
        try:
            orders = request.user.orders
            val_order = orders.get(SOM=0)
        except OrderRecord.DoesNotExist:
            return  func(request,*args, **kwargs)
        return render(
                request,
                'MgForSchoolTemp/warning.html',
                {'warning_msg':'您的订单已交管理员审核，请耐心等待', 'relocation':'首页', 'relocate':'/',}
            )
    return wrapper
