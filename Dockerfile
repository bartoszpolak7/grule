FROM node:26-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

EXPOSE 3000

# dla produkcji zmienić na > npm start
CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev"]