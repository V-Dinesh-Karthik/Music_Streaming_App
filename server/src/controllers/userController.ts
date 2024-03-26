import user from '../models/user'
import { generateTkn } from '../utils/generateTkn'
import { Request, Response } from 'express'

export const register = async(req: Request, res: Response) => {
    const {email, username, password} = req.body;

    const new_user = new user({
        email,username,password
    })

    await new_user.save()

    res.status(201).json({
        success: true,
        user: {
            email: new_user.email,
            username: new_user.username,
        }
    })
}

export const login = async(req: Request, res: Response) => {
    const {email, password} = req.body
    const user_ = await user.findOne({email})

    if(!user_){
        res.status(401)
        throw new Error("USER NOT FOUND")
    }

    if(await user_.comparePassword(password)){
        res.status(201).json({
            success: true,
            user: {
                id: user_._id,
                username: user_.username,
                email: user_.email,
                token: generateTkn(user_._id)
            }
        })
    }else {
        res.status(401);
        throw new Error("Email or Password Incorrect")
    }
}

