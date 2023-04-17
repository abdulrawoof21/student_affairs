import {Form, Input, Button, message} from 'antd'
import {useRouter} from 'next/router'

type FormFields = {
    email: string
    password: string
}

export default function Login(){
    const [form] = Form.useForm()
    const router = useRouter()

    const hashed_password = async(password: string) => {
        const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password))
        return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
    }

    const submit = async (values: FormFields) => {
        const password = await hashed_password(values.password)
        try{
            const validate = await fetch('/api/login', {
                headers: {'Content-Type': 'application/json'},
                method: 'POST',
                body: JSON.stringify({...values, password})
            })
            const data = await validate.json()
            if(!data.success){
                alert('Login Failed')
                return
            }
            console.log(data);

            router.replace('/')
        }catch(e){
            console.log(e);
        }
    }

    return (
        <>
            <Form form={form} onFinish={submit}>
                <Form.Item
                    label='Email'
                    name='email'
                    rules={[{required: true, message: 'Enter Email ID'}]}
                >
                    <Input type='email' placeholder='Email' />
                </Form.Item>

                <Form.Item
                    label='Password'
                    name='password'
                    rules={[{required: true, message: 'Enter Password'}]}
                >
                    <Input type='password' placeholder='Password' />
                </Form.Item>

                <Form.Item>
                    <Button type='primary' htmlType='submit'>
                        Login
                    </Button>
                </Form.Item>
            </Form>
        </>
    )
}