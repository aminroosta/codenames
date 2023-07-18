const http = require('http');

const createServer = http.createServer;

http.createServer = (...args) => {
  const server = createServer(...args);
  global.server = server;
  return server;
};
