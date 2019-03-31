from django.conf.urls import url
from django.contrib.auth import views as auth_views
from django.urls import path
from MgForSchoolV import views as MgSV_views
urlpatterns = [
    url(r'^$', MgSV_views.warning_login_required, name='mg-for-school'),
    url(r'^class1$', MgSV_views.warning_login_required, name='mg-for-school'),
    url(r'^class2$', MgSV_views.warning_login_required, name='mg-for-school'),
    url(r'^class3$', MgSV_views.warning_login_required, name='mg-for-school'),
    url(r'^class4$', MgSV_views.warning_login_required, name='mg-for-school'),
    url(r'^class5$', MgSV_views.warning_login_required, name='mg-for-school'),
    url(r'^class6$', MgSV_views.warning_login_required, name='mg-for-school'),
    url(r'^class7$', MgSV_views.warning_login_required, name='mg-for-school'),
    url(r'^class8$', MgSV_views.warning_login_required, name='mg-for-school'),
    url(r'^class9$', MgSV_views.warning_login_required, name='mg-for-school'),
]