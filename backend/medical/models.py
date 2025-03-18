from django.db import models

class Person(models.Model):
    CATEGORY_CHOICES = [
        ('Student', 'Student'),
        ('Faculty', 'Faculty'),
        ('Staff', 'Staff'),
    ]

    name = models.CharField(max_length=255)
    age = models.IntegerField()
    blood_group = models.CharField(max_length=5)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES)
    contact_info = models.CharField(max_length=100)

    def __str__(self):
        return self.name
