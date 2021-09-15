import time

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
  database = "RPM_dataBase",
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

@app.route('/company', methods=['GET', 'POST'])
def company():
  company = request.json
  pairs = company.items()
  key = []
  value = []
  for k, v in pairs:
    key.append(str(k))
    value.append(str(v))
  key = tuple(key)
  value = tuple(value)
  sql = "INSERT INTO company (" + ", ".join(key) + ") VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
  mycursor.execute(sql, value)
  mydb.commit()
  sql = "SELECT LAST_INSERT_ID()"
  mycursor.execute(sql)
  companyId = {"message": str(mycursor.fetchall()[0]).split('(')[1].split(',')[0]};
  return jsonify(companyId)
  # return ({"message": "customer received"})

@app.route('/customer', methods=['GET', 'POST'])
def customer():
  customer = request.json
  del customer['customer_id']
  print(customer)
  pairs = customer.items()
  key = []
  value = []
  for k, v in pairs:
    key.append(str(k))
    value.append(str(v))
  key = tuple(key)
  value = tuple(value)
  sql = "INSERT INTO customers (" +  ", ".join(key) + ") VALUES (%s, %s, %s, %s, %s, %s, %s)"
  mycursor.execute(sql, value)
  mydb.commit()
  sql = "SELECT LAST_INSERT_ID()"
  mycursor.execute(sql)
  customerId = {"message": str(mycursor.fetchall()[0]).split('(')[1].split(',')[0]};
  return jsonify(customerId)

@app.route('/getUsers/<company_id>', methods=['GET', 'POST'])
def getUsers(company_id):
  sql = "SELECT * FROM RPM_dataBase.customers WHERE company_id = '" + company_id + "';"
  mycursor.execute(sql)
  result = mycursor.fetchall()
  header = mycursor.description
  print(header)
  row_headers = [x[0] for x in mycursor.description]
  print(row_headers)
  result = [dict(zip(row_headers, res)) for res in result]
  # users = {"message": result};
  print(result)
  return jsonify(result)

@app.route('/deleteUser/<customer_id>', methods=['GET', 'POST'])
def deleteUser(customer_id):
  sql = "DELETE FROM customers WHERE customer_id = '" + customer_id + "';"
  mycursor.execute(sql)
  mydb.commit()
  return ({"message":"success"})

app.run(host='0.0.0.0', port=5002, debug=True)
