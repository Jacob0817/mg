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
from MgForSchool import views as Mg_views
from django.conf import settings
from django.views.generic.base import TemplateView
from django.conf.urls.static import static
urlpatterns = [
    path('accounts/', include('users.urls')),
    path('333/', include('m3.urls')),
    path('', Mg_views.index, name='Mg_index'),
    path('courses/', Mg_views.courses, name='Mg_courses'),
    path('account/', Mg_views.account_page, name='person_file'),
    path('order/', Mg_views.OrderCreateForm, name='order_creation_page'),
    path('admin/', admin.site.urls),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
