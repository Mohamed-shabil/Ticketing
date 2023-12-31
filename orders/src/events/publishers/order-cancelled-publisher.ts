import { Publisher, Subjects, OrderCancelledEvent} from '@mstiketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.orderCancelled = Subjects.orderCancelled;
    
}