import {useRef, useState} from 'react'
import {DataGrid} from '@mui/x-data-grid'
import {Box, Button, Autocomplete, TextField, Grid} from '@mui/material'
import {Upload} from '@mui/icons-material'
import UploadBatchForm from '@/components/transfer/UploadBatch/UploadBatch'


export default function App() {
    const [data, setData] = useState({rows: [], columns: []})
    const [show_del, set_show_del] = useState<{selected: Array<any>, show: boolean}>({selected: [], show: false})

    const academic_year_ref = useRef<HTMLInputElement>(null)
    const batch_ref = useRef<HTMLInputElement>(null)

    const process_row_update = (n: any, o: any) => {
        return n
    }

    const save = async() => {
        const {rows} = data

        const year = academic_year_ref.current?.value
        const batch = batch_ref.current?.valueAsNumber

        console.log(rows, year, batch);

        const request = await fetch('/api/transfer/upload_batch', {
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({data: rows, year, batch})
        })
        const response = await request.json()
        console.log(response);
        // if (!response.success) {
        //     // message.error(response.msg)
        // }else{
        //     // message.success(response.msg)
        // }
    }

    return (
    <>
        <UploadBatchForm table_data={data} set_table_data={setData} show_del={show_del} save={save} academic_year_ref={academic_year_ref} batch_ref={batch_ref} />

        <div style={{height: '90vh'}}>
            <DataGrid
                sx={{
                    boxShadow: 2,
                    border: 2,
                    borderColor: 'transparent',
                    '& .MuiDataGrid-cell:hover': {
                      color: 'primary.main',
                    },
                    '& .MuiDataGrid-columnHeader': {
                        fontWeight: 600,
                        backgroundColor: '#cccccc80'
                    }
                  }}
                rows={data.rows}
                columns={data.columns} 
                processRowUpdate={process_row_update} 
                onProcessRowUpdateError={e => {console.log(e);}} 
                checkboxSelection
                disableRowSelectionOnClick
                onRowSelectionModelChange={(i,j) => {set_show_del({selected: [...i], show: !!i.length})}}

            />

        </div>

        <datalist id="batch">
            <option>Hello</option>
        </datalist>
    </>)

}




