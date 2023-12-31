import  express,{ Request, Response } from 'express'
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator'
import { User } from '../models/user';
import { Password } from '../services/password';
import { BadRequestError ,validateRequest } from '@mstiketing/common';

const router = express.Router();
router.post('/api/users/signin',[
    body('email')
        .isEmail()
        .withMessage('Email Must be valid')
    ,
    body('password')
        .trim()
        .notEmpty()
        .withMessage('you must supply a password')
],
validateRequest,
 async (req:Request, res:Response)=>{
    const {email,password} = req.body;
    const existingUser = await User.findOne({email});

    if(!existingUser){
        throw new BadRequestError('Invalid Credintials');
    }
    const passwordMatch = await Password.compare(existingUser.password,password)
    if(!passwordMatch){
        throw new BadRequestError('Password is not matching');
    }
    // Generate JWT
    const userJwt = jwt.sign({
        id:existingUser.id,
        email:existingUser.email
        },
        process.env.JWT_KEY!
    );
    // Store it on session object 
    req.session = {
        jwt:userJwt
    };
    res.status(201).send(existingUser);
})
export { router as signinRouter }