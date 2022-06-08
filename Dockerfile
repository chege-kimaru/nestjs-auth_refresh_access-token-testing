FROM node:16-alpine As development

WORKDIR /app

RUN npm install pnpm --location=global

COPY pnpm-lock.yaml ./

RUN pnpm fetch

ADD . ./

RUN pnpm install -r --offline

RUN npm run build


FROM node:16-alpine As production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

RUN npm install pnpm --location=global

COPY pnpm-lock.yaml ./

RUN pnpm fetch --prod

ADD . ./

RUN pnpm install -r --offline --prod

COPY --from=development /app/dist ./dist

CMD [ "node", "dist/main.js" ]