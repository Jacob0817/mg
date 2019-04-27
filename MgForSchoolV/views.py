from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from MgForSchool.models import OrderRecord
from mg.decorator import NPlusT, NPlusWait, NPlusVal
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse

@login_required(login_url='/accounts/login/')
@NPlusVal#检查是否有过期订单
@NPlusWait#检查订单是否待审核
@NPlusT#检查是否为会员
@csrf_protect
@never_cache
def MgForSchool(request):
    return render(request, 'index.html')
    '''
    else:
        return render(
            request,
            'MgForSchoolTemp/warning_login_required.html',
            {'warning_msg':'访问节点魔方教学课程请先登录', 'relocation':'登录页面', 'relocate':'/accounts/login/',}
        )
'''

@csrf_protect
def ajax_user_name(request):
    a = {'name':request.user.name}
    return JsonResponse(a, safe=False)
