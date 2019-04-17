from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from MgForSchool.models import OrderRecord
from mg.decorator import NPlusT


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
