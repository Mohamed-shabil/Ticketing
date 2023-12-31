import { Publisher, Subjects, TicketCreatedEvent} from '@mstiketing/common'
import { Ticket } from '../../models/ticket';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

 