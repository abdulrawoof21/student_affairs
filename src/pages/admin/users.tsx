import {List, Button, Form, Input, Select} from 'antd'
import { GetServerSidePropsContext } from 'next'
import { Suspense, useDeferredValue, useEffect, useState } from 'react'
import type {AccessList, Privileges, User} from '@/utils/types'
import { users as Users, designation as Designations } from '@prisma/client'
import { Loading3QuartersOutlined, LoadingOutlined } from '@ant-design/icons'

type Props = {
    user: U
}

interface U extends User{
    active: boolean
}



export default function Page(props: Props) {
    const [users, setUsers] = useState<Array<U>>([])
    const [designations, setDesignations] = useState<Array<Designations>>([])
    const [privileges, setPrivileges] = useState<Map<number, Privileges>>()

    const get_something = async (query: string) => {
        try{
            const req = await fetch(`/api/get_${query}`)
            const res = await req.json()
            return res.data
        }catch(err){
            console.log(err);
            alert('Error getting users')
        }
    }

    const set_users_designations = async () => {
        const [users, designations] = await Promise.all([get_something('users'), get_something('designations')])
        setUsers(users as unknown as U[])
        setDesignations(designations as unknown as Designations[])
    }

    useEffect(() => {
        set_users_designations()

        let all_privileges = new Map()
        if(!props.user.user_privileges) return
        for(let i = 0; i < props.user.user_privileges.length; i++){
            let privilege = props.user.user_privileges[i].privileges
            all_privileges.set(privilege?.id, privilege)
        }
        setPrivileges(all_privileges)

    }, [])

    useEffect(() => {
        let all_designations = new Set<Designations>()
        for(let i=0; i < users.length; i++) {
            let user = users[i].designation as unknown as Designations
            all_designations.add(user)
        }
        setDesignations([...all_designations])


    }, [users])

    const options = [
        { value: 'jack', label: 'Jack' },
        { value: 'lucy', label: 'Lucy' },
        { value: 'yiminghe', label: 'Yiminghe' },
        { value: 'disabled', label: 'Disabled', disabled: true }
    ]

    const change_active = async(user_email: string) => {
        try{

            const req = await fetch(`/api/change_active?email=${user_email}`)
            const res = await req.json()
            console.log(res);
        } catch(e) {
            console.log(e);
        }
    }

    return (
        <>
            <List 
                dataSource={users}
                renderItem={
                    item => (
                        <>
                            <span>{item.fullname}</span>
                            &nbsp;&nbsp;&nbsp;
                            <span>{item.designation?.name}</span>
                            &nbsp;&nbsp;&nbsp;
                            <span>{new Date(`${item.last_login}`).toLocaleDateString()}</span>
                            &nbsp;&nbsp;&nbsp;
                            <span>{item.email}</span>
                            &nbsp;&nbsp;&nbsp;
                            <span>{item.phone}</span>
                            &nbsp;&nbsp;&nbsp;
                            <span>{item.avatar}</span>
                            &nbsp;&nbsp;&nbsp;
                            <span>{item.user_privileges?.map((i, idx) => <i key={idx}>{i.privileges?.name.toUpperCase()} &nbsp;</i>)}</span>
                            &nbsp;&nbsp;&nbsp;
                            <Button 
                                type={item.active ? 'default' : 'primary'} 
                                style={{backgroundColor: item.active ? 'red' : 'lightgreen', color: item.active ? 'white' : 'black'}} 
                                onClick={()=>change_active(item.email)}
                            >{item.active ? 'Inactive' : 'Active'}</Button>
                        </>
                    )
                }
            />
                <Form>
                    <h3>Add Users</h3>
                    <Form.Item
                        label='Email'
                        labelAlign={'left'}
                        >
                        <Input type='email'/>
                    </Form.Item>

                    <Form.Item
                        label='Designation'
                        >
                        <Suspense fallback={<div><Loading3QuartersOutlined /> <LoadingOutlined /> Loading...</div>}>

                            <Select 
                                options={designations.map(i => ({label: i.name, value: i.id}))}
                                defaultValue={designations[0]?.name}
                                >
                            </Select>
                        </Suspense>
                    </Form.Item>
                </Form>
        </>
    )
}

export const getServerSideProps = async ({req, res}: GetServerSidePropsContext) => {

    const token = req.cookies?.token
    const {decodeJwt} = await import('jose')

    const user = decodeJwt(`${token}`) as any
    if(user.designation.name !== 'admin') {
        return {
            redirect: {
                destination: '/404',
                permanent: false
            }
        }
    }

    const {prisma} = await import('../../utils/prisma')

    let accesslist: AccessList[] = JSON.parse(JSON.stringify(await prisma.accesslist.findMany()))
    user.active = false
    for(let i of accesslist){
        if(i.email === user.email){
            user.active = i.active
            break
        }
    }

    if(user.active === false) {
        res.setHeader('Set-Cookie', `token=;Secure;HTTPOnly;SameSite=Strict;path=/;Expires=${new Date(0)}`)
        return {
            redirect: {
                destination: '/login',
                permenant: false
            }
        }
    }
    
    return {props: {user}}

}



