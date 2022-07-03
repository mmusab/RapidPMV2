import glob
import os
import time

import mysql.connector
from flask import Flask, request, render_template, send_file
from flask_cors import CORS, cross_origin
from flask_restful import Resource, Api
from json import dumps
from flask_jsonpify import jsonify
import json
import jwt
import smtplib, ssl
import math, random
import socket
import glob
import os.path
import shutil
from pathlib import Path

app = Flask(__name__)
# api = Api(app)
CORS(app)
app.secret_key = b'wellThisIsMySecreteKey'
socket.setdefaulttimeout(1)
soc = socket.socket()
host = '0.0.0.0'  # The server's hostname or IP address
port = 2004  # The port used by the server


@app.before_first_request
def do_something_only_once():
  # comSocket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
  soc.bind((host, port))
  soc.listen(5)


users = {}

#### MySQL #######3
# initializing database connection
mydb = mysql.connector.connect(
  host="82.69.10.205",
  user="musab",
  password="RAPIDPM",
  database="RPMnew_dataBase",
  auth_plugin='mysql_native_password'
)
ret = ""
# defining cursor to navigate through database
mycursor = mydb.cursor()


# cursor = cnx.cursor(buffered=True)

######### Login ###########
def Login():
  global users
  try:
    print("checking connection1")
    conn, addr = soc.accept()
    print("checking connection2")
    if (conn):
      print("Got connection from", addr)
      length_of_message = int.from_bytes(conn.recv(2), byteorder='big')
      msg = conn.recv(length_of_message).decode("UTF-8")
      print(msg)
      users["connection"] = conn
    return True
  except socket.timeout:
    connec = users["connection"]
    if connec:
      initialMsg = "you still there?".encode("UTF-8")
      connec.send(len(initialMsg).to_bytes(2, byteorder='big'))
      connec.send(initialMsg)

      length_of_message = int.from_bytes(connec.recv(2), byteorder='big')
      initialResponse = connec.recv(length_of_message).decode("UTF-8")
      if (initialResponse == "yes"):
        print("client is still running")
      else:
        return False
    print("time out")
    return True


#### functions #####
def checkLogin(userEmail, userPassword):
  query = "SELECT cu.password, co.RPM, co.company_id, cu.user_id, cu.company_role FROM user cu, company co WHERE cu.email = '" + userEmail + "' and cu.company_id = co.company_id;"
  mycursor.execute(query)
  result = mycursor.fetchall()
  json_data = {}
  if (result):
    print(result)
    if (result[0][0] == userPassword):
      if (result[0][1] != "Yes"):
        json_data["authorized"] = "True"
        json_data["RPM"] = "False"
        json_data["message"] = ["Welcome"]
        json_data["compId"] = [result[0][2]]
        json_data["id"] = [result[0][3]]
        json_data["role"] = [result[0][4]]
      else:
        json_data["authorized"] = "True"
        json_data["RPM"] = "True"
        json_data["message"] = ["Welcome RPM"]
        json_data["compId"] = [result[0][2]]
        json_data["id"] = [result[0][3]]
        json_data["role"] = [result[0][4]]
    else:
      json_data["authorized"] = "False"
      json_data["RPM"] = "RPM"
      json_data["message"] = ["Incorrect password"]
      json_data["compId"] = ["compId"]
      json_data["id"] = ["id"]
      json_data["role"] = ["role"]
  else:
    json_data["authorized"] = "False"
    json_data["message"] = ["Email address not found"]
  return (json.dumps(json_data), json_data)


@app.route('/openArtefact/<artId>/<location_type>', methods=['GET', 'POST'])
def openArtefact(artId, location_type):
  combinedData = {}
  global users
  try:
    if Login():
      import serverTest
      if users:
        if not location_type == "User defined default locations":
          sql = "SELECT * FROM RPMnew_dataBase.artefact WHERE artefact_id = '" + artId + "';"
          mycursor.execute(sql)
          result = mycursor.fetchall()
          row_headers = [x[0] for x in mycursor.description]
          combinedData = [dict(zip(row_headers, res)) for res in result]
          combinedData = combinedData[0]
      else:
        raise Exception()
      try:
        if (combinedData['artefact_name'] + '.docx' not in os.listdir(combinedData['location_url'])):
          shutil.copy(os.path.join(combinedData['template_url']),
                      os.path.join(combinedData['location_url'], combinedData['artefact_name'] + '.docx'))
      except:
        if (location_type == 'User defined default locations'):
          combinedData['location_type'] = location_type
          return jsonify({"message": serverTest.server(str(combinedData), users["connection"])})
        else:
          return jsonify({"message": "file not found"})
      combinedData['downloadType'] = 'artefact'
      combinedData = json.dumps(combinedData)
      combinedData = json.loads(combinedData)
      message = {"message": "open request sent to client"}
      print(str(combinedData))
      serverTest.server(str(combinedData), users["connection"])
      return jsonify(message)
    else:
      users = {}
      raise Exception()
  except:
    return jsonify({"message": "make sure client is running"})


@app.route('/download/<loc>/<name>', methods=['GET', 'POST'])
def download(loc, name):
  print("inside download endpoint")
  path = loc.replace("\\", "/") + name + ".docx"
  # if(name == "template"):
  #   path = loc.split("-")[1].replace("\\","/")
  # path = "C:\\RapidPM\\RapidPM\\a10-exception-report-v101.docx"
  return send_file(path, as_attachment=True)


