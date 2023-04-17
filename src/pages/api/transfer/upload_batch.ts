import {NextApiRequest, NextApiResponse} from 'next'
import {z} from 'zod'
import {group_by} from '@/utils/group_by'
import {remove_runes} from '@/utils/remove_runes'
import {prisma} from '@/utils/prisma'
import { sem_enum, transfer_college_details, transfer_seats_availability, transfer_student_details } from '@prisma/client'

const t_student_details = z.object({
    sno: z.number(),
    cat: z.string().max(2),
    rollno: z.number(),
    name: z.string().min(3),
    sem: z.enum(['I', 'III', 'V', 'VII']),
    branch: z.string().min(3),
    branch_id: z.number().optional(),
    from: z.string(),
    to: z.string(),
    from_id: z.number().optional(),
    to_id: z.number().optional(),
    sanction: z.number().positive(),
    admitted: z.number().min(0),
    vacancy: z.number().min(0),
    attendance: z.number().positive()
})

const t_body = z.object({
    data: z.array(t_student_details).min(1),
    year: z.string().length(9),
    batch: z.number().min(1)
})

export default async function upload_batch_handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method !== 'POST') {
        return res.status(400).json({success: false, msg: 'Invalid method'})
    }

    try{
        let parsed_body = t_body.safeParse(req.body)
        console.log(parsed_body);
        if(!parsed_body.success){
            return res.json({success: false, message: JSON.stringify(parsed_body.error.issues.map(i => i.message).join(', '))})
        }

        const {batch, year} = parsed_body.data

        const branch_map = new Map<string, number>()
        for(let {id, name} of (await prisma.transfer_branches.findMany())){
            branch_map.set(name, id)
        }
        const college_map = new Map<number, transfer_college_details>()
        for(let i of  (await prisma.transfer_college_details.findMany())){
            college_map.set(i.dote_id, i)
        }

        const not_found_list: { sno: number; cat: string; rollno: number; name: string; sem: "I" | "III" | "V" | "VII"; branch: string; from: string; to: string; sanction: number; admitted: number; vacancy: number; attendance: number; branch_id?: number | undefined; from_id?: number | undefined; to_id?: number | undefined }[] = []

        // clean data
        let data = parsed_body.data.data
        for(let i = 0; i < data.length; i++){
            const [from_id, from] = data[i].from.split('-')
            const [to_id, to] = data[i].to.split('-')
            data[i].from_id = parseInt(from_id)
            data[i].to_id = parseInt(to_id)
            
            if(!college_map.has(data[i]?.to_id as number) || !college_map.has(data[i]?.from_id as number)){
                not_found_list.push(data[i])
                continue
            }

            data[i].name = remove_runes(data[i].name)
            data[i].from = remove_runes(from)
            data[i].to = remove_runes(to)
            data[i].branch = remove_runes(data[i].branch)
            
            if(!branch_map.has(data[i].branch)){
                const branch = await prisma.transfer_branches.create({data: {name: data[i].branch} })
                branch_map.set(branch.name, branch.id)
            }
            
            data[i].branch_id = branch_map.get(data[i].branch)
        }

        data = data.filter((i) => !not_found_list.filter(j => j.sno === i.sno).length)

        // group the cleaned data by to college dote id and check whether it is in database
        // if not add to not_found_list
        const group_by_to_college = group_by(data, 'to_id')
        const group_by_to_college_branch: {[key: string | number]: any} = {}
        // let len = 0
        for(let i of Object.keys(group_by_to_college)){
            const group_by_branch = group_by(group_by_to_college[i], 'branch_id', 'admitted')
            group_by_to_college_branch[i] = group_by_branch
            // len += Object.values(group_by_to_college_branch[i]).map(i => i.length).reduce((i,j) => i+j, 0)
        }

        for(let clg of Object.keys(group_by_to_college_branch)){
            const branches = group_by_to_college_branch[clg]
            for(let branch of Object.keys(branches)){
                const branch_students = branches[branch]
                const sems = group_by(branches[branch], 'sem', 'admitted')
                for(let i of Object.keys(sems)){
                    const d: Partial<transfer_seats_availability> = {
                        year,
                        dote_id: parseInt(clg),
                        branch: parseInt(branch),
                        sem: i as sem_enum,
                        sanctioned: sems[i].at(-1).sanction, 
                        admitted: sems[i].at(-1).admitted
                    }
                    await prisma.transfer_seats_availability.create({
                        data: d as transfer_seats_availability
                    })
                }
            }
        }

        const transfer_students: transfer_student_details[] = []
        const fee = (await prisma.service_fee_details.findFirst({where: {service: 'transfer'}}))?.fee

        for(let i = 0; i < data.length; i++){
            const transfer_student: Partial<transfer_student_details> = {
                batch,
                year,
                branch: data[i].branch_id,
                from_college_dote_id: data[i].from_id,
                to_college_dote_id: data[i].to_id,
                name: data[i].name,
                roll_no: `${data[i].rollno}`,
                sem: data[i].sem,
                status: 0,
                fee
            }
            transfer_students.push(transfer_student as transfer_student_details)
        }

        const result = await prisma.transfer_student_details.createMany({
            data: transfer_students
        })

        res.json({success: true, transfer_students, not_found_list})
    }catch(e){
        console.log(e)
        res.status(500).json({success: false, msg: 'Internal server error'})
    }

}

