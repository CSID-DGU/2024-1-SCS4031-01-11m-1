FROM node:alpine
COPY . /backend
WORKDIR /backend
RUN npm install
RUN npm run build
CMD [ "npm","run" ,"start:prod"]