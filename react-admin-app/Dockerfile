FROM node:14 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

RUN npm run build

FROM node:14-alpine

WORKDIR /app

COPY --from=build /app/build ./build

EXPOSE 3001

CMD ["npx", "serve", "-s", "build", "-l", "3001"]