import { Publisher, Subjects, TicketUpdatedEvent} from '@mstiketing/common'
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';


export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

