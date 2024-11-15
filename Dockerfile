FROM node:22
EXPOSE 3000
WORKDIR /app
COPY package.json package.json
RUN npm install
COPY . .
RUN npm run build


CMD [ "npm", "run", "start" ]
