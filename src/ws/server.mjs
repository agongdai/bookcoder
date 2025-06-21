import http from 'http';
import websocket from 'websocket';

import * as db from './mock.mjs';

const WebSocketServer = websocket.server;

// Keep track of all active connections
const connections = new Set();

const server = http.createServer(function (request, response) {
  console.log(new Date() + ' Received request for ' + request.url);
  response.writeHead(404);
  response.end();
});

server.listen(8080, function () {
  console.log(new Date() + ' Server is listening on port 8080');
});

const wsServer = new WebSocketServer({
  httpServer: server,
  // You should not use autoAcceptConnections for production
  // applications, as it defeats all standard cross-origin protection
  // facilities built into the protocol and the browser.  You should
  // *always* verify the connection's origin and decide whether or not
  // to accept it.
  autoAcceptConnections: false,
});

function originIsAllowed(origin) {
  // put logic here to detect whether the specified origin is allowed.
  console.log('origin', origin);
  return true;
}

function sendMessage(connection, event, payload) {
  connection.send(JSON.stringify({ event, payload }));
}

function sendAllSlots(connection) {
  sendMessage(connection, 'sync', db.getAllSlots());
}

// Function to broadcast message to all connected clients
function broadcastToAll(message) {
  connections.forEach(connection => {
    if (connection.connected) {
      try {
        sendMessage(connection, 'sync', message);
      } catch (error) {
        console.error('Error sending message to client:', error);
        // Remove broken connection
        connections.delete(connection);
      }
    } else {
      // Remove disconnected connection
      connections.delete(connection);
    }
  });

  console.log(`Broadcasted message to ${connections.size} clients`);
}

wsServer.on('request', function (request) {
  if (!originIsAllowed(request.origin)) {
    // Make sure we only accept requests from an allowed origin
    request.reject();
    console.log(
      new Date() + ' Connection from origin ' + request.origin + ' rejected.'
    );
    return;
  }

  const connection = request.accept(null, request.origin);
  console.log(new Date() + ' Connection accepted.');

  // Add connection to our set of active connections
  connections.add(connection);
  console.log(`Total connected clients: ${connections.size}`);

  sendAllSlots(connection);

  connection.on('message', async function (message) {
    if (message.type !== 'utf8') {
      return;
    }

    const data = JSON.parse(message.utf8Data);

    if (data.event === 'sync') {
      sendAllSlots(connection);
    }

    if (data.event === 'bookSlot') {
      const { slotId, userEmail } = data.payload;

      try {
        // Use atomic booking with proper locking to prevent race conditions
        const result = await db.atomicBookSlot(slotId, userEmail);

        // wait for 5 seconds to simulate a long running operation
        await new Promise(resolve => setTimeout(resolve, 5000));

        if (result.success) {
          sendMessage(connection, 'booked', {
            slot: result.slot,
          });

          // Broadcast updated slots to all clients
          broadcastToAll(db.getAllSlots());
        } else {
          sendMessage(connection, 'error', result.slot);
        }
      } catch (error) {
        console.error('Error booking slot:', error);
        sendMessage(
          connection,
          'error',
          'Internal server error while booking slot'
        );
      }
    }
  });

  connection.on('close', function (reasonCode, description) {
    console.log(
      new Date() + ' Peer ' + connection.remoteAddress + ' disconnected.'
    );

    // Remove connection from our set
    connections.delete(connection);
    console.log(`Total connected clients: ${connections.size}`);
  });
});
