import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Table, UploadProps } from 'antd';
import { Button, message, Upload } from 'antd';
import {readExcel, readCSV} from 'danfojs'
import {base64} from '@/utils/base64'


enum FileType {
    None,
    Image,
    Pdf,
    Excel
}

type TableData = {
    columns: Array<string>,
    rows: Array<any>
}


const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

export default function App() {
    const [tableData, setTableData] = React.useState<TableData>({columns: [], rows: []})
    const [file, setFile] = React.useState({
        type: FileType.None,
        base64: ''
    });

    
    const get_columns_as_obj = (columns: Array<string>) => {
        const data = []
        for(let i = 0; i < columns.length; i++){
            data.push(
                {
                    title: columns[i].trim(), 
                    dataIndex: columns[i].trim().toLowerCase(), 
                    key: columns[i].trim().toLowerCase()
                }
            )
        }
        return data
    }

    const get_rows_as_obj = (columns: Array<string>, rows: Array<any>) => {
        const data = []
        for(let i = 0; i < rows.length; i++){
            const row = rows[i]
            const row_obj: {[key:string]: any} = {key: i+1}
            for(let j = 0; j < columns.length; j++){
                const column = columns[j].trim().toLowerCase()
                row_obj[column] = row[j]
            }
            data.push(row_obj)
        }
        return data
    }

    const change = async (info: any) => {
        if (info.fileList.length > 1) info.fileList.splice(0, info.fileList.length-1)
        
        const file = await base64(info.file.originFileObj)

        let type = info.file.type
        type = type.includes('image') 
                ? FileType.Image 
                : (type.includes('pdf') ? FileType.Pdf : FileType.Excel)

        if (type === FileType.Excel) {
            const {$columns, $data}: any = await readExcel(info.file.originFileObj)
            setTableData({columns: $columns, rows: $data})
            return
        }

        setFile({base64: file as string, type})
    }

    const save = async() => {
        const {columns, rows} = tableData
        const request = await fetch('/api/transfer/upload_batch', {
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({columns, rows})
        })
        const response = await request.json()
        console.log(response);
        if (!response.success) {
            message.error(response.msg)
        }else{
            message.success(response.msg)
        }
    }
    
    return (
        <>
            <Upload 
                onChange={change}
                accept={ACCEPTED_FILE_TYPES.join(',')}
                multiple={false}
                name='file'
                >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>



            <div>
                {
                    tableData.columns.length > 0 && tableData.rows.length > 0 &&
                    <>
                        <Button 
                            onClick={save} 
                            type='primary' 
                            style={{backgroundColor: 'green'}} 
                        >Save</Button>

                        <Table 
                            columns={get_columns_as_obj(tableData.columns)} 
                            dataSource={get_rows_as_obj(tableData.columns, tableData.rows )}
                        ></Table>
                    </>
                }
            </div>
        
        </>
    )
};
