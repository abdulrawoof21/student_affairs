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
    columns: Array<{[key:string]: string}>,
    datasource: Array<{[key:string]: any}>
}


const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

export default function App() {
    const [tableData, setTableData] = React.useState<TableData>({columns: [], datasource: []})
    const [file, setFile] = React.useState({
        type: FileType.None,
        base64: ''
    });

    

    const excel_file = (columns: Array<string>, data: Array<any>) => {
        const table_columns = columns.map(
            (col:string) => (
                {
                    title: col.trim(), 
                    dataIndex: col.trim().toLowerCase(), 
                    key: col.trim().toLowerCase()
                }
            )
        )
        const table_datasource = []
        for(let i = 0; i < data.length; i++){
            const row = data[i]
            const row_obj: {[key:string]: any} = {key: i+1}
            for(let j = 0; j < table_columns.length; j++){
                row_obj[table_columns[j].key] = row[j]
            }
            table_datasource.push(row_obj)
        }

        setTableData({columns: table_columns, datasource: table_datasource})
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
            excel_file($columns, $data)
            return
        }

        setFile({base64: file as string, type})
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
                <Table columns={tableData.columns} dataSource={tableData.datasource}>
                </Table>
            </div>
        
        </>
    )
};
