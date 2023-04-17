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
        const designations = await prisma.designation.findMany()
        return res.status(200).json({success: true, msg: 'Success', data: designations})
    }catch(err){
        console.log(err)
        return res.status(500).json({success: false, msg: 'Internal server error', data: null})
    }
}
