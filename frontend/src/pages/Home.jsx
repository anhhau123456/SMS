import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState, useRef } from 'react';
import { themeMaterial } from 'ag-grid-community';
import {
    AppBar,
    Toolbar,
    Button,
    TextField,
    Typography,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
  } from '@mui/material';


import Api from '../api/Api';

import InputPopup from '../components/InputPopup'

export default function MyGrid() {
    const gridRef = useRef();

    const [rowData, setRowData] = useState([]);

    const [message, setMessage] = useState('');

    const colDefs = [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            pinned: 'left',
            field: 'Name',
            headerName: 'Name',
        },
        { field: "PhoneNumber" },
        { field: "Location" }
    ]

    useEffect(() => {
        const fetchData = async () => {
            const data = await Api.fetchData();
            setRowData(data.items);
        }
        fetchData()
    }, []);

    
    const handleSendSMS = async () => {
        const selectedRows = gridRef.current.api.getSelectedRows();

        if (message == '' || selectedRows.length == 0) {
            // Show Error
            console.log('error')
        } else {
            try {
                const sendSMS = async () => {
                    await Api.sendSMS({
                        message: message,
                        data: selectedRows
                    });
                }

                sendSMS()
            } catch (err) {
                console.log('err', err)
            }
        }
    };

    const aggridTheme = themeMaterial
        .withParams({
            backgroundColor: "#F7EFEF",
            borderColor: "#0E101026",
            browserColorScheme: "inherit",
            headerBackgroundColor: "#413636",
            headerFontSize: 16,
            headerFontWeight: 700,
            headerTextColor: "#F9FDFF"
        });

    return (
        <div className="ag-theme-alpine h-[calc(100vh-10rem)] " style={{ width: '100%' }}>
            <div className="flex items-center mb-4">
                <div className="flex items-center mb-4 mr-4">
                    <TextField
                        multiline
                        minRows={1}
                        maxRows={10}
                        label="Message"
                        variant="outlined"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        fullWidth
                    />
                </div>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#746bca',
                        '&:hover': {
                            backgroundColor: '#272168',
                        },
                    }}
                    className="ml-auto px-4 py-2 bg-blue-600 text-white rounded"
                    onClick={() => handleSendSMS()}>
                    Send
                </Button>
            </div>
            <AgGridReact
                ref={gridRef}
                theme={aggridTheme}
                rowData={rowData}
                columnDefs={colDefs}
                pagination={true}
                paginationPageSize={20}
                rowSelection={"multiple"}
            />
        </div>
    );
  }