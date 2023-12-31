import { Listener } from "./base-listener";
import { Message} from "node-nats-streaming";
import { TicketCreatedEvent } from "./ticket-created-events";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent>{
    subject : Subjects.TicketCreated = Subjects.TicketCreated;

    queueGroupName = 'payaments-service';
    
    onMessage(data:TicketCreatedEvent['data'], msg:Message): void {
           
        console.log('Event Data!',data); 
        
        msg.ack();
    }
}