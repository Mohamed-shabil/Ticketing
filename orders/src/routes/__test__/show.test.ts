import request from 'supertest';
import {app} from '../../app'
import { Ticket } from '../../model/ticket';
import { signin } from '../../services/signinFunction';
import mongoose from 'mongoose';

it('fetches the order',async()=>{
    // create a Ticket\
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title:'Concert',
        price: 20
    })
    await ticket.save();

    const user = signin();
    // make a request to build an order with this ticket

    const { body:order } = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({ticketId:ticket.id})
        .expect(201); 

    // make request to fetch the order
    const { body:fetchOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie',user)
        .send()
        .expect(200);
    expect(fetchOrder.id).toEqual(order.id);
})


it('returns an error if one user tries to fetch an another users order',async()=>{
    // create a Ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title:'Concert',
        price: 20
    })
    await ticket.save();

    const user = signin();
    // make a request to build an order with this ticket

    const { body:order } = await request(app)
        .post('/api/orders')
        .set('Cookie',user)
        .send({ticketId:ticket.id})
        .expect(201); 

    // make request to fetch the order
    const { body:fetchOrder} = await request(app)
        .get(`/api/orders/${order.id}`)
        .set('Cookie',signin())
        .send()
        .expect(401);
})