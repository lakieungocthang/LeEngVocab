# user-profile-service/Dockerfile
FROM node:16

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

EXPOSE 5003
CMD ["node", "index.js"]
