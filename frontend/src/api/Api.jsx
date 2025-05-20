import axios from 'axios';
const host = import.meta.env.VITE_HOST

const fetchData = async (token) => {
    try {
        const response = await axios.get(`${host}/fetch-data`, {
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            }
        })
        return response.data;
    } catch (err) {
        console.error('Upload failed:', err);
    }
};

const uploadFile = async (data, token) => {
    try {
        const response = await axios.post(`${host}/upload-csv`, data, {
            headers: { 
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`, 
            }
        });

        return response.data;
    } catch (err) {
        console.error('Upload failed:', err);
    }
};

const fetchHistories = async (token) => {
    try {
        const res = await fetch(`${host}/fetch-histories`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            }
        });
        const json = await res.json();
        
        return json
    } catch (err) {
        console.error('Upload failed:', err);
    }
};

const sendSMS = async (data, token) => {
    try {
        const res = await fetch(`${host}/send-sms`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,  
            },
            body: JSON.stringify(data),   // rows = array of objects
        });
        
        const json = await res.json();
        return json
    } catch (err) {
        console.error('Upload failed:', err);
    }
};

export default {
    fetchData,
    uploadFile,
    fetchHistories,
    sendSMS
}