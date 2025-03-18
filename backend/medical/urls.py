from django.urls import path
from .views import get_people, add_person, delete_person,home

urlpatterns = [
    path("people/", get_people, name="get_people"),
    path("people/add/", add_person, name="add_person"),
    path("people/delete/<int:id>/", delete_person, name="delete_person"),
]
