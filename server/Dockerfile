FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p public/assets

EXPOSE 3001

CMD ["npm", "run", "dev"]