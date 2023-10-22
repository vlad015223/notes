from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from .views import *

urlpatterns = [
    path('', mainpage, name='home'),
    path('about/', about),
    path('create/', create),
    path('completed/', completed),
    path('category/<str:category_title>/', category, name='category'),
    path('edit_category/<int:category_id>/', edit_category, name='edit_category'),
    path('edit_note/<int:note_id>/', edit_note, name='edit_note'),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
