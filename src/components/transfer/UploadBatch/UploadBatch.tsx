import {Grid, Autocomplete, TextField, Button, Input, Typography} from '@mui/material'
import {Upload, Delete, Save} from '@mui/icons-material'
import { useRef, useState} from 'react'
import type {RefObject} from 'react'
import {readExcel, readCSV} from 'danfojs'
import {base64} from '@/utils/base64'

enum FileType {
    None,
    Image,
    Pdf,
    Excel
}

type Props = {
    table_data: {rows: Array<any>, columns: Array<any>},
    set_table_data: any,
    show_del: {selected: Array<number>, show: boolean},
    save: any,
    academic_year_ref: RefObject<any>,
    batch_ref: RefObject<any>
}

const academic_year = ['2020-2021', '2021-2022', '2022-2023', '2023-2024'].map(i => ({label: i, value: i}))

const file_types = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf', 'text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];


export default function UploadBatch(props: any){
    const {table_data, set_table_data, show_del, save, academic_year_ref, batch_ref}: Props = props

    const [data_file, set_data_file] = useState({file: '', name: ''})

    const change = async (e: any) => {
        const file = e.target.files[0]
        const name = file.name

        const base = await base64(file) as string
        set_data_file({file: base, name})

        const columns = [
            {field:'sno', headerName: 'S. No', width: 50}, 
            {field:'cat', headerName: 'Category', editable: true, width: 80}, 
            {field:'rollno', headerName: 'Roll no', editable: true, width: 100}, 
            {field:'name', headerName: 'Name', editable: true, width: 200}, 
            {field:'sem', headerName: 'Semester', editable: true, width: 100}, 
            {field:'branch', headerName: 'Branch', editable: true, width: 300}, 
            {field:'from', headerName: 'From', editable: true, width: 300}, 
            {field:'to', headerName: 'To', editable: true, width: 300}, 
            {field:'sanction', headerName: 'Sanctioned', editable: true}, 
            {field:'admitted', headerName: 'Admitted', editable: true}, 
            {field:'vacancy', headerName: 'Vacancy', editable: true}, 
            {field:'attendance', headerName: 'Attendance', editable: true}
        ]

        const {$data}: any = await readExcel(file)
        const rows = []

        const keys = columns.map(i => i.field)
        for(let i = 0; i < $data.length; i++) {
            const row = $data[i]
            const d: {[key:string]: any}= {}
            for(let k= 0; k < keys.length; k++){
                d[keys[k]] = row[k]
            }
            d.id = i
            rows.push(d)
        }
        set_table_data({rows, columns})
    }

    const delete_table_data = () => {
        const {selected} = show_del
        console.log(selected);
        set_table_data({...table_data, rows: table_data.rows.filter((i) => !selected.includes(i.id))})
    }

    return (
        <>
            <Grid container spacing={1} alignItems={'center'} alignContent={'end'} >
                <Grid item>
                    <Autocomplete
                        options={academic_year} 
                        renderInput={(p) => 
                            <TextField  
                                {...p} 
                                size='small' 
                                label="Academic Year" 
                                inputRef={academic_year_ref} 
                                InputLabelProps={{style: {fontSize: '14px'}}}
                                InputProps={{style: {fontSize: '14px'}}}
                            /> 
                        }
                        disablePortal
                        freeSolo
                    />
                </Grid>

                <Grid item>
                    <TextField 
                        label="Batch" 
                        variant='outlined' 
                        type='number' 
                        size={'small'} 
                        InputLabelProps={{style: {fontSize: '14px'}}}
                        InputProps={{style: {fontSize: '14px'}}}
                        inputRef={batch_ref} 
                    />
                </Grid>

                <Grid item>
                    <Button variant='outlined'  component='label' size='small' startIcon={<Upload />}>
                        Upload file <input hidden onChange={change} accept={file_types.join(',')} type='file' />
                    </Button>
                </Grid>

                {
                    show_del.show &&
                    <Grid item>
                        <Button onClick={delete_table_data} variant='contained' color='error' size='small' startIcon={<Delete />}>
                            Delete
                        </Button>
                    </Grid>
                }

                {
                    !!table_data.rows.length &&
                    <Grid item>
                        <Button variant='contained' startIcon={<Save />} size='small' component='label' color='success' onClick={save}>
                            Save
                        </Button>
                    </Grid>
                }

            </Grid>
                

            <Typography fontSize={14}>{data_file.name}</Typography>
        </>

    )
}
