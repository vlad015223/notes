from django import forms
from .models import Category

class CategoryEditForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ['title', 'description']
