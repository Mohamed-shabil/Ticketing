import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@mstiketing/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    subject: Subjects.OrderderCreated = Subjects.OrderderCreated;
    queueGroupName = queueGroupName;
    async onMessage(data:OrderCreatedEvent['data'],msg:Message){
        const order = Order.build({
            id:data.id,
            price:data.ticket.price,
            status:data.status,
            userId:data.userId,
            version:data.version  
        })

        await order.save();
 
        msg.ack();
    }
}