import Debug from "debug";
import http from "node:http";
import app from "./app.js";
// import io from './socket-app.js'

/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val: string) {
  const port = parseInt(val, 10);

  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error: NodeJS.ErrnoException, port: string | number): void {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(server: http.Server, debug: Debug.Debugger): void {
  const addr = server.address();
  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`;
  debug(`Listening on ${bind}`);
}

const debug = Debug("gambit:server");

debug("Starting...");

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT ?? "3001");
if (!port) {
  console.error("Unable to get port");
  process.exit(1);
}
app.set("port", port);

const server = http.createServer(app);
// io.attach(server)

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on("error", (err) => onError(err, port));
server.on("listening", () => onListening(server, debug));
