import express from 'express';
import {json} from 'body-parser'
import 'express-async-errors'
import cookieSession from 'cookie-session';
import { currentUser , errorHandler,NotFoundError }  from '@mstiketing/common';
import { indexOrderRouter } from './routes/index' 
import { deleteOrderRouter} from './routes/delete'
import { showOrderRouter} from './routes/show'
import { newOrderRouter} from './routes/new'
const app = express();
app.set('trust proxy',true); 

app.use(json());

app.use(
    cookieSession({
        signed:false,
        secure: process.env.NODE_ENV !== 'test',
    })
)
app.use(currentUser);
app.use(indexOrderRouter);  
app.use(deleteOrderRouter);
app.use(showOrderRouter);
app.use(newOrderRouter); 

app.all('*',async(req,res)=>{
    throw new NotFoundError()
})

app.use(errorHandler);

export {app}