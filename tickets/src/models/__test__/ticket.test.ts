import { Ticket } from "../ticket";

it('implements optimistic concurrency control',async ()=>{
    // Create an instance of a ticket 
    const ticket = Ticket.build({
        title:'Concert',
        price:5,
        userId:'1234'
    })

    // Save the ticket to the database
    await ticket.save();
    console.log(ticket);
    // fetch the ticket twice
    const firstIntance = await Ticket.findById(ticket.id)
    const secondInstance = await Ticket.findById(ticket.id)
    // make two seperate changes to tickets we fetched
    firstIntance!.set({price:10});
    secondInstance!.set({price:15});
    // save the first fetched ticket

    await firstIntance!.save()
    // save the  second fetched ticket and expect an error 
    try{
        await secondInstance!.save();
    }catch(err){
        return 
    }

    throw new Error('Should not reach this point');
})


it('increment the version number on multiple saves',async ()=>{
    const ticket = Ticket.build({
        title:'Concert',
        price:20,
        userId:'123'
    })

    await ticket.save();

    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);

})