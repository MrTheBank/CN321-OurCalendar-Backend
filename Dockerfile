FROM node:16.9.1-alpine as builder
WORKDIR /usr/src/bot
ADD package.json package-lock.json ./
RUN npm install --only=production

FROM node:16.9.1-alpine
WORKDIR /usr/src/bot
COPY . ./
COPY --from=builder ./usr/src/bot/node_modules ./node_modules

EXPOSE 1337
CMD ["npm", "run", "start"]
