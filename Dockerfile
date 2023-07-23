FROM node:20 AS build
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build

FROM node:20
EXPOSE 3000
WORKDIR /app
# RUN  mkdir node_modules
COPY --from=build /app/dist dist
COPY --from=build /app/preload.cjs preload.cjs
RUN npm install better-sqlite3 undici
RUN npm cache clean --force
COPY --from=build /app/package.json package.json


CMD [ "npm", "run", "start" ]
