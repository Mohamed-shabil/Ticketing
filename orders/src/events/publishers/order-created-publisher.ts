import { Publisher, OrderCreatedEvent, Subjects } from "@mstiketing/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderderCreated = Subjects.OrderderCreated;
}

