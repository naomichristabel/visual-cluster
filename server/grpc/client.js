import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';
import * as grpc from '@grpc/grpc-js'
import * as protoLoader from '@grpc/proto-loader'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = 8082
const PROTO_FILE = './proto/random.proto'

const packageDef = protoLoader.loadSync(path.resolve(__dirname, PROTO_FILE))
const grpcObj = (grpc.loadPackageDefinition(packageDef)) 

const client = new grpcObj.randomPackage.Random(
  `0.0.0.0:${PORT}`, grpc.credentials.createInsecure()
)

const deadline = new Date()
deadline.setSeconds(deadline.getSeconds() + 5)
client.waitForReady(deadline, (err) => {
  if (err) {
    console.error(err)
    return
  }
  onClientReady()
})


function onClientReady() {
  client.PingPong({message: "Ping"}, (err, result) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(result)
  })
}