// solid-start-node does not expose the http server instance.
// This is a workaround to access the server instance in the code.
// It is preloaded by the node -r option.
const http = require('http');

const createServer = http.createServer;

http.createServer = (...args) => {
  const server = createServer(...args);
  global.server = server;
  return server;
};
