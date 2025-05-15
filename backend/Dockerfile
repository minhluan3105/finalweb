# Sử dụng image PHP 8.2 với FPM
FROM php:8.2-fpm

# Cài đặt các dependencies cần thiết cho Laravel, Nginx, và Supervisor
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev \
    sqlite3 \
    libsqlite3-dev \
    nginx \
    supervisor

# Cài đặt các PHP extensions
RUN docker-php-ext-install pdo pdo_mysql pdo_sqlite mbstring exif pcntl bcmath gd zip

# Cài đặt Composer (quản lý dependencies cho PHP)
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Đặt thư mục làm việc
WORKDIR /var/www/html

# Sao chép cấu hình Nginx
COPY laravel-nginx.conf /etc/nginx/sites-enabled/default

# Sao chép cấu hình Supervisor
# Đảm bảo tệp supervisord.conf này chứa [supervisord] section và các [program] sections
COPY supervisord.conf /etc/supervisor/supervisord.conf 

# Sao chép toàn bộ mã nguồn ứng dụng TRƯỚC
COPY . .

# Chạy composer install
RUN composer install --no-dev --optimize-autoloader

# Cấp quyền cho thư mục storage, bootstrap/cache và vendor
RUN chown -R www-data:www-data storage bootstrap/cache vendor
RUN chmod -R 775 storage bootstrap/cache vendor # Đảm bảo group www-data có quyền ghi

# Đổi chủ sở hữu toàn bộ thư mục ứng dụng thành www-data
RUN chown -R www-data:www-data /var/www/html

# Tạo thư mục log cho Nginx (Supervisor config đã định nghĩa đường dẫn log)
RUN mkdir -p /var/log/nginx && \
    chown -R www-data:www-data /var/log/nginx && \
    chmod -R 755 /var/log/nginx

# Expose cổng 80 (Nginx sẽ lắng nghe trên cổng này)
EXPOSE 80

# Khởi động Supervisor
CMD ["/usr/bin/supervisord", "-n", "-c", "/etc/supervisor/supervisord.conf"]