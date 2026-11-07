// Dia chi cac service backend.
// - Chay tren trinh duyet cung may: dung mac dinh (localhost)
// - Chay tren dien thoai that: tao file .env o thu muc mobile:
//     EXPO_PUBLIC_API_URL=http://<IP-may-tinh>:5101
//     EXPO_PUBLIC_FORUM_URL=http://<IP-may-tinh>:5107
//   (dien thoai va may tinh phai cung mang Wi-Fi)
const trim = (url: string) => url.replace(/\/$/, "");

export const API_URL = trim(process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5101");       // Identity
export const FORUM_URL = trim(process.env.EXPO_PUBLIC_FORUM_URL ?? "http://localhost:5107");   // Forum
