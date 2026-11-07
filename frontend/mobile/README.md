# TreeO – Mobile app (React Native / Expo)

Giao diện code theo bản thiết kế **TreeO UI Mockups**: 4 tab Garden, AI, Community, Settings, cùng màn Đăng nhập / Đăng ký nối vào Identity service.

Một bộ code chạy cho cả **điện thoại** và **web**:
- Màn hình hẹp (điện thoại): thanh tab dưới cùng, bố cục 1 cột (mockup *Mobile*)
- Màn hình rộng từ 900px (máy tính): thanh menu bên trái, Garden thành dashboard 2 cột có biểu đồ 24 giờ (mockup *Web · Dashboard*)

Mốc 900px nằm ở `src/hooks/useIsWide.ts`.

## Cần cài trước

- **Node.js** bản LTS (kiểm tra: `node -v`)
- Điện thoại cài app **Expo Go** (App Store / CH Play), nếu muốn chạy trên điện thoại

## Chạy lần đầu

```powershell
cd frontend/mobile
npm install
```

## Mỗi lần chạy

1. Bật backend trước (xem `README.md` ở thư mục gốc): Docker Desktop + `dotnet run` trong `services/identity/Identity.Api`
2. Chạy app:
   ```powershell
   cd frontend/mobile
   npx expo start
   ```
3. Trong terminal:
   - Bấm **`w`** → mở trên trình duyệt (`http://localhost:8081`)
   - Hoặc dùng **Expo Go** quét mã QR → mở trên điện thoại

## Kết nối backend

### Chạy trên trình duyệt

Danh sách trang web được phép gọi API (CORS) nằm trong `appsettings.json` của từng service, mục `Cors:Origins`. Đã có sẵn `http://localhost:8081` (Expo web), không cần sửa gì.

### Chạy trên điện thoại

Trên điện thoại, `localhost` là chính điện thoại, không phải máy tính. Cần 3 bước:

1. Xem IP máy tính: gõ `ipconfig`, lấy dòng **IPv4 Address** (ví dụ `192.168.1.10`)
2. Tạo file `frontend/mobile/.env`:
   ```
   EXPO_PUBLIC_API_URL=http://192.168.1.10:5101
   EXPO_PUBLIC_FORUM_URL=http://192.168.1.10:5107
   ```
3. Chạy các service cho phép máy khác trong mạng gọi vào:
   ```powershell
   dotnet run --urls http://0.0.0.0:5101    # trong services/identity/Identity.Api
   dotnet run --urls http://0.0.0.0:5107    # trong services/forum/Forum.Api
   ```

Điện thoại và máy tính phải **cùng mạng Wi-Fi**. Nếu Windows hỏi tường lửa thì chọn **Allow**.
Sửa `.env` xong phải tắt `npx expo start` rồi chạy lại.

## Phần nào là thật, phần nào là dữ liệu mẫu

| Phần | Trạng thái |
|---|---|
| Đăng ký, đăng nhập, đăng xuất, đổi mật khẩu, tên + email trong Settings | **Thật**: gọi Identity service |
| Ghi nhớ đăng nhập, tự gia hạn token khi hết hạn | **Thật**: token lưu bằng SecureStore (điện thoại) / localStorage (web) |
| Đổi ngôn ngữ EN / VI (được lưu lại) | **Thật** (mọi màn trừ Garden và AI) |
| Community: xem bài, lọc chuyên gia / đang theo dõi, tim, theo dõi, đăng và xóa bài | **Thật**: gọi Forum service |
| Độ ẩm, nút tưới, thiết bị ESP32 | Dữ liệu mẫu, chờ **Sensor service** |
| Thời tiết, cảnh báo nắng nóng, streak | Dữ liệu mẫu, chờ **Reminder / Garden service** |
| Chat AI | Trả lời demo, chờ **AI Assistant service** |

Chỗ nào là dữ liệu mẫu đều có ghi chú ở đầu file trong `src/app/(tabs)/`.

## Cấu trúc thư mục

```
src/
├── app/                    # Mỗi file là một màn hình (Expo Router)
│   ├── _layout.tsx         # Nạp font, chặn màn hình khi chưa đăng nhập
│   ├── login.tsx
│   ├── register.tsx
│   └── (tabs)/
│       ├── _layout.tsx     # Thanh tab dưới cùng
│       ├── index.tsx       # Garden (Home)
│       ├── ai.tsx
│       ├── community.tsx
│       └── settings.tsx
├── api/                    # Gọi backend (config.ts chứa địa chỉ API)
├── auth/                   # Lưu trạng thái đăng nhập + token
├── components/             # Icon, Card, Toggle, vòng độ ẩm, biểu đồ 24h...
├── hooks/                  # useIsWide: nhận biết màn hình rộng
├── i18n/                   # Chữ tiếng Anh / tiếng Việt
└── theme.ts                # Màu, font, bo góc lấy từ mockup
```

## Lệnh hữu ích

```powershell
npx tsc --noEmit     # kiểm tra lỗi TypeScript
npx expo start -c    # chạy lại và xóa cache khi app hiện lỗi lạ
```

Khi cài thêm thư viện, dùng `npx expo install <ten-thu-vien>` thay vì `npm install` để lấy đúng phiên bản hợp với Expo.
