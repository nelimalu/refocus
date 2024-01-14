from django.urls import path
from django.views.generic.base import RedirectView, TemplateView

from . import views

urlpatterns = [
    path("home/", views.index, name="index"),
    path("", RedirectView.as_view(permanent=True, url='/home/')),

    path('schedule/', views.schedule, name="schedule"),
    path('tutorial/', views.tutorial, name="tutorial"),
    path('analytics/', views.analytics, name="analytics"),
    path('get_user/', views.get_user, name="get_user"),

    path('authorize/', views.authorize, name="authorize"),
    path('oauth2callback/', views.oauth2callback, name="oauth2callback"),
    path('test_api_request/', views.test_api_request, name="test_api_request"),

]