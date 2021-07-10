"""testui URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
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
import os
from django.conf.urls import url
from django.contrib import admin
from django.shortcuts import redirect
from django.urls import path, include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import routers

from testcase import views as testcase_views

API_VERSION = os.getenv('API_VERSION')
API_ROOT = f"api/{API_VERSION}/"

# URL pattern: ^testcase/$ Name: 'testcase-list' : GET|POST
# URL pattern: ^testcase/{pk}/$ Name: 'testcase-detail': GET|PUT|PATCH|DELETE
router = routers.DefaultRouter()
router.register('testcases', testcase_views.TestcaseViewSet, basename='testcase')
router.register('summary', testcase_views.SummaryViewSet, basename='summary')
router.register('execute', testcase_views.TestcaseExecute, basename='execute')

schema_view = get_schema_view(
   openapi.Info(
      title="TestUI API",
      default_version=f'{API_VERSION}',
      description="Test UI API Description",
      terms_of_service="NONE",
      contact=openapi.Contact(email="hm@testui.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('',  router.get_api_root_view()),
    path(API_ROOT, include(router.urls)),
    path('admin/', admin.site.urls),
    # url(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
    url('swagger/', schema_view.with_ui('swagger', cache_timeout=0)),
    url('redoc/', schema_view.with_ui('redoc', cache_timeout=0)),
]
pass
