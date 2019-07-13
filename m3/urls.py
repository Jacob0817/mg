from django.conf.urls import url
from django.contrib.auth import views as auth_views
from django.urls import path
from m3 import views as m3_views
urlpatterns = [
    url(r'^$', m3_views.m3course, name='333 course'),
    url(r'^class1$', m3_views.m3course, name='333 course'),
    url(r'^class2$', m3_views.m3course, name='333 course'),
    url(r'^class3$', m3_views.m3course, name='333 course'),
    url(r'^class4$', m3_views.m3course, name='333 course'),
    url(r'^class5$', m3_views.m3course, name='333 course'),
    url(r'^class6$', m3_views.m3course, name='333 course'),
    url(r'^class7$', m3_views.m3course, name='333 course'),
    url(r'^class8$', m3_views.m3course, name='333 course'),
    url(r'^class9$', m3_views.m3course, name='333 course'),
    url(r'^api/ajax/user_name/$', m3_views.ajax_user_name, name='ajax-user-name'),
    url(r'^api/ajax/user_location/$', m3_views.ajax_user_location, name='ajax-login-location'),
    url(r'^api/ajax/max_login/$', m3_views.ajax_max_login, name='ajax-max-login'),
]