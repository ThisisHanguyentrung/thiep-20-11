# Thiệp online Ngày Nhà giáo Việt Nam 20/11

Tấm thiệp tương tác gửi mẹ: phong bì mở ra, cánh hoa và hạt sáng nhẹ nhàng, lời chúc hiện dần, nút "Gửi mẹ một cái ôm" với trái tim bay lên.

```
app.py                  Ứng dụng Flask (và nơi đổi tên người gửi)
templates/index.html    Nội dung thiệp, chỉnh lời chúc tại đây
static/css/style.css    Màu sắc, font, bố cục
static/js/script.js     Hiệu ứng và trình tự mở thiệp
requirements.txt        Thư viện: Flask, gunicorn
Procfile                Dùng khi đưa lên Render/Railway
```

## 1. Cài đặt Python và thư viện

1. Tải Python 3.10 trở lên tại https://www.python.org/downloads/ (Windows: tick **Add Python to PATH** khi cài).
2. Mở Terminal (Windows: Command Prompt hoặc PowerShell) tại thư mục dự án:

```bash
python -m venv venv
# Windows:      venv\Scripts\activate
# macOS/Linux:  source venv/bin/activate
pip install -r requirements.txt
```

## 2. Chạy trên máy tính

```bash
python app.py
```

Mở trình duyệt vào http://127.0.0.1:5000. Cần kết nối Internet để tải font Google (nếu không có, thiệp vẫn hiện bằng font dự phòng).

Đổi tên người ký thiệp (mặc định "Con của mẹ"): sửa `CARD["sender"]` trong `app.py`, hoặc chạy `SENDER_NAME="Minh" python app.py` (Windows PowerShell: `$env:SENDER_NAME="Minh"; python app.py`).

## 3. Kiểm tra trên điện thoại

1. Cho máy tính và điện thoại dùng chung một Wi-Fi.
2. Tìm địa chỉ IP máy tính: Windows `ipconfig` (IPv4 Address), macOS/Linux `ifconfig` hoặc `ip a`.
3. Trên điện thoại mở `http://<IP-máy-tính>:5000`, ví dụ `http://192.168.1.10:5000`.
4. Nếu không vào được, kiểm tra tường lửa có chặn cổng 5000 không.
5. Có thể kiểm tra nhanh trên máy tính bằng Chrome: F12, bấm biểu tượng điện thoại (Toggle device toolbar).

## 4. Đưa lên Internet để mẹ mở bằng link

Cách dễ nhất, miễn phí: **Render** (https://render.com).

1. Tạo tài khoản GitHub, tạo repository mới và tải toàn bộ thư mục dự án lên (không cần thư mục `venv`).
2. Đăng nhập Render bằng GitHub, chọn **New > Web Service**, chọn repository vừa tạo.
3. Điền:
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance type**: Free
4. Bấm **Create Web Service**. Sau vài phút bạn nhận được link dạng `https://ten-thiep.onrender.com`. Gửi link này cho mẹ qua Zalo/Messenger, mẹ chỉ cần bấm mở, không cần cài gì.

Lưu ý: gói miễn phí của Render sẽ "ngủ" khi không có người truy cập, lần mở đầu có thể mất khoảng một phút. Nên tự mở thử link trước ngày 20/11 để thiệp sẵn sàng. Các lựa chọn khác: PythonAnywhere, Railway, Fly.io (cách làm tương tự).

## Tùy chỉnh nhanh

- Lời chúc: sửa các thẻ `<p>` trong `templates/index.html`.
- Màu sắc: sửa biến ở đầu `static/css/style.css` (khối `:root`).
- Tốc độ chữ hiện ra: tham số `speed` của hàm `typewriter` trong `script.js`.
- Người dùng bật chế độ giảm chuyển động trên máy sẽ thấy phiên bản hiệu ứng tối giản.
