import { Message } from 'node-nats-streaming';
import { OrderCreatedEvent, OrderStatus } from "@mstiketing/common";
import { OrderCreatedListener } from "../order-created-listeners"
import { natsWrapper } from "../../../nats-wrapper"
import { Ticket } from "../../../models/ticket";
import mongoose from "mongoose";
 
const setup = async ()=>{
    // create an instace of the listener
    const listener = new OrderCreatedListener(natsWrapper.client);

    // Create and save a ticket
    const ticket = Ticket.build({
        title: 'Concert',
        price:99,
        userId:'sdk;jgjkhasdfgjk'
    })

    await ticket.save();

    // Create the fake data event

    const data:OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status : OrderStatus.Created,
        userId: 'jkshdjfkhsjkd',
        expiresAt:'jedfjsd',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }
    // @ts-ignore
    const msg:Message = {
        ack:jest.fn()
    }

    return { listener,ticket,data,msg};
}

it('sets the userId of the ticket',async ()=>{

    const { listener, ticket, data, msg } =  await setup();
    
    await listener.onMessage(data, msg);
    
    const updateTicket = await Ticket.findById(ticket.id);
    
    expect(updateTicket!.orderId).toEqual(data.id);

});

it('acks the msg',async()=>{
    const { listener, ticket, data, msg } =  await setup();
    
    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})

it('publishes a ticket updated event',async ()=>{
    const { listener, ticket,data ,msg} = await setup();
    await listener.onMessage(data,msg);
    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const ticketUpdatedData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);

    expect(data.id).toEqual(ticketUpdatedData.orderId);
})

