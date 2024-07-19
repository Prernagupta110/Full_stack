import axios from 'axios'
const baseurl = 'http://localhost:3001/persons'

const send = (send) => {
    return axios.post(baseurl, send)
}

const update = (new_p, u_ID) => {
    return axios.put(`${baseurl}/${u_ID}`, new_p)
}

const delete_p = (ID) => {
    return axios.delete(`${baseurl}/${ID}`)
}

export default{send, delete_p, update}