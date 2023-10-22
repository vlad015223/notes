from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from .views import *

urlpatterns = [
    path('', mainpage, name='home'),
    path('about/', about),
    path('completed/', completed),
    path('category/<str:category_title>/', category, name='category'),
    path('edit_category/<int:category_id>/', edit_category, name='edit_category'),
    path('edit_note/<int:note_id>/', edit_note, name='edit_note'),
    path('create_category/', create_category, name='create_category'),
    path('create_note/', create_note, name='create_note'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
