from django.db import models

class Category(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)


class Notes(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_published = models.BooleanField(default=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    # вместо id выводим title
    def __str__(self):
        return self.title