@app.route('/upload', methods=['GET', 'POST'])
def upload():
  print("inside upload endpoint")
  f = request.files['videoFile']
  print(f)
  # tempUrl = request.form["title"]
  # tempUrl = "/home/jc/RapidPM/RapidPM/" + tempUrl
  # fileType = request.form["description"]
  # id = request.form["id"]
  locationUrl = request.form["location"]
  if f:
    # if(fileType == "template"):
    #   pid = request.form["projectId"]
    #   sql = "INSERT INTO projects_artefactTypeDefault (ArtefactType, TemplateUrl, LocationUrl, Manadatory, Multiples, project_id)(SELECT ArtefactType, '" + "s-" + tempUrl.replace("\\\\","/") + "', LocationUrl, Manadatory, Multiples, '" + pid + "' FROM projects_artefactTypeDefault WHERE artefactType_id ='" + id + "')"
    #   mycursor.execute(sql)
    #   mydb.commit()
    #   sql = "INSERT INTO ProjectsTemplates (project_id, artefactType_id) VALUES (%s, %s)"
    #   cust = (int(pid), mycursor.lastrowid)
    #   mycursor.execute(sql, cust)
    #   mydb.commit()
    #   f.save(tempUrl.replace("\\\\","/"))
    # else:
    f.save(locationUrl + f.filename)
    return "Success"


@app.route('/login/<userEmail>/<userPassword>', methods=['GET', 'POST'])
def login(userEmail, userPassword):
  ret, json_data = checkLogin(userEmail, userPassword)
  print(ret)
  if (json_data["authorized"] == "True"):
    encoded_jwt = jwt.encode(
      {"email": userEmail, "password": userPassword, "usrId": json_data["id"], "compId": json_data["compId"]}, "secret",
      algorithm="HS256")
    print(encoded_jwt)
    json_data["jwt"] = str(encoded_jwt)
    ret = json.dumps(json_data)
  return (ret)


@app.route('/company', methods=['GET', 'POST'])
def company():
  company = request.json
  print(company)
  compId = company['company_id']
  del company['company_id']
  pairs = company.items()
  key = []
  value = []
  for k, v in pairs:
    key.append(str(k))
    value.append(str(v))
  key = tuple(key)
  value = tuple(value)
  print(value)
  if (compId == ""):
    sql = "INSERT INTO company (" + ", ".join(key) + ") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
    mycursor.execute(sql, value)
    mydb.commit()
    sql = "SELECT LAST_INSERT_ID()"
    mycursor.execute(sql)
    companyId = {"message": str(mycursor.fetchall()[0]).split('(')[1].split(',')[0]}
    os.mkdir("/home/musab/RapidPMV2/artefacts/" + companyId["message"])
    return jsonify(companyId)
  else:
    sql = "UPDATE company SET RPM = '" + value[0] + "', company_name = '" + value[1] + "', contact_name = '" + value[
      2] + "', address_line1 = '" + value[
            3] + "', address_line2 = '" + value[4] + "', address_line3 = '" + value[5] + "', city = '" + value[
            6] + "',country = '" + \
          value[7] + "',postal_code = '" + value[8] + "' WHERE company_id = '" + str(compId) + "';"
    # sql = "UPDATE user SET (" + ", ".join(key) + ") VALUES (%s, %s, %s, %s, %s, %s, %s) WHERE user_id = '" + str(custmId) + "';"
    mycursor.execute(sql)
    mydb.commit()
    companyId = {"message": str(compId)}
    return jsonify(companyId)
  #
  # sql = "INSERT INTO company (" + ", ".join(key) + ") VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
  # mycursor.execute(sql, value)
  # mydb.commit()
  # sql = "SELECT LAST_INSERT_ID()"
  # mycursor.execute(sql)
  # companyId = {"message": str(mycursor.fetchall()[0]).split('(')[1].split(',')[0]};
  # return jsonify(companyId)
  # # return ({"message": "customer received"})


@app.route('/user', methods=['GET', 'POST'])
def user():
  customer = request.json
  print(customer)
  custmId = customer['user_id']
  del customer['user_id']
  pairs = customer.items()
  key = []
  value = []
  for k, v in pairs:
    key.append(str(k))
    value.append(str(v))
  key = tuple(key)
  value = tuple(value)
  print(value)
  if (custmId == ""):
    sql = "INSERT INTO user (" + ", ".join(key) + ") VALUES (%s, %s, %s, %s, %s, %s, %s)"
    mycursor.execute(sql, value)
    mydb.commit()
    sql = "SELECT LAST_INSERT_ID()"
    mycursor.execute(sql)
    customerId = {"message": str(mycursor.fetchall()[0]).split('(')[1].split(',')[0]}
    return jsonify(customerId)
  else:
    sql = "UPDATE user SET company_id = '" + customer['company_id'] + "', company_role = '" + customer[
      'company_role'] + "', email = '" + customer['email'] + "', name = '" + customer['name'] + "', password = '" + \
          customer['password'] + "', status = '" + customer['status'] + "',verified = '" + customer[
            'verified'] + "' WHERE user_id = '" + str(custmId) + "';"
    # sql = "UPDATE user SET (" + ", ".join(key) + ") VALUES (%s, %s, %s, %s, %s, %s, %s) WHERE user_id = '" + str(custmId) + "';"
    mycursor.execute(sql)
    mydb.commit()
    customerId = {"message": str(custmId)}
    return jsonify(customerId)


