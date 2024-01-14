from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import sqlite3
import os
import json
import requests
import google.oauth2.credentials
import googleapiclient.discovery
import google_auth_oauthlib.flow
from django.shortcuts import redirect
from django.urls import reverse
import time

PROJECT_PATH = os.path.abspath(os.path.dirname(__name__) + os.path.dirname(".."))
with open(os.path.join(PROJECT_PATH, 'secrets.json')) as file:
    SECRETS = json.loads(file.read())['web']

# todo add more scopes
SCOPES = ['https://www.googleapis.com/auth/classroom.courses.readonly']
API_SERVICE_NAME = 'classroom'
API_VERSION = 'v1'


def index(request):
	return render(request, "index.html", {})

def schedule(request):
	return render(request, "schedule.html", {})

def tutorial(request):
	return render(request, "tutorial.html", {})

def analytics(request):
	return render(request, "analytics.html", {})

def add_info(request):
	send_data = {}

	if request.user.is_authenticated:
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
				# print(json.loads(row[6])['email'], request.user.email)
				if json.loads(row[6])['email'] == request.user.email:
					info = json.loads(row[6])
					if "courses" in info:
						send_data = info['courses']
						break

		except sqlite3.Error as error:
			print("Failed to read data from sqlite table", error)

	return render(request, "add_info.html", {"courses": send_data})#send_data)

@csrf_exempt
def test_api_request(request):
	if 'credentials' not in request.session:
		return redirect('authorize')

	credentials = google.oauth2.credentials.Credentials(**request.session['credentials'])

	classroom = googleapiclient.discovery.build(
		API_SERVICE_NAME, API_VERSION, credentials=credentials)

	print(dir(classroom))

	request.session['credentials'] = credentials_to_dict(credentials)


@csrf_exempt
def authorize(request):
	flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(PROJECT_PATH + "\\secrets.json",
		scopes=SCOPES)

	flow.redirect_uri = request.build_absolute_uri(reverse("oauth2callback"))

	authorization_url, state = flow.authorization_url(
		access_type='offline',
		include_granted_scopes='true'
	)

	print(authorization_url)

	request.session['state'] = state

	return redirect(authorization_url)  # prone to failure


@csrf_exempt
def oauth2callback(request):
	state = request.session['state']

	flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(PROJECT_PATH + "/secrets.json/",
		scopes=SCOPES)
	flow.redirect_uri = request.build_absolute_uri(reverse("oauth2callback"))

	authorizaton_response = request.build_absolute_uri()  # prone to failure
	flow.fetch_token(authorization_respoonse=authorization_response)

	credentials = flow.credentials
	request.session['credentials'] = credentials_to_dict(credentials)

	return redirect("test_api_request")


def credentials_to_dict(credentials):
  return {'token': credentials.token,
          'refresh_token': credentials.refresh_token,
          'token_uri': credentials.token_uri,
          'client_id': credentials.client_id,
          'client_secret': credentials.client_secret,
          'scopes': credentials.scopes}


@csrf_exempt
def get_user(request):
	if request.method == "POST":
		for i in request.body.decode().split("\n"):
			if len(i) > 0 and i[0].isnumeric():
				fetch_database(i)
		# fetch_database(uid)
	return HttpResponse("thanks!")

@csrf_exempt
def add_mark(request):
	if request.method == "POST":
		for i in request.body.decode().split("\n"):
			if len(i) > 0 and i[0].isnumeric():
				fetch_database(i)
		# fetch_database(uid)
	return HttpResponse("thanks!")

@csrf_exempt
def add_course(request):
	print("HI")
	if request.method == "POST":
		print(request.POST['data'])

	return redirect("/add_info/")


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
			if row[2][:10] == uid[:10]:
				return row
		# print(rows)

	except sqlite3.Error as error:
		print("Failed to read data from sqlite table", error)


'''
if __name__ == "__main__":
	# When running locally, disable OAuthlib's HTTPs verification.
	# ACTION ITEM for developers:
	#     When running in production *do not* leave this option enabled.
	# os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

	authorization_url, state = flow.authorization_url(
		access_type='offline',
		include_granted_scopes='true'
	)
'''
