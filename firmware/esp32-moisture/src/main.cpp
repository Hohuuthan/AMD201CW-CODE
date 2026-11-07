#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>

// -------------------------------------------------------------
// 1. CẤU HÌNH THÔNG TIN WIFI & SERVER
// -------------------------------------------------------------
const char* WIFI_SSID     = "DuyNgaDocTon";    // Thay tên WiFi của bạn
const char* WIFI_PASSWORD = "02122023";       // Thay mật khẩu WiFi

// Địa chỉ API Server do bạn trong nhóm cung cấp (Ví dụ: Server Local hoặc Cloud)
const char* SERVER_URL = "http://192.168.0.52:5182/api/sensors";

// -------------------------------------------------------------
// 2. CẤU HÌNH PHẦN CỨNG & HIỆU CHUẨN (CALIBRATION)
// -------------------------------------------------------------
const int SOIL_PIN  = 36;  // Chân SN đọc cảm biến độ ẩm dung kháng
const int RELAY_PIN = 26;  // Chân G26 kích Relay máy bơm

const int ADC_DRY = 3560;  // Mốc khô ngoài không khí
const int ADC_WET = 1500;  // Mốc ướt trong ly nước

const int MOISTURE_THRESHOLD_LOW = 30; // Ngưỡng tự động bật máy bơm (%)

// -------------------------------------------------------------
// 3. HÀM QUY ĐỔI ĐỘ ẨM SANG PHẦN TRĂM (%)
// -------------------------------------------------------------
int readMoisturePercent() {
  int rawValue = analogRead(SOIL_PIN);
  rawValue = constrain(rawValue, ADC_WET, ADC_DRY);
  return map(rawValue, ADC_DRY, ADC_WET, 0, 100);
}

// -------------------------------------------------------------
// 4. HÀM GỬI DỮ LIỆU LÊN SERVER VÀ LẤY LỆNH ĐIỀU KHIỂN
// -------------------------------------------------------------
void sendDataToServer(int moisture, bool pumpState) {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(SERVER_URL);
    http.addHeader("Content-Type", "application/json");

    // Chuẩn bị chuỗi JSON gửi đi
    String jsonPayload = "{";
    jsonPayload += "\"device_id\":\"TREEO_ESP32_01\",";
    jsonPayload += "\"moisture_percent\":" + String(moisture) + ",";
    jsonPayload += "\"pump_status\":" + String(pumpState ? "true" : "false");
    jsonPayload += "}";

    int httpResponseCode = http.POST(jsonPayload);

    if (httpResponseCode > 0) {
      Serial.print("[HTTP] Gui du lieu thanh cong! Response code: ");
      Serial.println(httpResponseCode);
      
      // Đọc phản hồi từ Server (nếu Server gửi lại lệnh điều khiển)
      String response = http.getString();
      Serial.print("[HTTP] Server tra ve: ");
      Serial.println(response);
    } else {
      Serial.print("[HTTP] Loi gui du lieu: ");
      Serial.println(httpResponseCode);
    }
    http.end();
  } else {
    Serial.println("[WiFi] Mat ket noi WiFi!");
  }
}

// -------------------------------------------------------------
// 5. SETUP & LOOP MAIN
// -------------------------------------------------------------
void setup() {
  Serial.begin(115200);
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW); // Mặc định tắt máy bơm

  // Kết nối WiFi
  Serial.println("\n[WiFi] Dang ket noi toi WiFi...");
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  Serial.println("\n[WiFi] Ket noi WiFi thanh cong!");
  Serial.print("[WiFi] Dia chi IP cua ESP32: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  int moisturePercent = readMoisturePercent();
  bool isPumpOn = false;

  // Logic tự động tưới
  if (moisturePercent < MOISTURE_THRESHOLD_LOW) {
    digitalWrite(RELAY_PIN, HIGH);
    isPumpOn = true;
    Serial.println("[TreeO] Dat kho! Da BAT may bom.");
  } else {
    digitalWrite(RELAY_PIN, LOW);
    isPumpOn = false;
    Serial.println("[TreeO] Do am tot. Da TAT may bom.");
  }

  // Gửi số liệu lên Server
  sendDataToServer(moisturePercent, isPumpOn);

  Serial.println("-----------------------------------------");
  delay(5000); // Gửi dữ liệu cập nhật mỗi 5 giây
}