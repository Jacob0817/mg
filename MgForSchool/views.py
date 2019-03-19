from django.shortcuts import render
# Create your views here.


def index(request):
    return render(request, 'MgForSchoolTemp/home_page.html')

def account_page(request):
    return render(request, 'MgForSchoolTemp/account.html')
