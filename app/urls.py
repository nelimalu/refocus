from django.urls import path
from django.views.generic.base import RedirectView

from . import views

urlpatterns = [
    path("home/", views.index, name="index"),
    path("", RedirectView.as_view(permanent=True, url='/home/')),
]