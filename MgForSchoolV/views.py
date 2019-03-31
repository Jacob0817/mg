from django.shortcuts import render

def warning_login_required(request):
    if request.user.is_authenticated:
        return render(request, 'index.html')
    else:
        return render(request, 'MgForSchoolTemp/warning_login_required.html')