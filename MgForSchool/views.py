from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import View
from .forms import OrderForm
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from .models import OrderRecord
from mg.decorator import NPlusF, NPlusWait, NPlusVal
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect

# Create your views here.
def index(request):
    return render(request, 'MgForSchoolTemp/home_page.html')

@login_required(login_url='/accounts/login/')
@NPlusVal
@csrf_protect
@never_cache
def account_page(request):
    if request.method == 'POST':
        user_id = request.POST['user']
        value = request.POST['value']
        last = request.POST['last']
        OrderRecord.objects.filter(user_id = user_id, SOM=0).update(
            SOM=value,
            date_start = timezone.now(),
            date_end = timezone.now() + timezone.timedelta(days=int(last))
            )
    if request.user.is_superuser:
        try:
            orders = request.user.orders
            val_order = orders.get(is_val=True)
            day_end = val_order.date_end
        except OrderRecord.DoesNotExist:
            return  render(request, 'MgForSchoolTemp/account.html', {'day_end':'未购买'})
        try:
            order_list = OrderRecord.objects.filter(SOM=0, is_val=True)
        except OrderRecord.DoesNotExist:
            order_list = []
        return render(request, 'MgForSchoolTemp/account.html', {'day_end':day_end, 'order_list':order_list})
    else:
        try:
            orders = request.user.orders
            val_order = orders.get(is_val=True)
            day_end = val_order.date_end
        except OrderRecord.DoesNotExist:
            return  render(request, 'MgForSchoolTemp/account.html', {'day_end':'未购买'})
        return render(request, 'MgForSchoolTemp/account.html', {'day_end':day_end})
        

@login_required(login_url='/accounts/login/')
@NPlusVal#检查是否有过期订单
@NPlusWait#检查是否有待支付的订单
@NPlusF#检查是否有激活的订单
@csrf_protect
@never_cache
def OrderCreateForm(request):
    if request.method == 'POST':
        order_form = OrderForm(request.POST)
        if order_form.is_valid():
            order = order_form.save(commit=False)
            order.user = request.user
            if 'monthly' in request.POST:
                order.date_end = timezone.now() + timezone.timedelta(days=30)
                order.date_last = 30
            if 'seasonly' in request.POST:
                order.date_end = timezone.now() + timezone.timedelta(days=90)
                order.date_last = 60
            if 'yearly' in request.POST:
                order.date_end = timezone.now() + timezone.timedelta(days=360)
                order.date_last = 360
            order.save()
            return render(
                request,
                'MgForSchoolTemp/warning.html',
                {'warning_msg':'订单已提交，管理员将在一个工作日内完成审核', 'relocation':'网站首页', 'relocate':'/',}
            )
    else:
        order_form = OrderForm()
    return render(request, 'MgForSchoolTemp/order_create_form.html', {'form': order_form })