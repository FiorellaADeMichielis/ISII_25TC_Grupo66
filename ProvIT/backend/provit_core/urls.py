"""
URL configuration for provit_core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
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
from django.http import HttpResponse

from proveedores_app.views import LocalidadListaView, ProvinciaListaView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('proveedores_app.urls')),  # ← era 'api.urls'
    path('api/provincias/', ProvinciaListaView.as_view(), name='ver-provincias'),
    path('api/localidades/', LocalidadListaView.as_view(), name='ver-localidades'),
    path('', lambda request: HttpResponse('API corriendo. Frontend en :5173')),
]