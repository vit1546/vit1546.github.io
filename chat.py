import socket
import threading
import time


def sender_loop():
	s = socket.socket()
	time.sleep(0.5)
	s.connect(("192.168.1.112", 12345))
	while True:
		message = input("Enter a message:\n")
		if message == "quit":
			s.send(message.encode("UTF-8"))
			break
			print(threading.current_thread().getName()," has stopped")
		s.send(message.encode("UTF-8"))
	s.close

def receiver_loop():
	s = socket.socket()     
	s.bind(("192.168.1.112", 12345))
	s.listen()  
	conn,addr = s.accept()
	while True:
		message = conn.recv(2048).decode("UTF-8")
		if message == "quit":
			break
		print(threading.current_thread().getName(),": ",message)
	conn.close()
	   
	   
thread = threading.Thread(target=sender_loop,name="sender")
thread.start()

thread = threading.Thread(target=receiver_loop,name="receiver")
thread.start()
