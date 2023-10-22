from django import forms
from .models import *

class CategoryEditForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['title', 'description']

class CategoryCreateForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['title', 'description']

class NoteCreateForm(forms.ModelForm):
    class Meta:
        model = Notes
        fields = ['title', 'description']
