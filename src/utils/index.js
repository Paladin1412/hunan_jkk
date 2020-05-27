// import Vue from 'vue'
// import uuid from 'uuid'

// import { HOSPITAL_ID, APP_ID } from '@/utils/globalConst'

export function maskCode(str = '') {
    let maskCode = ''
    let num = 0
    let length = str.length
    if (length < 2) {
        return str
    } else if (length === 2) {
        return `*${str.substr(1)}`
    } else if (length < 3) {
        num = 1
    } else if (length < 6) {
        num = 1
    } else if (length < 12) {
        num = 2
    } else {
        num = 4
    }
    maskCode = `${str.substr(0, num)}${str
        .substr(num, length - 2 * num)
        .replace(/./g, '*')}${str.substr(length - num, num)}`

    if (length === 2) {
        maskCode = str[0] + '*'
    }

    return maskCode
}
