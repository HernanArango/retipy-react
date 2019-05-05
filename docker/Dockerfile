# build the image
FROM node:latest as builder
RUN mkdir /opt/app
WORKDIR /opt/app
ENV PATH /opt/app/node_modules/.bin:$PATH
COPY package.json /opt/app/package.json
RUN yarn install --silent
COPY . /opt/app
RUN yarn build

FROM nginx:mainline-alpine

RUN rm -rf /etc/nginx/conf.d
COPY docker/conf /etc/nginx
COPY --from=builder /opt/app/build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
