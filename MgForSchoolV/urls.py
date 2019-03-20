from django.conf.urls import url
from django.contrib.auth import views as auth_views
from django.urls import path
from django.views.generic.base import TemplateView
urlpatterns = [
    url(r'^$', TemplateView.as_view(template_name='index.html')),
    url(r'^class1$', TemplateView.as_view(template_name='index.html')),
    url(r'^class2$', TemplateView.as_view(template_name='index.html')),
    url(r'^class3$', TemplateView.as_view(template_name='index.html')),
    url(r'^class4$', TemplateView.as_view(template_name='index.html')),
    url(r'^class5$', TemplateView.as_view(template_name='index.html')),
    url(r'^class6$', TemplateView.as_view(template_name='index.html')),
    url(r'^class7$', TemplateView.as_view(template_name='index.html')),
    url(r'^class8$', TemplateView.as_view(template_name='index.html')),
    url(r'^class9$', TemplateView.as_view(template_name='index.html')),
]