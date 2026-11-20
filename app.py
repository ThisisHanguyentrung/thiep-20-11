"""Thiệp online chúc mừng Ngày Nhà giáo Việt Nam 20/11 - Flask app."""
import os

from flask import Flask, render_template

app = Flask(__name__)

# ---- Nội dung dễ chỉnh sửa ----------------------------------------------
# Đổi các giá trị bên dưới (hoặc đặt biến môi trường) để cá nhân hóa thiệp.
CARD = {
    "sender": os.environ.get("SENDER_NAME", "Con của mẹ"),
}


@app.route("/")
def index():
    return render_template("index.html", card=CARD)


@app.after_request
def add_headers(resp):
    # Cache file tĩnh 1 giờ để tải nhanh; trang chính luôn lấy bản mới.
    if resp.mimetype in ("text/css", "application/javascript", "text/javascript"):
        resp.headers["Cache-Control"] = "public, max-age=3600"
    return resp


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    # host 0.0.0.0 để điện thoại cùng Wi-Fi có thể truy cập khi test.
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG") == "1")