@app.route('/type', methods=['GET', 'POST'])
def type():
  typeDefault = request.json
  print(typeDefault)
  typeId = typeDefault['type_id']
  del typeDefault['type_id']
  pairs = typeDefault.items()
  key = []
  value = []
  for k, v in pairs:
    key.append(str(k))
    value.append(str(v))
  key = tuple(key)
  value = tuple(value)
  print(value)
  if (typeId == ""):
    sql = "INSERT INTO artefact_type_default (" + ", ".join(key) + ") VALUES (%s, %s, %s, %s, %s, %s)"
    mycursor.execute(sql, value)
    mydb.commit()
    sql = "SELECT LAST_INSERT_ID()"
    mycursor.execute(sql)
    typeId = {"message": str(mycursor.fetchall()[0]).split('(')[1].split(',')[0]}
    return jsonify(typeId)
  else:
    sql = "UPDATE artefact_type_default SET project_id = '" + str(typeDefault['project_id']) + "', artefact_type = '" + \
          typeDefault['artefact_type'] + "', location_url = '" + typeDefault['location_url'] + "', template_url = '" + \
          typeDefault['template_url'] + "', multiples = '" + typeDefault['multiples'] + "', mandatory = '" + \
          typeDefault['mandatory'] + "'WHERE type_id = '" + str(typeId) + "';"
    # sql = "UPDATE user SET (" + ", ".join(key) + ") VALUES (%s, %s, %s, %s, %s, %s, %s) WHERE user_id = '" + str(custmId) + "';"
    mycursor.execute(sql)
    mydb.commit()
    typeId = {"message": str(typeId)}
    return jsonify(typeId)


@app.route('/typeBulkAdd', methods=['GET', 'POST'])
def typeBulkAdd():
  typeDefaults = request.json
  for typeDefault in typeDefaults:
    print(typeDefault)
    typeId = typeDefault['type_id']
    del typeDefault['type_id']
    pairs = typeDefault.items()
    key = []
    value = []
    for k, v in pairs:
      key.append(str(k))
      value.append(str(v))
    key = tuple(key)
    value = tuple(value)
    print(value)
    if (typeId == ""):
      sql = "INSERT INTO artefact_type_default (" + ", ".join(key) + ") VALUES (%s, %s, %s, %s, %s, %s)"
      mycursor.execute(sql, value)
      mydb.commit()
      # sql = "SELECT LAST_INSERT_ID()"
      # mycursor.execute(sql)
      # mydb.commit()
      # typeId = {"message": str(mycursor.fetchall()[0]).split('(')[1].split(',')[0]}
      # return jsonify(typeId)
    else:
      sql = "UPDATE artefact_type_default SET project_id = '" + str(
        typeDefault['project_id']) + "', artefact_type = '" + typeDefault['artefact_type'] + "', location_url = '" + \
            typeDefault['location_url'] + "', template_url = '" + typeDefault['template_url'] + "', multiples = '" + \
            typeDefault['multiples'] + "', mandatory = '" + typeDefault['mandatory'] + "'WHERE type_id = '" + str(
        typeId) + "';"
      # sql = "UPDATE user SET (" + ", ".join(key) + ") VALUES (%s, %s, %s, %s, %s, %s, %s) WHERE user_id = '" + str(custmId) + "';"
      mycursor.execute(sql)
      mydb.commit()
  typeId = {"message": "successfull"}
  return jsonify(typeId)


@app.route('/project', methods=['GET', 'POST'])
def project():
  project = request.json
  print(project)
  projId = project['project_id']
  del project['project_id']
  pairs = project.items()
  key = []
  value = []
  for k, v in pairs:
    key.append(str(k))
    value.append(str(v))
  key = tuple(key)
  value = tuple(value)
  print(value)
  if (projId == ""):
    sql = "INSERT INTO project (" + ", ".join(key) + ") VALUES (%s, %s, %s, %s, %s, %s, %s, %s)"
    mycursor.execute(sql, value)
    mydb.commit()
    sql = "SELECT LAST_INSERT_ID()"
    mycursor.execute(sql)
    projectId = {"message": str(mycursor.fetchall()[0]).split('(')[1].split(',')[0]}
    os.mkdir("/home/musab/RapidPMV2/artefacts/" + str(project['company_id']) + '/' + str(projectId["message"]))
    return jsonify(projectId)
  else:
    sql = "UPDATE project SET project_name = '" + str(project[
                                                        'project_name']) + "', template = '" + str(
      project['template']) + "', status = '" + str(project['status']) + "', owner = '" + \
          str(project['owner']) + "', start = '" + str(project['start']) + "',end = '" + str(project[
                                                                                               'end']) + "',hierarchy_id_default = '" + str(
      project['hierarchy_id_default']) + "' WHERE project_id = '" + str(projId) + "';"
    # sql = "UPDATE user SET (" + ", ".join(key) + ") VALUES (%s, %s, %s, %s, %s, %s, %s) WHERE user_id = '" + str(custmId) + "';"
    mycursor.execute(sql)
    mydb.commit()
    customerId = {"message": str(projId)}
    return jsonify(customerId)


