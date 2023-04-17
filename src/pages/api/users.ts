import type {NextApiRequest, NextApiResponse} from 'next'

type Response = {
    success: boolean
    msg: string
    data: any | null
}
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== 'GET') {
        return res.status(405).json({success: false, msg: 'Method not allowed', data: null})
    }

    try{
        
    }catch(e){
        console.log(e);
        res.status(500).json({success: false, msg: 'Internal server error', data: null})
    }

}
