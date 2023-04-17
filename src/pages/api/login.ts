import {prisma} from '@/utils/prisma'
import {SignJWT} from 'jose'
import type {NextApiRequest, NextApiResponse} from 'next'
import type {User} from '@/utils/types'

type Body = {
    email: string
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

        const {email, password}: Body = req.body
        
        if(!email || !password || !email.trim().length || !password.trim().length || password.trim().length !== 64){
            return res.status(400).json({success: false, msg: 'Invalid credentials', data: null})
        }

        const accesslist = await prisma.accesslist.findFirst({
            where: {
                email
            }    
        })

        if(!accesslist || !accesslist.active){
            return res.status(401).json({success: false, msg: 'Unauthorized', data: null})
        }

        let user = await prisma.users.findFirst({
            where: { email, password }
        })

        if (!user) {
            return res.status(401).json({success: false, msg: 'Invalid credentials', data: null})
        }

        user = await prisma.users.update({
            where: { id: user.id },
            data: { last_login: new Date() },
            include: { designation: true, user_privileges: {include: {privileges: true}}}
        })

        const user_details = structuredClone(user) as unknown as User
        delete user_details.password

        const token = await(new SignJWT(user_details).setProtectedHeader({alg: 'HS256', typ: 'JWT'}).sign(new TextEncoder().encode(`${process.env.JWT_SECRET_KEY}`)))

        const seven_days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        res.setHeader('Set-Cookie', `token=${token};Secure;HTTPOnly;SameSite=Strict;path=/;Expires=${seven_days}`)
        res.status(200).json({success: true, msg: 'User verified successfully', data: user_details})

    }catch(e){
        console.log(e);
        res.status(500).json({success: false, msg: 'Internal server error', data: null})
    }
}