FROM node:22.6.0
FROM httpd:alpine
#FROM php:7.0-apache
ADD dist/sunbird-cb-training-plan-ai /usr/local/apache2/htdocs
COPY ./.htaccess /usr/local/apache2/htdocs
ADD src/404.html /usr/local/apache2/htdocs/404.html
RUN sed -i '/LoadModule rewrite_module/s/^#//g' /usr/local/apache2/conf/httpd.conf
RUN { \
  echo 'IncludeOptional conf.d/*.conf'; \
  echo 'ErrorDocument 404 /404.html'; \
} >> /usr/local/apache2/conf/httpd.conf \
  && mkdir /usr/local/apache2/conf.d

#COPY ./dist/subbird-cb-staticweb /var/www/html/
EXPOSE 80
#FROM php:7.0-apache
#ADD dist/sunbird-cb-staticweb /var/www/html
#COPY ./dist/subbird-cb-staticweb /var/www/html/
#EXPOSE 80
