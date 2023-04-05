import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';

export const base64 = async (file: Blob) => {
    let result = await new Promise(
        (resolve) => {
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
        }
    )
    return result
}


export default function App() {
    const [file, setFile] = React.useState<string>('');
    
    const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', '.csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'].join(',');

    const change = async (info: any) => {
        if (info.fileList.length > 1) {
            info.fileList.splice(0, info.fileList.length-1)
        }
        const file = await base64(info.file.originFileObj)
        setFile(file as string)
    }
    
    return (
        <>
            <Upload 
                onChange={change}
                accept={ACCEPTED_FILE_TYPES}
                multiple={false}
                name='file'
                >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>

            <iframe src={file} />
        
        </>
    )
};
