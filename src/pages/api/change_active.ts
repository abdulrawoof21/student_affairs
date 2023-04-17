import {prisma} from '@/utils/prisma'
import type {NextApiRequest, NextApiResponse} from 'next'
import type {User} from '@/utils/types'

type Response = {
    success: boolean
    msg: string
}


export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    if(req.method !== 'GET') {
        return res.status(405).json({success: false, msg: 'Method not allowed'})
    }
    console.log("state");

    try{
        const user = await prisma.accesslist.findFirst({where: {email: req.query.email as string}})
        if(!user){
            return res.status(404).json({success: false, msg: 'User not found'})
        }

        console.log(user);

        const updated_user = await prisma.accesslist.update({
            where: {id: user.id},
            data: {active: !user.active}
        })

        return res.status(200).json({success: true, msg: 'Active state changed'})

    }catch(err){
        console.log(err)
        return res.status(500).json({success: false, msg: 'Internal server error'})
    }
}