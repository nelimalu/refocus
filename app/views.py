from django.shortcuts import render
from django.http import HttpResponse


def index(request):
	context = {"logged_in": False}
	return render(request, "index.html", context)