@app.route('/artefact/<contId>', methods=['GET', 'POST'])
def artefact(contId):
  path_exist = "default"
  artefact = request.form['artInfo']
  artefact = json.loads(artefact)
  location_type = request.form['location_type']
  if (request.files):
    file = request.files['file']
  else:
    file = []
  if file:
    try:
      filename = file.filename
      Path(artefact['location_url'].split('artefacts')[0] + '/templates').mkdir(parents=True, exist_ok=True)
      Path(artefact['location_url']).mkdir(parents=True, exist_ok=True)

      file.save(os.path.join(artefact['location_url'].split('artefacts')[0] + '/templates/', filename))
      shutil.copyfile(artefact['location_url'].split('artefacts')[0] + '/templates/' + filename,
                      artefact['location_url'] + artefact['artefact_name'].split('.')[0] + '.' + filename.split('.')[-1])
    except:
      message = {"message": 'urls not correct'}
      return jsonify(message)
  else:
    if (location_type == 'User defined default locations'):
      path_exist = openArtefact(artefact['artefact_id'], location_type)
      path_exist = path_exist.json['message']
      if path_exist == True:
        return jsonify({"message": 'url exists'})
      if path_exist == False:
        return jsonify({"message": 'URL do not exists'})

  if path_exist == "default":
    print(artefact)
    artId = artefact['artefact_id']
    del artefact['artefact_id']
    pairs = artefact.items()
    key = []
    value = []
    for k, v in pairs:
      key.append(str(k))
      value.append(str(v))
    key = tuple(key)
    value = tuple(value)
    print(value)
    if (artId == ""):
      sql = "INSERT INTO artefact (" + ", ".join(key) + ") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
      mycursor.execute(sql, value)
      mydb.commit()
      sql = "SELECT LAST_INSERT_ID()"
      mycursor.execute(sql)
      artefactId = {"message": str(mycursor.fetchall()[0]).split('(')[1].split(',')[0]}
      # print(artefactId)
      if (contId != "root"):
        value = (contId, artefactId['message'])
        sql = "INSERT INTO container_artefact_link (container_id, artefact_id) VALUES (%s, %s)"
        mycursor.execute(sql, value)
        mydb.commit()
      # os.mkdir("/home/musab/RapidPMV2/artefacts/" + str(project['company_id']) + '/' + artefact['project_id'] + '/' + str(artefactId["message"]))
      message = {"message": 'success'}
      return jsonify(message)
    else:
      sql = "UPDATE artefact SET artefact_type = '" + str(artefact[
                                                            'artefact_type']) + "', artefact_owner = '" + str(
        artefact['artefact_owner']) + "', artefact_name = '" + str(artefact['artefact_name']) + "', description = '" + \
            str(artefact['description']) + "', status = '" + str(artefact['status']) + "',create_date = '" + str(
        artefact[
          'create_date']) + "',update_date = '" + str(artefact['update_date']) + "',location_url = '" + str(
        artefact['location_url']) + "',template_url = '" + str(artefact['template_url']) + "',project_id = '" + str(
        artefact['project_id']) + "',template = '" + str(artefact['template']) + "' WHERE artefact_id = '" + str(
        artId) + "';"
      mycursor.execute(sql)
      mydb.commit()
      message = {"message": 'success'}
      return jsonify(message)
    return True
  else:
    return jsonify({"message": 'something went wrong make sure client is running'})


@app.route('/addHeirarchy/<heirName>', methods=['GET', 'POST'])
def addHeirarchy(heirName):
  sql = "INSERT INTO hierarchy_list (hierarchy_name) VALUES (%s)"
  # value=(str(heirName))
  # print("value is: " + value)
  mycursor.execute(sql, (heirName,))
  mydb.commit()
  sql = "SELECT LAST_INSERT_ID()"
  mycursor.execute(sql)
  heirarchyId = {"message": str(mycursor.fetchall()[0]).split('(')[1].split(',')[0]}
  return jsonify(heirarchyId)


@app.route('/getUsers/<company_id>', methods=['GET', 'POST'])
def getUsers(company_id):
  sql = "SELECT * FROM RPMnew_dataBase.user WHERE company_id = '" + company_id + "';"
  mycursor.execute(sql)
  result = mycursor.fetchall()
  header = mycursor.description
  # print(header)
  row_headers = [x[0] for x in mycursor.description]
  # print(row_headers)
  result = [dict(zip(row_headers, res)) for res in result]
  # users = {"message": result};
  print(result)
  return jsonify(result)


@app.route('/getArtefactDefaults/<project_id>', methods=['GET', 'POST'])
def getArtefactDefaults(project_id):
  sql = "SELECT * FROM RPMnew_dataBase.artefact_type_default WHERE project_id = '" + project_id + "';"
  mycursor.execute(sql)
  result = mycursor.fetchall()
  header = mycursor.description
  # print(header)
  row_headers = [x[0] for x in mycursor.description]
  # print(row_headers)
  result = [dict(zip(row_headers, res)) for res in result]
  # users = {"message": result};
  print(result)
  return jsonify(result)


@app.route('/getUser/<user_id>', methods=['GET', 'POST'])
def getUser(user_id):
  sql = "SELECT * FROM RPMnew_dataBase.user WHERE user_id = '" + user_id + "';"
  mycursor.execute(sql)
  result = mycursor.fetchall()
  header = mycursor.description
  # print(header)
  row_headers = [x[0] for x in mycursor.description]
  # print(row_headers)
  result = [dict(zip(row_headers, res)) for res in result]
  # users = {"message": result};
  print(result)
  return jsonify(result)


