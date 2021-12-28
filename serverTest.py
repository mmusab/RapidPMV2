def server(command,conn):
    if (conn):
      initialMsg = "ready?".encode("UTF-8")
      conn.send(len(initialMsg).to_bytes(2, byteorder='big'))
      conn.send(initialMsg)
  
      length_of_message = int.from_bytes(conn.recv(2), byteorder='big')
      initialResponse = conn.recv(length_of_message).decode("UTF-8")
      if(initialResponse == "yes"):
        print("client is ready")
      else:
        raise Exception()
  
      message_to_send = command.encode("UTF-8")
      conn.send(len(message_to_send).to_bytes(2, byteorder='big'))
      conn.send(message_to_send)
  
      length_of_message = int.from_bytes(conn.recv(2), byteorder='big')
      msg = conn.recv(length_of_message).decode("UTF-8")
      while(msg == "yes"):
          length_of_message = int.from_bytes(conn.recv(2), byteorder='big')
          msg = conn.recv(length_of_message).decode("UTF-8")
      if(msg == "got it"):
        print("client says got it")
      else:
        raise Exception()