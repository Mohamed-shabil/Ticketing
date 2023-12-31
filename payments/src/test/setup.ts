import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";



// before all is a hook function  
// what ever we give inside the function will run 
// beforeAll

jest.mock('../nats-wrapper');   

let mongo:any;
process.env.STRIPE_KEY = 'pk_test_51OT0m1SBqQNmRFp2b1HOsHjUjMB7f2ht4EnZ5saT9hXCq5xjH61VvvMm49AH34T5aLELQ8FuavwoUzP57ClDkv6l00VlNLXNGv'
beforeAll(async()=>{
    process.env.JWT_KEY = 'asdf';
    mongo = await MongoMemoryServer.create();
    const mongoUri = await mongo.getUri();
    await mongoose.connect(mongoUri);
})

// this will run before each of our test 
beforeEach( async ()=>{
    jest.clearAllMocks();
    const collections  = await mongoose.connection.db.collections();
    for(let collection of collections){
        await collection.deleteMany({})
    }
})

// this will run after all tests are complete
afterAll( async ()=>{
    await mongo.stop();
    await mongoose.connection.close();
})


