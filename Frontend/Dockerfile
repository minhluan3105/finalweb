# Sử dụng image Node.js phiên bản 18 trên nền Alpine Linux
FROM node:18-alpine

# Đặt thư mục làm việc bên trong container là /app
WORKDIR /app

# Sao chép package.json và package-lock.json
COPY package*.json ./

# Sao chép toàn bộ mã nguồn còn lại của dự án vào thư mục /app trong container
# Điều này phải được thực hiện TRƯỚC KHI RUN npm install nếu bạn không dùng named volume cho node_modules
# hoặc nếu bạn muốn node_modules trong container được tạo ra dựa trên source code đã copy vào.
COPY . .

# Xóa node_modules, .vite cache (nếu có) và cài đặt lại dependencies
RUN rm -rf node_modules .vite && \
    npm cache clean --force && \
    npm install

# Mở cổng 5173 (cổng mặc định của Vite dev server)
EXPOSE 5173

# Lệnh để khởi chạy Vite development server khi container bắt đầu
CMD ["npm", "run", "dev", "--", "--host"]