@app.route('/getprojects/<company_id>', methods=['GET', 'POST'])
def getprojects(company_id):
  sql = "SELECT * FROM RPMnew_dataBase.project WHERE company_id = '" + company_id + "';"
  mycursor.execute(sql)
  result = mycursor.fetchall()
  print(result)
  header = mycursor.description
  # print(header)
  row_headers = [x[0] for x in mycursor.description]
  # print(row_headers)
  result = [dict(zip(row_headers, res)) for res in result]
  # users = {"message": result};
  print(result)
  return jsonify(result)


@app.route('/getCompanies', methods=['GET', 'POST'])
def getCompanies():
  sql = "SELECT * FROM RPMnew_dataBase.company;"
  mycursor.execute(sql)
  result = mycursor.fetchall()
  header = mycursor.description
  # print(header)
  row_headers = [x[0] for x in mycursor.description]
  # print(row_headers)
  result = [dict(zip(row_headers, res)) for res in result]
  # users = {"message": result};
  print(result)
  return jsonify(result)


@app.route('/deleteType/<type_id>', methods=['GET', 'POST'])
def deleteType(type_id):
  sql = "DELETE FROM artefact_type_default WHERE type_id = '" + type_id + "';"
  mycursor.execute(sql)
  mydb.commit()
  return ({"message": "success"})


@app.route('/deleteUser/<user_id>', methods=['GET', 'POST'])
def deleteUser(user_id):
  sql = "DELETE FROM user WHERE user_id = '" + user_id + "';"
  mycursor.execute(sql)
  mydb.commit()
  return ({"message": "success"})


@app.route('/deleteProject/<project_id>', methods=['GET', 'POST'])
def deleteProject(project_id):
  sql = "DELETE FROM project WHERE project_id = '" + project_id + "';"
  try:
    mycursor.execute(sql)
    mydb.commit()
    return ({"message": "success"})
  except:
    return ({"message": "failed"})


@app.route('/deleteCompany/<company_id>', methods=['GET', 'POST'])
def deleteCompany(company_id):
  print("trying to delete company: " + company_id)
  sql = "DELETE FROM company WHERE company_id = '" + company_id + "';"
  try:
    mycursor.execute(sql)
    mydb.commit()
    return ({"message": "success"})
  except:
    return ({"message": "failed"})


@app.route('/getCompany/<companyId>', methods=['GET', 'POST'])
def getCompany(companyId):
  sql = "SELECT * FROM RPMnew_dataBase.company WHERE company_id = '" + companyId + "';"
  mycursor.execute(sql)
  result = mycursor.fetchall()
  header = mycursor.description
  # print(header)
  row_headers = [x[0] for x in mycursor.description]
  # print(row_headers)
  result = [dict(zip(row_headers, res)) for res in result]
  # users = {"message": result};
  print(result)
  return jsonify(result)


@app.route('/getProject/<projectId>', methods=['GET', 'POST'])
def getProject(projectId):
  sql = "SELECT * FROM RPMnew_dataBase.project WHERE project_id = '" + projectId + "';"
  mycursor.execute(sql)
  result = mycursor.fetchall()
  header = mycursor.description
  # print(header)
  row_headers = [x[0] for x in mycursor.description]
  # print(row_headers)
  result = [dict(zip(row_headers, res)) for res in result]
  # users = {"message": result};
  print(result)
  return jsonify(result)


@app.route('/getAdmin/<companyId>', methods=['GET', 'POST'])
def getAdmin(companyId):
  sql = "SELECT * FROM RPMnew_dataBase.user WHERE company_id = '" + companyId + "' and company_role = 'Admin';"
  mycursor.execute(sql)
  result = mycursor.fetchall()
  header = mycursor.description
  # print(header)
  row_headers = [x[0] for x in mycursor.description]
  # print(row_headers)
  result = [dict(zip(row_headers, res)) for res in result]
  # users = {"message": result};
  print(result)
  return jsonify(result)


@app.route('/getArtefacts/<projectId>', methods=['GET', 'POST'])
def getArtefacts(projectId):
  sql = "SELECT * FROM RPMnew_dataBase.artefact WHERE project_id = '" + projectId + "';"
  mycursor.execute(sql)
  result = mycursor.fetchall()
  header = mycursor.description
  # print(header)
  row_headers = [x[0] for x in mycursor.description]
  # print(row_headers)
  result = [dict(zip(row_headers, res)) for res in result]
  # users = {"message": result};
  print(result)
  return jsonify(result)


@app.route('/getArtefact/<artId>', methods=['GET', 'POST'])
def getArtefact(artId):
  sql = "SELECT * FROM RPMnew_dataBase.artefact WHERE artefact_id = '" + artId + "';"
  mycursor.execute(sql)
  result = mycursor.fetchall()
  header = mycursor.description
  # print(header)
  row_headers = [x[0] for x in mycursor.description]
  # print(row_headers)
  result = [dict(zip(row_headers, res)) for res in result]
  # users = {"message": result};
  print(result)
  return jsonify(result)


