import request from 'supertest';
import { app } from '../../app'
import mongoose from 'mongoose';
import { signin } from '../../services/signinFunction';
import { Ticket } from '../../models/ticket';

it('returns a 404 if the provided id does not exist',async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString()
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie',signin())
        .send({
            title:'asfasf',
            price: 30
        })
        .expect(404)
});

it('returns a 401 if the user is  does not authenticated',async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title:'asfasf',
            price: 30
        })
        .expect(401)
});

it('returns a 401 if the user does not own the ticket',async ()=>{
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',signin())
        .send({
            title:'asldkfj',
            price:20
        });


    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .send({
            title : 'jskfhjkwlef',
            price : 1000
        })
        .expect(401)
});


it('returns a 400 if the user provided an invalid does title or price',async ()=>{
    const cookie = signin()
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title:'asldkfj',
            price:20
        });
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title:'lsdkhjfvklsdh',
            price:-20
        })
        .expect(400);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title:'',
            price:20
        })
        .expect(400);
});

it('updated the ticket provide valid inputs   ',async ()=>{
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',signin())
        .send({
            title:'asldkfj',
            price:20
        });
    console.log(response);
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',signin())
        .send({
            title:'new title',
            price:100
        })
        .expect(200);
    
    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();
    expect(ticketResponse.body.title).toEqual('new title');
    expect(ticketResponse.body.price).toEqual(100);
});

// it('returns a 404 if the provided id does not exist',async ()=>{

// });

it('rejects updated if the ticket is reserved',async ()=>{
    const cookie = signin();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie',cookie)
        .send({
            title:'khsdjkhf',
            price:20
        });
    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({orderId:new mongoose.Types.ObjectId().toHexString()});
    await ticket!.save();

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie',cookie)
        .send({
            title:' New ticket',
            price:100,
        })
        .expect(400);
})