FROM nginx:1.19-alpine
COPY default.conf /etc/nginx/conf.d/
COPY src/ /usr/share/nginx/html
EXPOSE 8000
