# Chọn image Node.js chính thức làm base image
FROM node:16

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép package.json và package-lock.json vào container
COPY package*.json ./

# Cài đặt các dependencies
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Copy file .env vào container
COPY .env .env

# Thiết lập các biến môi trường từ file .env
RUN npm install dotenv

# Mở cổng mà ứng dụng sẽ chạy
EXPOSE 5000

# Lệnh để chạy ứng dụng
CMD ["npm", "start"]
