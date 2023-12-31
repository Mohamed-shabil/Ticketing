import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Ticket } from '../../model/ticket';
import { signin } from '../../services/signinFunction';
import { Order,OrderStatus } from '../../model/order';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled event',async()=>{
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title:'Concert',
        price:20
    });
    await ticket.save();

    const user = signin();
    // make a request to  create an order
    const {body:order } = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({ticketId:ticket.id})
        .expect(201);

    // make a request to cancel the order 
    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie',user)
        .send()
        .expect(204);

    // expectation to make sure the things is cancelled
     
    expect(natsWrapper.client.publish).toHaveBeenCalled();


    // const updatedOrder = await Order.findById(order.id);

    // expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);

})


it('emit a order cancelled event',async()=>{

});