@app.route('/getContainer/<contId>', methods=['GET', 'POST'])
def getContainer(contId):
  sql = "SELECT * FROM RPMnew_dataBase.hierarchy_container WHERE container_id = '" + contId + "';"
  mycursor.execute(sql)
  result = mycursor.fetchall()
  header = mycursor.description
  # print(header)
  row_headers = [x[0] for x in mycursor.description]
  # print(row_headers)
  result = [dict(zip(row_headers, res)) for res in result]
  # users = {"message": result};
  print(result)
  return jsonify(result)


@app.route('/updateContainer/<contTitle>/<contId>', methods=['GET', 'POST'])
def updateContainer(contTitle, contId):
  sql = "UPDATE hierarchy_container SET container_title = '" + str(contTitle) + "' WHERE container_id = '" + str(
    contId) + "';"
  mycursor.execute(sql)
  mydb.commit()
  return ({"message": "success"})


# @app.route('/addArtefact/<artId>/<level>', methods=['GET', 'POST'])
# def getArtefacts(artId, level):
#   if(level == "child"):
#     sql = "INSERT INTO artefact (artefact_type, artefact_owner, artefact_name, description, status, create_date, update_date, location_url, template_url, project_id, template) SELECT artefact_type, artefact_owner, artefact_name, description, status, create_date, update_date, location_url, template_url, project_id, template FROM artefact WHERE artefact_id = '" + str(
#       a[0]) + "';"
#     mycursor.execute(sql)
#     mydb.commit()
#   sql = "SELECT * FROM RPMnew_dataBase.artefact WHERE project_id = '" + projectId + "';"
#   mycursor.execute(sql)
#   result = mycursor.fetchall()
#   header = mycursor.description
#   # print(header)
#   row_headers = [x[0] for x in mycursor.description]
#   # print(row_headers)
#   result = [dict(zip(row_headers, res)) for res in result]
#   # users = {"message": result};
#   print(result)
#   return jsonify(result)

@app.route('/addContainer/<containerName>/<root>/<projId>/<herId>', methods=['GET', 'POST'])
def addContainer(containerName, root, projId, herId):
  print("heirarchyid: " + herId)
  if (root == "root"):
    value = (containerName, projId, herId)
    sql = "INSERT INTO hierarchy_container (container_title, project_id, hierarchy_id) VALUES (%s, %s, %s)"
  if (root != "root"):
    value = (containerName, projId, herId, root)
    sql = "INSERT INTO hierarchy_container (container_title, project_id, hierarchy_id, parent_container_id) VALUES (%s, %s, %s, %s)"
  mycursor.execute(sql, value)
  mydb.commit()
  message = {"message": "success"}
  return jsonify(message)


@app.route('/getHeirarchyList', methods=['GET', 'POST'])
def getHeirarchyList():
  sql = "SELECT * FROM RPMnew_dataBase.hierarchy_list;"
  mycursor.execute(sql)
  result = mycursor.fetchall()
  row_headers = [x[0] for x in mycursor.description]
  result = [dict(zip(row_headers, res)) for res in result]
  print(result)
  return jsonify(result)


@app.route('/getContainers/<heirarchyId>/<projId>', methods=['GET', 'POST'])
def getContainers(heirarchyId, projId):
  sql = "SELECT * FROM RPMnew_dataBase.hierarchy_container where hierarchy_id = '" + heirarchyId + "' and project_id = '" + projId + "';"
  mycursor.execute(sql)
  result = mycursor.fetchall()
  row_headers = [x[0] for x in mycursor.description]
  result = [dict(zip(row_headers, res)) for res in result]
  print(result)
  return jsonify(result)


@app.route('/moveContainer/<contId>/<type>/<pContId>/<heirarchyId>', methods=['GET', 'POST'])
def moveContainer(contId, type, pContId, heirarchyId):
  if (type == "container"):
    sql = "UPDATE hierarchy_container SET parent_container_id = '" + str(pContId) + "' WHERE container_id = '" + str(
      contId) + "';"
    mycursor.execute(sql)
    mydb.commit()
  else:
    sql = "SELECT cal.* FROM RPMnew_dataBase.container_artefact_link cal, RPMnew_dataBase.hierarchy_container hc WHERE hc.container_id=cal.container_id and hc.hierarchy_id = '" + str(
      heirarchyId) + "' and cal.artefact_id = '" + str(contId) + "';"
    mycursor.execute(sql)
    contLinkInfo = mycursor.fetchall()
    if (contLinkInfo):
      previousContId = contLinkInfo[0][1]
    else:
      previousContId = ""
    val = (pContId, contId)
    sql = "INSERT INTO container_artefact_link (container_id, artefact_id) VALUES (%s, %s)"
    mycursor.execute(sql, val)
    mydb.commit()
    sql = "DELETE FROM RPMnew_dataBase.container_artefact_link WHERE artefact_id = '" + str(
      contId) + "' and container_id = '" + str(previousContId) + "';"
    # sql = "UPDATE container_artefact_link SET container_id = '" + str(pContId) + "' WHERE artefact_id = '" + str(
    #   contId) + "';"
    mycursor.execute(sql)
    mydb.commit()
  customerId = {"message": "success"}
  return jsonify(customerId)


