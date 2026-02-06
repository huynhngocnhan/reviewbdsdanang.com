🏠 ReviewBDSDaNang

ReviewBDSDaNang là một website bất động sản được xây dựng nhằm mục đích đăng tải, tìm kiếm và quản lý các dự án, nhà đất, căn hộ tại Đà Nẵng.

Dự án được xây dựng theo mô hình Client – Server, sử dụng công nghệ hiện đại phù hợp với tiêu chuẩn phát triển Fullstack hiện nay.

🚀 Tech Stack
🔹 Frontend (Client)

React + TypeScript

TailwindCSS

Vite

Axios (giao tiếp API)

🔹 Backend (Server)

Node.js

Express.js

TypeScript

Prisma ORM

PostgreSQL

🔹 Database

PostgreSQL


⚙️ Installation Guide
1️⃣ Clone repository
git clone https://github.com/huynhngocnhan/reviewbdsdanang.git
cd reviewbdsdanang

🖥️ Setup Backend (Server)
Bước 1: Di chuyển vào thư mục server
cd server

Bước 2: Cài dependencies
npm install

Bước 3: Tạo file .env

Tạo file .env trong thư mục server:

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/reviewbdsdanang"

Bước 4: Chạy migration
npx prisma migrate dev --name init

Bước 5: Chạy server
npm run dev


Server mặc định chạy tại:

http://localhost:5000

💻 Setup Frontend (Client)
Bước 1: Di chuyển vào thư mục client
cd client

Bước 2: Cài dependencies
npm install

Bước 3: Chạy project
npm run dev


Frontend mặc định chạy tại:

http://localhost:5173


User Authentication (JWT)

CRUD bất động sản

Tìm kiếm & filter nâng cao

Upload hình ảnh

Dashboard quản trị

Responsive UI


👨‍💻 Author

Developed by [Huynh Ngoc Nhan]
