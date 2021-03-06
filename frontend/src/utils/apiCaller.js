import tokenHandler from "./tokenHandler"

const apiCaller = (()=>
{
    let headers = tokenHandler.headers
    let apiURL = 'http://127.0.0.1:8000/todos/api/v1/'

    const postCall = (prefix, type, body)=>
    {
        type = type.toLowerCase()
        return fetch(`${apiURL}${prefix}${type}`, {
            method:"POST",
            headers: headers,
            body: JSON.stringify(body)
        })
        .then((response)=>response.json())
        .then((data)=>{
            return data 
        })
    }

    const getCall =  (prefix, type, id)=>{
        return fetch(`${apiURL}${prefix}${type}${id?`/${id}`:""}`,{
            method:"GET",
            headers: headers,
        })
        .then((response)=>response.json())
        .then((data)=>{
            return data
        })
    }

    const deleteCall = (prefix, type, taskID)=>{
        return fetch(`${apiURL}${prefix}${type}/${taskID}`,{
            method:"DELETE",
            headers: headers,
        })
        .then((response)=>response.json())
        .then((data)=>{
            return data
        })
    }

    const putCall = (prefix, type, body, id)=>{
        return fetch(`${apiURL}${prefix}${type}/${id}`,{
            method:"PUT",
            headers: headers,
            body: JSON.stringify(body)
        })
        .then((response)=>response.json())
        .then((data)=>{
            return data
        })
    }
    
    return {postCall, getCall, deleteCall, putCall}
})()

export default apiCaller
