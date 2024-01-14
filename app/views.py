from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import sqlite3
import os
import json


def index(request):
	return render(request, "index.html", {})

def schedule(request):
	return render(request, "schedule.html", {})

def tutorial(request):
	return render(request, "tutorial.html", {})

def analytics(request):
	return render(request, "analytics.html", {})

@csrf_exempt
def get_user(request):
	print("AAAAAAH")
	if request.method == "POST":
		for i in request.body.decode().split("\n"):  # this 3 is really hacky
			if len(i) > 0 and i[0].isnumeric():
				fetch_database(i)
		# fetch_database(uid)
	return HttpResponse("thanks!")


def fetch_database(uid):
	try:
		# Make sure to find the file.db in the script directory
		BASE_DIR = os.path.abspath(os.path.join(os.path.dirname( __file__ ), '..'))
		db_path = os.path.join(BASE_DIR, "db.sqlite3")
		# print(BASE_DIR)
		conn = sqlite3.connect(db_path)

		cur = conn.cursor()
		cur.execute('SELECT * FROM socialaccount_socialaccount')

		# Print everything from a table
		rows = cur.fetchall()
		for row in rows:
			print(row)
			print(uid)
			if row[2][:10] == uid[:10]:
				print("hi")
		# print(rows)

	except sqlite3.Error as error:
		print("Failed to read data from sqlite table", error)

