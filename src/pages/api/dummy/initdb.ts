import {prisma} from '@/utils/prisma'
import {college_code, branches} from '@/utils/college_code'
import {NextApiRequest, NextApiResponse} from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    // await prisma.designation.create({
    //     data: {
    //         id: 0,
    //         name: 'admin',
    //     }
    // })

    // await prisma.accesslist.create({
    //     data: {
    //      email: 'admin@admin.com',
    //      designation_id: 0
    //     }
    // })

    // await prisma.privileges.createMany(
    //     {
    //         data: [
    //             {name: 'transfer'},
    //             {name: 'readmission'},
    //             {name: 'break_of_study'},
    //             {name: 'rra'},
    //             {name: 'name_change'},
    //             {name: 'greivance'},
    //         ]
    //     }
    // )


    // await prisma.users.create({
    //     data: {
    //         id: 9999,
    //         email: 'admin@admin.com',
    //         password: '032610a09c5344ef54169257ca0d4f96ad50fb578249c568c9c3ce10399aa51c',
    //         designation_id: 0,
    //         dob: new Date('1987-07-07'),
    //         phone: '19870707',
    //         fullname: 'Killua',
    //         avatar: 'https://staticg.sportskeeda.com/editor/2022/07/8af85-16569274154588-1920.jpg'
    //     }
    // })

    // await prisma.user_privileges.createMany({
    //     data: [
    //         {user_id: 9999, privilege_id: 1},
    //         {user_id: 9999, privilege_id: 2},
    //         {user_id: 9999, privilege_id: 3},
    //         {user_id: 9999, privilege_id: 4},
    //         {user_id: 9999, privilege_id: 5},
    //         {user_id: 9999, privilege_id: 6},
    //     ]
    // })

    // await prisma.designation.createMany({
    //     data: [
    //         {name: 'Director'},
    //         {name: 'Deputy Director'},
    //         {name: 'Staff'},
    //     ]
    // })

// [dote, coe, college_name, college_address, pincode]
    // const clg_with_codes = college_code.filter((i) => i[1]).map( i => ({dote_id: i[0], coe_id: i[1], name: i[2], address: i[3], pincode: i[4]})).filter(i => i.dote_id)

    // for(let i =0; i < clg_with_codes.length; i++){
    //     const clg = clg_with_codes[i]
    //     try{

    //         await prisma.transfer_college_details.create({ data: clg })
    //     }catch(e) {
    //         console.log(i);
    //         console.log(e);
    //     }
    // }


    // const clg_branches = [...new Set(branches)].map((i, idx) => ({id: idx+1, name: i}))
    // const data = await prisma.transfer_branch.createMany({
    //     data: [...clg_branches]
    // })

    // await prisma.transfer_status.create({data: {status_name: 'created', id: 0}})


    res.json(
        {
            message: 'done',
        }
    )
}