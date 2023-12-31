import nats,{Message, Stan} from 'node-nats-streaming'
import { randomBytes } from 'crypto';
import { TicketCreatedListener } from './events/ticket-created-listener';

console.clear()

const stan = nats.connect('ticketing',randomBytes(4).toString('hex'),{
    url:'http://localhost:4222'
})

stan.on('connect',()=>{
    console.log('Listeners connected to NATS');

    stan.on('close',()=>{
        console.log('NATS connection closed')
        process.exit()
    })

    new TicketCreatedListener(stan).listen();
    
})

process.on('SIGINT',()=>stan.close());
process.on('SIGTERM',()=>stan.close());




// Subject : Name of the channel this listener is going to listen to
// onMessage : Function to run  when a message is recieved
// client (stan) : pre-initialized NATS client
// queueGroupName : name of seconds this listener has to ack a message
// subascriptionOption : Default subscription options
// listen : Code to setup the subscription 
// parseMEssage : Helper fucntion to parse a message  



