FROM node:12.13-alpine As development

RUN apk add --no-cache \
    autoconf \
    automake \
    bash \
    g++ \
    libc6-compat \
    libjpeg-turbo-dev \
    libpng-dev \
    make \
    nasm \
    libtool

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

WORKDIR /app

RUN npm install -g @nestjs/cli

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:12.13-alpine as production

RUN apk add --no-cache \
    autoconf \
    automake \
    bash \
    g++ \
    libc6-compat \
    libjpeg-turbo-dev \
    libpng-dev \
    make \
    nasm \
    libtool

ARG NODE_ENV
ENV NODE_ENV=$NODE_ENV

WORKDIR /app

COPY package.json ./

RUN npm install --only=prod

COPY . .

COPY --from=development /app/dist ./dist

CMD ["node", "dist/main"]