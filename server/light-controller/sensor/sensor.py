# !/usr/local/bin/python

from queue import Queue 
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BOARD)

# define the pin that goes to the circuit
pin_to_circuit = [11 ,13 ,7]

averageQueue = Queue(maxsize = 3)

def mean(a):
    return sum(a)/len(a)

def rc_time(pin_to_circuit):
    count = 0
  
    # Output on the pin for 
    GPIO.setup(pin_to_circuit, GPIO.OUT)
    GPIO.output(pin_to_circuit, GPIO.LOW)
    time.sleep(0.1)

    # Change the pin back to input
    GPIO.setup(pin_to_circuit, GPIO.IN)
  
    # Count until the pin goes high
    while (GPIO.input(pin_to_circuit) == GPIO.LOW):
        count += 1

    # print('# {pin} ouput: {count}'.format(pin = pin_to_circuit, count = count))

    return count

def average_sensor_readings():
    return mean(list(map(lambda x: rc_time(x), pin_to_circuit)))

# initially, populate queue with data
for i in range(3):
    averageQueue.put(average_sensor_readings())

# Catch when script is interrupted, cleanup correctly
try:
    # Main loop
    while True:
        readingsMean = average_sensor_readings()

        averageQueue.get()
        averageQueue.put(readingsMean)

        currentMean = mean(list(averageQueue.queue))

except KeyboardInterrupt:
    pass
finally:
    GPIO.cleanup()