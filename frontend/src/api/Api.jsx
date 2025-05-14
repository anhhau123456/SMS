import axios from 'axios';

const host = import.meta.env.VITE_HOST

const fetchData = async () => {
    try {
        const response = await axios.get(`${host}/fetch-data`, {
            headers: { 'Content-Type': 'application/json' }
        })
        return response.data;
    } catch (err) {
        console.error('Upload failed:', err);
    }
};

const uploadFile = async (data) => {
    try {
        const response = await axios.post(`${host}/upload-csv`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        return response.data;
    } catch (err) {
        console.error('Upload failed:', err);
    }
};

const fetchHistories = async () => {
    try {
        const res = await fetch(`${host}/fetch-histories`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const json = await res.json();
        
        return json
    } catch (err) {
        console.error('Upload failed:', err);
    }
};

const sendSMS = async (data) => {
    try {
        const res = await fetch(`${host}/send-sms`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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