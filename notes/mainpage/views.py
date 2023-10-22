from django.http import Http404, HttpResponse, HttpResponseBadRequest,\
    HttpResponseForbidden, HttpResponseNotFound, HttpResponseServerError
from django.shortcuts import redirect, render, get_object_or_404
from django.http import JsonResponse

from .forms import CategoryEditForm
from .models import *
from .utils import generate_slug

import json

all_categories = Category.objects.all()

def mainpage(request):
    category = Category.objects.all()
    return render(request, 'mainpage/main.html', {'title': 'Главная страница', 'category': category, 'categories': all_categories})

def about(request):
    return render(request, 'mainpage/about.html', {'title': 'О сайте', 'categories': all_categories})

def create(request):
    return render(request, 'mainpage/create.html', {'title': 'Создать запись', 'categories': all_categories})

def completed(request):
    return render(request, 'mainpage/completed.html', {'title': 'Выполненные заметки', 'categories': all_categories})

def category(request, category_title):
    category = Category.objects.get(title=category_title)
    category_entries = Notes.objects.filter(category=category)
    all_categories = Category.objects.all()
    return render(request, 'mainpage/notes.html', {'title': category.title, 'category_entries': category_entries, 'category_title': category_title, 'categories': all_categories})

def edit_category(request, category_id):
    if request.method == 'POST':
        record = Category.objects.get(pk=category_id)
        data = json.loads(request.body)
        field = data['field']
        new_content = data['new_content']
        
        if field == 'title':
            record.title = new_content
        elif field == 'description':
            record.description = new_content

        record.save()
        return JsonResponse({'message': 'Запись успешно обновлена.'})
    else:
        return JsonResponse({'message': 'Метод не разрешен.'}, status=405)

def edit_note(request, note_id):
    if request.method == 'POST':
        record = Notes.objects.get(pk=note_id)
        data = json.loads(request.body)
        field = data['field']
        new_content = data['new_content']

        if field == 'title':
            record.title = new_content
        elif field == 'description':
            record.description = new_content

        record.save()
        return JsonResponse({'message': 'Запись успешно обновлена.'})
    else:
        return JsonResponse({'message': 'Метод не разрешен.'}, status=405)

def pageNotFound(request, exception):
    return HttpResponseNotFound('<h1>404</h1><p><h2>Страница не найдена</h2></p>')

def pageForbidden(request, exception):
    return HttpResponseForbidden('<h1>403</h1><p><h2>Доступ запрещен</h2></p>')

def pageBadRequest(request, exception):
    return HttpResponseBadRequest('<h1>400</h1><p><h2>Не удалось выполнить запрос. Повторите попытку позже</h2></p>')

# def pageServerError(request, exception):
#     return HttpResponseServerError('<h1>500</h1><p><h2>Ошибка сервиса. Попробуйте позже</h2></p>')
