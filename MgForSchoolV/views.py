from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from MgForSchool.models import OrderRecord
from mg.decorator import NPlusT, NPlusWait, NPlusVal
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

import urllib.request as urlreq
import json

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

#获取用户名API
@csrf_protect
@never_cache
def ajax_user_name(request):
    user_name = {'name':request.user.name, 'id':request.user.id}
    return JsonResponse(user_name, safe=False)

@csrf_protect
@never_cache
def ajax_max_login(request):
    try:
        MaxLogin = request.user.orders.get(is_val=True).group_order
        max_login_count = {'MaxLogin':MaxLogin}
    except:
        max_login_count = {'MaxLogin':'1'}
    return JsonResponse(max_login_count, safe=False)

#获取用户登录地点API
@csrf_protect
@never_cache
def ajax_user_location(request):
    if 'HTTP_X_FORWARDED_FOR' in request.META:
        _ip = request.META['HTTP_X_FORWARDED_FOR']
    else:
        _ip = request.META['REMOTE_ADDR']
    try:
        apiurl = "http://ip.taobao.com/service/getIpInfo.php?ip=" + _ip
        content = urlreq.urlopen(apiurl).read()
        data = json.loads(content)['data']
        code = json.loads(content)['code']
        if code == 0:
            location = {'country':data["country"], 'region':data["region"], 'city':data["city"], 'regist':request.user.orders.get(is_val=True).location}
            return JsonResponse(location, safe=False)
        if code == 1:
            fail = {'fail':'API fail'}# api 查询失败，错误代码1
            return JsonResponse(fail, safe=False)
    except:
        fail = {'fail':'wrong url'}# 向api传值错误或api不存在
        return JsonResponse(fail, safe=False)
