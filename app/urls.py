from django.urls import path
from django.views.generic.base import RedirectView, TemplateView

from . import views

urlpatterns = [
    path("home/", TemplateView.as_view(template_name='index.html'), name="index"),
    path("", RedirectView.as_view(permanent=True, url='/home/')),
]