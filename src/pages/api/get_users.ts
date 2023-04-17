import type { NextApiRequest, NextApiResponse } from "next";
import {prisma} from '@/utils/prisma'
import type {User, AccessList} from '@/utils/types'

interface U extends User{
    active: boolean
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== 'GET') {
        return res.status(405).json({success: false, msg: 'Method not allowed'})
    }


    try{
        const [users, accesslist] = (
            await Promise.all(
                [
                    prisma.users.findMany({ include: { designation: true, user_privileges: { include: { privileges: true } } } }),
                    prisma.accesslist.findMany()
                ]
            )) as unknown as [U[], AccessList[]]

        console.log(accesslist);
    
        for(let user of users){
            user.active = false
            for(let i of accesslist){
                if(i.email === user.email){
                    user.active = i.active
                    break
                }
            }
            delete user.password
        }
    
        return res.status(200).json({success: true, msg: 'Success', data: users})

    }catch(err){
        console.log(err)
        return res.status(500).json({success: false, msg: 'Internal server error', data: null})
    }
}
