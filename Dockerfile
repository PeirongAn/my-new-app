# 使用官方的 Nginx 镜像作为基础镜像
FROM nginx:stable-alpine

# 设置工作目录
WORKDIR /usr/share/nginx/html

# 复制构建好的前端文件到镜像中
COPY dist/ .

# 复制 Nginx 配置文件（如果有自定义配置）
COPY conf/nginx.conf /etc/nginx/conf.d/default.conf

# 暴露容器的 80 端口
EXPOSE 9001

# 启动 Nginx 服务器
CMD ["nginx", "-g", "daemon off;"]

