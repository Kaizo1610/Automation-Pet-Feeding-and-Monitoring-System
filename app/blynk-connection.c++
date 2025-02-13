#include <ESP8266WiFi.h>
#include <BlynkSimpleEsp8266.h>
#include <Servo.h>
#include <WiFiManager.h>

//Wifi configuration
char auth[] = "NqXOR_TdkhVvJzSK4N6WxLGmZNoKu6Se";

void setupWifi() {
  //Init WifiManager
  WiFiManager wifiManager;
  Serial.print("\n\nConnecting Wifi: ");
  //wifiManager.resetSettings();
  wifiManager.autoConnect("PawTector: WiFI Setup");
  Serial.print("Wifi Status: Connected");
}

BlynkTimer timer;
Servo servo;

// food
#define trig2 13 //GPIO13 = D7
#define echo2 15 //GPIO15 = D8

//water
#define trig 2 //GPIO13 = D4
#define echo 14 //GPIO15 = D5


#define relay 12 //GPIO12 = D6
#define buzzerPin 4 
#define redLed 4 //GPIO4 = D2

#define servopin 5 //gpio5 =D1

//Enter your tank max value(CM)
int MaxLevel = 20;
int LowLevel = 18;  //(MaxLevel * 75) / 100; //15

int MaxLevel2 = 20;
int LowLevel2 = 18;

unsigned long previousMillis = 0;  
unsigned long interval = 5 * 60000; 
bool isManualControl = false;     


void setup() {

  // Start the serial communication
  Serial.begin(9600);

  setupWifi();
  // Connect to Blynk
  Blynk.config(auth);

  // Attach the servo to the specified pin
  servo.attach(servopin);
  servo.write(0);  // Set servo to initial position (0 degrees)

  //Declare pinMode
  pinMode(trig, OUTPUT);
  pinMode(echo, INPUT);
  pinMode(trig2, OUTPUT);
  pinMode(echo2, INPUT);
  pinMode(relay, OUTPUT);
  pinMode(buzzerPin,OUTPUT);
  pinMode(redLed,OUTPUT);
 
  digitalWrite(relay, LOW);

  //Call the functions
  timer.setInterval(500L, ultrasonic);
  timer.setInterval(1000L, ultrasonic2);
}

BLYNK_WRITE(V4) {
  int switchState = param.asInt();  // Get switch state from the Blynk app
  if (switchState == 1) {
    isManualControl = true;  // Enable manual control
    servo.write(70);  // Move the servo to 180 degrees
  } else {
    isManualControl = false; // Disable manual control
    servo.write(0);  // Move the servo to 0 degrees
  }
}

//Get the ultrasonic sensor values
void ultrasonic() {
  digitalWrite(trig, LOW);
  delayMicroseconds(4);
  digitalWrite(trig, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig, LOW);
  long t = pulseIn(echo, HIGH);
  int distance = t / 29 / 2;
  int blynkDistance = (distance - MaxLevel) * -1;
  int hysteresis = 7;

  Serial.print("Ultrasonic Sensor 1 Distance: ");
  Serial.print(distance);
  Serial.println(" cm");

  if (distance <= MaxLevel) {
    Blynk.virtualWrite(V0, blynkDistance);
  }
  else {
    Blynk.virtualWrite(V0, 0);
  }

  if (distance >= LowLevel /*<= distance && distance < MaxLevel - 4*/) {
    digitalWrite(buzzerPin, HIGH); // Turn buzzer on
    delay(1000); // Wait for a second
    digitalWrite(buzzerPin, LOW); // Turn buzzer off
    digitalWrite(redLed, HIGH);
  }
  else{
    digitalWrite(redLed, LOW);
  }
}

void ultrasonic2() {
  digitalWrite(trig2, LOW);
  delayMicroseconds(4);
  digitalWrite(trig2, HIGH);
  delayMicroseconds(10);
  digitalWrite(trig2, LOW);
  long t2 = pulseIn(echo2, HIGH);
  int distance2 = t2 / 29 / 2;
  int blynkDistance2 = (distance2 - MaxLevel2) * -1;

  Serial.print("Ultrasonic Sensor 2 Distance: ");
  Serial.print(distance2);
  Serial.println(" cm");

  if (distance2 <= MaxLevel2) {
    Blynk.virtualWrite(V2, blynkDistance2);  // Display distance for the second sensor
  } else {
    Blynk.virtualWrite(V2, 0);
  }

  
  if (distance2 >= LowLevel2) {
    digitalWrite(buzzerPin, HIGH); // Turn buzzer on
    delay(1000); // Wait for a second
    digitalWrite(buzzerPin, LOW); // Turn buzzer off
    digitalWrite(redLed, HIGH);
  }
  else{
    digitalWrite(redLed, LOW);
  }
 
}

//Get the button value
BLYNK_WRITE(V1) {
  bool Relay = param.asInt();
  if (Relay == 1) {
    digitalWrite(relay, HIGH);
  } else {
    digitalWrite(relay, LOW);
  }
}


void loop() {
  Blynk.run();//Run the Blynk library
  timer.run();//Run the Blynk timer
}