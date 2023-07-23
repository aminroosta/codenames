FROM node:20
EXPOSE 3000
RUN mkdir -p /app
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build

CMD [ "npm", "run", "start" ]