def copyRecursive(hostId, destId):
  sql = "SELECT a.* FROM RPMnew_dataBase.artefact a, RPMnew_dataBase.container_artefact_link ca WHERE a.artefact_id = ca.artefact_id and ca.container_id = '" + str(
    hostId) + "';"
  mycursor.execute(sql)
  artefacts = mycursor.fetchall()
  for a in artefacts:
    sql = "INSERT INTO artefact (artefact_type, artefact_owner, artefact_name, description, status, create_date, update_date, location_url, template_url, project_id, template) SELECT artefact_type, artefact_owner, artefact_name, description, status, create_date, update_date, location_url, template_url, project_id, template FROM artefact WHERE artefact_id = '" + str(
      a[0]) + "';"
    mycursor.execute(sql)
    mydb.commit()
    artId = mycursor.lastrowid
    val = (destId, artId)
    sql = "INSERT INTO container_artefact_link (container_id, artefact_id) VALUES (%s, %s)"
    mycursor.execute(sql, val)
    mydb.commit()
  sql = "SELECT * FROM RPMnew_dataBase.hierarchy_container where parent_container_id = '" + str(hostId) + "';"
  mycursor.execute(sql)
  containers = mycursor.fetchall()
  for c in containers:
    sql = "INSERT INTO hierarchy_container (container_title, project_id, hierarchy_id, parent_container_id) SELECT container_title, project_id, hierarchy_id, '" + str(
      destId) + "' FROM hierarchy_container WHERE container_id = '" + str(c[0]) + "';"
    mycursor.execute(sql)
    mydb.commit()
    destId = mycursor.lastrowid
    hostId = c[0]
    copyRecursive(hostId, destId)


@app.route('/copyContainer/<contId>/<type>/<pContId>', methods=['GET', 'POST'])
def copyContainer(contId, type, pContId):
  if (type == "container"):
    sql = "INSERT INTO hierarchy_container (container_title, project_id, hierarchy_id, parent_container_id) SELECT container_title, project_id, hierarchy_id, '" + str(
      pContId) + "' FROM hierarchy_container WHERE container_id = '" + str(contId) + "';"
    mycursor.execute(sql)
    mydb.commit()
    destId = mycursor.lastrowid
    hostId = contId
    copyRecursive(hostId, destId)
  else:
    sql = "INSERT INTO artefact (artefact_type, artefact_owner, artefact_name, description, status, create_date, update_date, location_url, template_url, project_id, template) SELECT artefact_type, artefact_owner, artefact_name, description, status, create_date, update_date, location_url, template_url, project_id, template FROM artefact WHERE artefact_id = '" + str(
      contId) + "';"
    mycursor.execute(sql)
    mydb.commit()
    artId = mycursor.lastrowid
    val = (pContId, artId)
    sql = "INSERT INTO container_artefact_link (container_id, artefact_id) VALUES (%s, %s)"
    mycursor.execute(sql, val)
    mydb.commit()
  customerId = {"message": "success"}
  return jsonify(customerId)


def deleteRecursive(contId):
  ret = ""
  sql = "SELECT a.* FROM RPMnew_dataBase.artefact a, RPMnew_dataBase.container_artefact_link ca WHERE a.artefact_id = ca.artefact_id and ca.container_id = '" + str(
    contId) + "';"
  mycursor.execute(sql)
  artefacts = mycursor.fetchall()
  if (artefacts):
    return "error"
  # for a in artefacts:
  #   sql = "DELETE FROM RPMnew_dataBase.container_artefact_link WHERE artefact_id = '" + str(a[0]) + "';"
  #   mycursor.execute(sql)
  #   mydb.commit()
  #   sql = "DELETE FROM RPMnew_dataBase.artefact WHERE artefact_id = '" + str(a[0]) + "';"
  #   mycursor.execute(sql)
  #   mydb.commit()
  sql = "SELECT * FROM RPMnew_dataBase.hierarchy_container where parent_container_id = '" + str(contId) + "';"
  mycursor.execute(sql)
  containers = mycursor.fetchall()
  if (containers):
    for c in containers:
      ret = deleteRecursive(c[0])
  if (ret == "error"):
    return "error"
  sql = "DELETE FROM RPMnew_dataBase.hierarchy_container WHERE container_id = '" + str(contId) + "';"
  mycursor.execute(sql)
  mydb.commit()
  return "done"


@app.route('/deleteContainer/<contId>/<type>', methods=['GET', 'POST'])
def deleteContainer(contId, type):
  if (type == "container"):
    msg = deleteRecursive(contId)
  else:
    sql = "SELECT * FROM RPMnew_dataBase.artefact WHERE artefact_id = '" + contId + "';"
    mycursor.execute(sql)
    result = mycursor.fetchall()
    row_headers = [x[0] for x in mycursor.description]
    document = [dict(zip(row_headers, res)) for res in result]

    # sql = "DELETE cal FROM RPMnew_dataBase.container_artefact_link cal, RPMnew_dataBase.hierarchy_container hc WHERE hc.container_id=cal.container_id and hc.hierarchy_id = '" + str(heirarchyId) + "' and cal.artefact_id = '" + str(contId) + "';"
    sql = "DELETE FROM RPMnew_dataBase.container_artefact_link WHERE artefact_id = '" + str(contId) + "';"
    mycursor.execute(sql)
    mycursor.execute(sql)
    mydb.commit()
    sql = "DELETE FROM RPMnew_dataBase.artefact WHERE artefact_id = '" + str(contId) + "';"
    mycursor.execute(sql)
    mydb.commit()
    # print(document)
    print("document path is: " + document[0]['location_url'] + '/' + document[0]["artefact_name"] + '.docx')
    if (os.path.exists(document[0]['location_url'] + '/' + document[0]["artefact_name"] + '.docx')):
      print("deleting document")
      os.remove(document[0]['location_url'] + '/' + document[0]["artefact_name"] + '.docx')
    msg = "done"
  customerId = {"message": msg}
  return jsonify(customerId)


