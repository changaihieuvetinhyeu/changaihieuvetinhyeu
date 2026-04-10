# Mini Profile App

Ứng dụng Mini Shop đơn giản với các chức năng đăng nhập, quản lý phiên (session), lưu theme qua cookie và theo dõi lượt truy cập trang cá nhân.

## Công nghệ sử dụng

- **Backend**: Node.js, Express
- **Frontend**: Server-Side Rendering (SSR) với HTML/CSS inline
- **Quản lý phiên**: `express-session`
- **Quản lý Cookie**: `cookie-parser`
- **Ngôn ngữ**: TypeScript

## Chức năng chính

1. **Trang chủ (`/`)**: Hiển thị lời chào và lựa chọn theme.
2. **Chọn Theme (`/set-theme/:theme`)**: Lưu cấu hình `light` hoặc `dark` vào cookie trong 10 phút.
3. **Đăng nhập (`/login`)**: Lưu tên người dùng và thời gian đăng nhập vào session.
4. **Trang cá nhân (`/profile`)**: Hiển thị thông tin người dùng và số lần truy cập trang trong phiên hiện tại.
5. **Đăng xuất (`/logout`)**: Xóa session và quay về trang đăng nhập.

## Hướng dẫn chạy ứng dụng

### 1. Cài đặt môi trường

Đảm bảo bạn đã cài đặt **Node.js** (phiên bản 18 trở lên).

### 2. Cài đặt dependencies

Mở terminal tại thư mục gốc của dự án và chạy lệnh:

```bash
npm install
```

### 3. Chạy ở chế độ phát triển (Development)

Sử dụng lệnh sau để khởi động server:

```bash
npm run dev
```

Server sẽ chạy tại địa chỉ: `http://localhost:3000`

### 4. Build và chạy ở chế độ Production

Nếu bạn muốn build dự án:

```bash
npm run build
npm start
```

## Cấu trúc thư mục

- `src/server.ts`: File logic chính của server Express.
- `package.json`: Chứa thông tin các thư viện và script chạy dự án.
- `metadata.json`: Thông tin mô tả ứng dụng.
