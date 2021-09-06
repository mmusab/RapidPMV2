import mysql.connector
from flask import Flask, request, render_template
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from json import dumps
from flask_jsonpify import jsonify
import json
app = Flask(__name__)
# api = Api(app)
CORS(app)

#### MySQL #######3
# initializing database connection
mydb = mysql.connector.connect(
  host="localhost",
  user="rapidpm",
  password="password",
  database = "PM_dataBase",
  auth_plugin='mysql_native_password'
)

# defining cursor to navigate through database
mycursor = mydb.cursor()

#### functions #####
def checkLogin(userEmail,userPassword):
  query = "SELECT password FROM customers WHERE email = '" + userEmail + "';"
  mycursor.execute(query)
  password = mycursor.fetchall()
  json_data = []
  if(password):
    if(password[0][0] == userPassword):
      json_data.append(dict(zip(["message"], ["Welcome"])))
    else:
      json_data.append(dict(zip(["message"], ["Incorrect password"])))
  else:
    json_data.append(dict(zip(["message"], ["Email address not found"])))
  return json.dumps(json_data)

@app.route('/login/<userEmail>/<userPassword>', methods=['GET', 'POST'])
def login(userEmail,userPassword):
  ret = checkLogin(userEmail,userPassword)
  return (ret)

app.run(host='0.0.0.0', port=5002, debug=True)
