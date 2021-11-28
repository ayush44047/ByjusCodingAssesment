import axios from 'axios';

const url='http://localhost:3000/api/employee/';


export async function insertEmployee(data) {
    try{
        return await axios.post(url,data);
    }
    catch(err){
        return null;
    }  
}

export async function updateEmployee(data) {
    try{
        return await axios.patch(url+data.id,data);
    }
    catch(err){
        return null;
    }      
}

export async function deleteEmployee(id) {

    try{
        return await axios.delete(url+id);
    }
    catch(err){
        return null;
    }   
}

export async function getAllEmployees() {

    try{
        return await axios.get(url);
    }
    catch(err){
        return null;
    }
    
}