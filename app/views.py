from django.shortcuts import render
from django.http import HttpResponse


def index(request):
	return render(request, "index.html", {})

def schedule(request):
	return render(request, "schedule.html", {})

def tutorial(request):
	return render(request, "tutorial.html", {})

def analytics(request):
	return render(request, "analytics.html", {})

