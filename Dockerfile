FROM nginx:latest

LABEL maintainer="Alejandro Valdes <alejandrovaldes@live.com>"

COPY build /usr/share/nginx/html
