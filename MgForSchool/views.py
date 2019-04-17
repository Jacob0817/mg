from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import View
from .forms import OrderForm
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from .models import OrderRecord

# Create your views here.
def NPlus(func):#验证是否有活动的订单-FALSE
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

def index(request):
    return render(request, 'MgForSchoolTemp/home_page.html')

def account_page(request):
    return render(request, 'MgForSchoolTemp/account.html')

@NPlus
@login_required(login_url='/accounts/login/')
def OrderCreateForm(request):
    if request.method == 'POST':
        order_form = OrderForm(request.POST)
        if order_form.is_valid():
            order = order_form.save(commit=False)
            order.user = request.user
            if 'monthly' in request.POST:
                order.date_end = timezone.now() + timezone.timedelta(days=30)
            if 'seasonly' in request.POST:
                order.date_end = timezone.now() + timezone.timedelta(days=90)
            if 'yearly' in request.POST:
                order.date_end = timezone.now() + timezone.timedelta(days=360)
            order.save()
            return HttpResponse('success')
    else:
        order_form = OrderForm()
    return render(request, 'MgForSchoolTemp/order_create_form.html', {'form': order_form })