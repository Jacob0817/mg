"""mg URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))

"""
from django.contrib import admin
from django.urls import path, include
from MgForSchool import views as MgS_views
from django.conf import settings
from django.views.generic.base import TemplateView
from django.conf.urls.static import static
urlpatterns = [
    path('accounts/', include('users.urls')),
    path('', MgS_views.index, name='MgSindex'),
    path('account/', MgS_views.account_page, name='person_file'),
    path('mg/', TemplateView.as_view(template_name='index.html')),
    path('mg/class1', TemplateView.as_view(template_name='index.html')),
    path('mg/class2', TemplateView.as_view(template_name='index.html')),
    path('mg/class3', TemplateView.as_view(template_name='index.html')),
    path('mg/class4', TemplateView.as_view(template_name='index.html')),
    path('mg/class5', TemplateView.as_view(template_name='index.html')),
    path('mg/class6', TemplateView.as_view(template_name='index.html')),
    path('mg/class7', TemplateView.as_view(template_name='index.html')),
    path('mg/class8', TemplateView.as_view(template_name='index.html')),
    path('mg/class9', TemplateView.as_view(template_name='index.html')),
    path('admin/', admin.site.urls),
    path(r'static/',MgS_views.index, name='MgSindex'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
