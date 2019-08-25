FROM node:latest

RUN mkdir /server

SHELL ["/bin/bash", "-c"]

WORKDIR /server
COPY ./server/ /server

RUN npm install -g serve

WORKDIR /server


WORKDIR /client
COPY ./client/ /client
RUN npm run build

CMD ["sh", "-c", "nohup node /server/bin/www & serve -p 80 -s /client/build"]

EXPOSE 3001
EXPOSE 3000
EXPOSE 80