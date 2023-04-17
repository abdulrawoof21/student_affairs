type fn = (arr: Array<any>, key: string, sortBy?: string) => {[k: number | string]: Array<any>}

export const group_by: fn = (arr, key, sortBy) => {
    const unique_keys = new Set()
    const grouped: {[k: string | number]: Array<any>} = {}

    for(let i = 0; i < arr.length; i++) {
        if(!unique_keys.has(arr[i][key])){
            unique_keys.add(arr[i][key])
        }
        grouped[arr[i][key]] = grouped[arr[i][key]]?.length ? [...grouped[arr[i][key]], arr[i]] : [arr[i]] 
    }

    if(sortBy){
        for(let key of Object.keys(grouped)){
            grouped[key] = grouped[key].sort((a, b) => a[sortBy] - b[sortBy])
        }
    }

    return grouped
}
