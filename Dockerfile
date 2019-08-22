FROM node:8

MAINTAINER Pedro Lazari plazari96@gmail.com

RUN npm i -g @adonisjs/cli


RUN mkdir /var/www

WORKDIR /var/www

COPY package*.json ./
RUN npm install

ARG HOST_PORT

ENV HOST=10.245.242.143
ENV PORT=${HOST_PORT}
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
ENV S3_KEY=AKIAZ52X32WFMJ65BGMV
ENV S3_SECRET=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
ENV S3_BUCKET=receitavo-fotos
ENV S3_REGION=us-east-1


COPY . .

EXPOSE ${HOST_PORT}

RUN ["chmod", "+x", "./scripts/run.sh"]
ENTRYPOINT [ "./scripts/run.sh" ]
#CMD [ "node", "server.js" ]




