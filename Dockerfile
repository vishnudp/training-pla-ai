# ---------- Stage 1: Build with Node ----------
  FROM node:22.6.0 AS build
 
  WORKDIR /app
   
  # Copy package files and install dependencies
  COPY package*.json ./
  RUN npm install --force
   
  # Copy the rest of the source and build
  COPY . .
  RUN npm run build
   
   
  # ---------- Stage 2: Serve with Apache ----------
  FROM httpd:alpine
   
  # Copy build artifacts from Node stage to Apache web root
  COPY --from=build /app/dist/sunbird-cb-training-plan-ai /usr/local/apache2/htdocs
   
  # Copy .htaccess and custom 404 page
  COPY ./.htaccess /usr/local/apache2/htdocs
  COPY src/404.html /usr/local/apache2/htdocs/404.html
   
  # Enable mod_rewrite and configure custom 404
  RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf \
  && { \
      echo 'IncludeOptional conf.d/*.conf'; \
      echo 'ErrorDocument 404 /404.html'; \
    } >> /usr/local/apache2/conf/httpd.conf \
  && mkdir -p /usr/local/apache2/conf.d
   
  EXPOSE 80
   
  CMD ["httpd-foreground"]