def recursive(projId, c):
  sql = "SELECT * FROM RPMnew_dataBase.hierarchy_container WHERE project_id = '" + projId + "' and parent_container_id = '" + str(
    c) + "';"
  mycursor.execute(sql)
  containers = mycursor.fetchall()
  jsn = []
  if (containers):
    for cont in containers:
      temp = {}
      childJson = []
      data = {}
      data['id'] = cont[0]
      data['node'] = cont[1]
      data['artefact_type'] = ""
      data['status'] = ""
      data['artefact_owner'] = ""
      temp["data"] = data
      sql = "SELECT a.* FROM RPMnew_dataBase.artefact a, RPMnew_dataBase.container_artefact_link ca WHERE a.artefact_id = ca.artefact_id and ca.container_id = '" + str(
        cont[0]) + "';"
      mycursor.execute(sql)
      artefacts = mycursor.fetchall()
      for a in artefacts:
        temp2 = {}
        data = {}
        data['id'] = str(a[0])
        data['node'] = str(a[3])
        data['artefact_type'] = str(a[1])
        data['status'] = str(a[5])
        data['artefact_owner'] = str(a[2])
        temp2["data"] = data
        childJson.append(temp2)
      result = recursive(projId, cont[0])
      if (result):
        for r in result:
          childJson.append(r)
        temp["children"] = childJson
      elif (childJson):
        temp["children"] = childJson
      jsn.append(temp)
    return jsn
  else:
    return jsn


@app.route('/getprojectTree/<projectId>/<heirId>', methods=['GET', 'POST'])
def getprojectTree(projectId, heirId):
  sql = "SELECT a.* FROM RPMnew_dataBase.artefact a WHERE a.project_id = '" + projectId + "' and a.artefact_id NOT IN (SELECT cal.artefact_id FROM RPMnew_dataBase.container_artefact_link cal, RPMnew_dataBase.hierarchy_container hc where cal.container_id=hc.container_id and hc.hierarchy_id = '" + heirId + "');"
  mycursor.execute(sql)
  pArtefacts = mycursor.fetchall()
  sql = "SELECT * FROM RPMnew_dataBase.hierarchy_container WHERE project_id = '" + projectId + "' and hierarchy_id = '" + heirId + "' and parent_container_id IS NULL;"
  mycursor.execute(sql)
  pcontainers = mycursor.fetchall()
  contJson = []
  for idx, pc in enumerate(pcontainers):
    temp = {}
    childJson = []
    data = {}
    data['id'] = pc[0]
    data['node'] = pc[1]
    data['artefact_type'] = ""
    data['status'] = ""
    data['artefact_owner'] = ""
    temp["data"] = data
    sql = "SELECT a.* FROM RPMnew_dataBase.artefact a, RPMnew_dataBase.container_artefact_link ca WHERE a.artefact_id = ca.artefact_id and ca.container_id = '" + str(
      pc[0]) + "';"
    mycursor.execute(sql)
    artefacts = mycursor.fetchall()
    for a in artefacts:
      temp2 = {}
      data = {}
      data['id'] = str(a[0])
      data['node'] = str(a[3])
      data['artefact_type'] = str(a[1])
      data['status'] = str(a[5])
      data['artefact_owner'] = str(a[2])
      temp2["data"] = data
      childJson.append(temp2)
    result = recursive(projectId, pc[0])
    if (result):
      for r in result:
        childJson.append(r)
      temp["children"] = childJson
    elif (childJson):
      temp["children"] = childJson
    contJson.append(temp)
  print("p artefacts: ")
  print(pArtefacts)
  for pa in pArtefacts:
    tempa = {}
    data = {}
    data['id'] = str(pa[0])
    data['node'] = str(pa[3])
    data['artefact_type'] = str(pa[1])
    data['status'] = str(pa[5])
    data['artefact_owner'] = str(pa[2])
    tempa["data"] = data
    contJson.append(tempa)
  return jsonify(contJson)


# function to generate OTP
def generateOTP():
  # Declare a digits variable
  # which stores all digits
  digits = "0123456789"
  OTP = ""

  # length of password can be changed
  # by changing value in range
  for i in range(4):
    OTP += digits[math.floor(random.random() * 10)]

  return OTP


@app.route('/emailVerification/<email>', methods=['GET', 'POST'])
def emailVerification(email):
  OTP = str(generateOTP())
  msg = "your OTP is " + OTP
  # msg = "hi"
  port = 465
  password = "@Mushi123"
  # Create a secure SSL context
  # ssl._create_default_https_context = ssl._create_unverified_context
  context = ssl._create_unverified_context()
  with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
    server.login("rapidpm.musab@gmail.com", password)
    server.sendmail("rapidpm.musab@gmail.com", email, msg)
  customerId = {"message": str(OTP)}
  return jsonify(customerId)
# app.run(host='0.0.0.0', port=5002, debug=True)
