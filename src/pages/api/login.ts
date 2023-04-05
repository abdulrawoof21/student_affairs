import {prisma} from '@/utils/prisma'
import {sign} from 'jsonwebtoken'
import type {NextApiRequest, NextApiResponse} from 'next'
import type {User} from '@/utils/types'

type Body = {
    emailId: string
    password: string
}

type Response = {
    success: boolean
    msg: string
    data: User | null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    if(req.method !== 'POST') {
        return res.status(405).json({success: false, msg: 'Method not allowed', data: null})
    }

    try{

        const {emailId, password}: Body = req.body
        
        if(!emailId || !password || !emailId.trim().length || !password.trim().length || password.trim().length !== 64){
            return res.status(400).json({success: false, msg: 'Invalid credentials', data: null})
        }

        const user = await prisma.user.findFirst({
            where: {
                emailId,
                password
            }
        })

        if (!user) {
            return res.status(401).json({success: false, msg: 'Invalid credentials', data: null})
        }

        const user_details = structuredClone(user) as User
        delete user_details.password

        const token = sign(user_details, process.env.JWT_SECRET_KEY as string)

        const seven_days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        res.setHeader('Set-Cookie', `token=${token};Secure;HTTPOnly;SameSite=Strict;path=/;Expires=${seven_days}`)
        res.status(200).json({success: true, msg: 'User verified successfully', data: user_details})

    }catch(e){
        console.log(e);
        res.status(500).json({success: false, msg: 'Internal server error', data: null})
    }
}

    