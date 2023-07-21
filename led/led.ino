#include <ArduinoOSC.h>

#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
 #include <avr/power.h> // Required for 16 MHz Adafruit Trinket
#endif

#define PIN        21 // On Trinket or Gemma, suggest changing this to 1
#define NUMPIXELS 64 // Popular NeoPixel ring size
Adafruit_NeoPixel pixels(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

//WiFiルータ Settings
const char* ssid = "arataWiFi_00";  // ネットワーク名
const char* pwd = "aratamatsumoto";
const IPAddress gateway(192, 168, 11, 1);  // ゲートウェイ = ネットワークのベース
const IPAddress subnet(255, 255, 255, 0);  // サブネット = だいたいこの値

float blightness = 0;

// 送信先ポート
const int recvPort = 8003;

bool isConnecting = false;

int testCnt = 0;

void setup () {
  Serial.begin(115200);

  // 自分のIPを決定する 一旦自分のスマホ
  IPAddress ip(192, 168, 11, 100);

  // 初期設定 まえの接続が残ってたりするといけないので一回消す
  WiFi.disconnect(true, true);
  delay(1000);
  WiFi.mode(WIFI_STA);

  WiFi.begin(ssid, pwd);
  WiFi.config(ip, gateway, subnet);

  int cnt = 0;
  bool isConnected = true;
  delay(1000);

  
  Serial.print("INFO : Wi-Fi Start Connect.");

  // WiFiがつながるまでwhileを回す
  while (WiFi.status() != WL_CONNECTED) { 
    Serial.print(".");
    delay(500);
    if (cnt == 5) {
      isConnected = false;
      break;
    }
    cnt += 1;
  }
  Serial.println("");

  if (isConnected) {
    Serial.println("INFO : Wi-Fi Connected.");
    //受信のリスナー設定
        OscWiFi.subscribe(recvPort, "/input", onOscReceivedStatus);
    //    OscWiFi.subscribe(recvPort, "/app/threshold", onOscReceivedThreshold);
    //    OscWiFi.subscribe(recvPort, "/app/connect", onOscReceivedConnectTest);
    //    OscWiFi.subscribe(recvPort, "/app/usevibe", onOscReceivedUseVibe);
  } else {
    Serial.println("INFO : Wi-Fi Connect Failed.");
  }
  
  //コネクト処理終了フラグ
  isConnecting = false;
  
}

void onOscReceivedStatus(OscMessage& m) {
  int statusVal = m.arg<int>(0);
  Serial.print("onOscReceivedStatus : ");
  Serial.println(statusVal);
  blightness = 1;
}

void loop () {
  OscWiFi.update();

  blightness *= .99;

  pixels.clear(); // Set all pixel colors to 'off'
  float t = (float)millis() / 1000;

  float b =  255 * blightness + (sin(t * .95) + sin(t * .9) + 2) / 4 * 155;
  for(int i=0; i<NUMPIXELS; i++) { // For each pixel...
    pixels.setPixelColor(i, pixels.Color(b, b, b));
  }
  pixels.show();   // Send the updated pixel colors to the hardware.
}