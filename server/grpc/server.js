// const express = require('express');
// const cors = require('cors');

// const grpc = require('@grpc/grpc-js');
// const protoLoader = require('@grpc/proto-loader');

// const app = express();

// app.use(cors());
// app.use(express.json());

// app.get('/message', (req, res) => {
//     res.json({ message: "Hello from server!" });
// });

// app.listen(8000, () => {
//     console.log(`Server is running on port 8000.`);
//   });

import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 8082;
const PROTO_FILE = './proto/random.proto';

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE));
const grpcObj = grpc.loadPackageDefinition(packageDef);
const randomPackage = grpcObj.randomPackage;

function main() {
  const server = getServer()

  server.bindAsync(`0.0.0.0:${PORT}`, grpc.ServerCredentials.createInsecure(),
  (err, port) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(`Your server as started on port ${port}`)
    server.start()
  })
}

function getServer() {
  const server = new grpc.Server()
  server.addService(randomPackage.Random.service, {
    PingPong: (req, res) => {
      console.log(req.request)
      res(null, {message: "Pong"})
    },
   
  } )

  return server
}

main()