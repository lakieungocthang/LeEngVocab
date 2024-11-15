# vocabulary-service/Dockerfile
FROM node:20

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

EXPOSE 5002
CMD ["node", "index.js"]
