import type {NextApiRequest, NextApiResponse} from 'next'

type Response = {
    success: boolean
    msg: string
}

type TableData = {
    columns: Array<string>,
    rows: Array<any>
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
    if(req.method !== 'POST') {
        res.status(405).json({success: false, msg: 'Method not allowed'})
    }


    try {
        const {columns, rows}: TableData = req.body

        if(!columns || !rows || !columns.length || !rows.length){
            return res.status(400).json({success: false, msg: 'Invalid data'})
        }
        
        res.status(201).json({success: true, msg: 'Data uploaded successfully'})
    }catch(e){
        console.log(e);
        res.status(500).json({success: false, msg: 'Internal server error'})
    }

}