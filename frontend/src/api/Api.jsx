const host = import.meta.env.VITE_HOST

const fetchData = async () => {
    try {
        const res = await fetch(`${host}/fetch-data`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        const json = await res.json();
        
        return json
    } catch (err) {
        console.error('Upload failed:', err);
    }
};

const uploadFile = async (rows) => {
    try {
        const res = await fetch(`${host}/upload-file`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: rows }),   // rows = array of objects
        });
        const json = await res.json();

        return json
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