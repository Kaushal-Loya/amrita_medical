from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('medical.urls')),  # Correctly include medical.urls
    path('api/auth/', include('djoser.urls')),  # Include Djoser URLs
    path('api/auth/', include('djoser.urls.authtoken')),  # Include token authentication endpoints
]
