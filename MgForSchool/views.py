from django.shortcuts import render
from django.http import HttpResponse
from django.views.generic import View
from .forms import OrderForm
from django.contrib.auth.decorators import login_required

# Create your views here.


def index(request):
    return render(request, 'MgForSchoolTemp/home_page.html')

def account_page(request):
    return render(request, 'MgForSchoolTemp/account.html')

@login_required(login_url='/accounts/login/')
def OrderCreateForm(request):
    if request.method == 'POST':
        order_form = OrderForm(request.POST)
        if order_form.is_valid():
            order = order_form.save(commit=False)
            order.user = request.user
            order.save()
            return HttpResponse('success')
    else:
        order_form = OrderForm()
    return render(request, 'MgForSchoolTemp/order_create_form.html', {'form': order_form})