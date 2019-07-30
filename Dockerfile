FROM node:8

MAINTAINER Pedro Lazari plazari96@gmail.com

RUN npm i -g @adonisjs/cli


RUN mkdir /var/www

WORKDIR /var/www

COPY package*.json .
RUN npm install


ENV HOST=0.0.0.0
ENV PORT=8000
ENV NODE_ENV=development
ENV APP_NAME=AdonisJs
ENV APP_URL=http://${HOST}:${PORT}
ENV CACHE_VIEWS=false
ENV APP_KEY=jpdXEeOrWulmxpJ8in4WjR5ONqjxGNxB
ENV DB_CONNECTION=mysql
ENV DB_HOST=mysql
ENV DB_PORT=3306
ENV DB_USER=api-receitas-vo-node
ENV DB_PASSWORD=api-receitas-vo-node
ENV DB_DATABASE=api-receitas-vo-node
ENV HASH_DRIVER=bcrypt
ENV DEBUG=adonis:*


COPY . .

EXPOSE 8000

CMD [ "node", "server.js" ]




