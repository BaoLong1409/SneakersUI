FROM node:20 AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
#build app ở chế độ production
RUN npm run build -- --configuration production

#Stage 2
FROM nginx:alpine AS runtime
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

# copy file build từ stage 1 sang nginx html folder
COPY --from=build /app/dist/sneakers-ui/browser . 

# copy nginx config (tuỳ chỉnh để redirect Angular routes về index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]