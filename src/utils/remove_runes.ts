export const remove_runes = (str: string) => {
    let s = str.replace(/[\r\n]/g, " ").trim().split(' ')
    for(let i = 0; i < s.length; i++){
        if(s[i] === ''){
            s.splice(i, 1)
            i--
        }
    }
    return s.join(' ').toUpperCase()
}
