import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState, useRef } from 'react';
import { themeMaterial } from 'ag-grid-community';
import {
    Button,
    TextField,
  } from '@mui/material';
import { useAuth0 } from '@auth0/auth0-react';

import LoadingOverlay from '../components/LoadingOverlay'
import Api from '../api/Api';

export default function Home() {
    const {
        getAccessTokenSilently
    } = useAuth0();

    const gridRef = useRef();

    const [gridApi, setGridApi] = useState(null);

    const [rowData, setRowData] = useState([]);

    const [message, setMessage] = useState('');

    const [loading, setLoading] = useState(true);

    const colDefs = [
        {
            headerCheckboxSelection: true,
            checkboxSelection: true,
            pinned: 'left',
            field: 'Name',
            headerName: 'Name',
            filter: true,
            flex: 1,
            cellStyle: { borderRight: '2px solid #ccc' }
        },
        { field: "PhoneNumber", filter: true , flex: 1, cellStyle: { borderRight: '2px solid #ccc' }},
        { field: "Email", flex: 1, filter: true, cellStyle: { borderRight: '2px solid #ccc' }},
        { field: "Location", flex: 1, filter: true, cellStyle: { borderRight: '2px solid #ccc' }}
    ]

    useEffect(() => {
        const fetchData = async () => {
            const token = await getAccessTokenSilently();
            const data = await Api.fetchData(token);
            setRowData(data.items);
            setLoading(false)
        }
        fetchData()
    }, []);

    const onGridReady = (params) => {
        setGridApi(params.api); // save gridApi to state
    };
    
      const deselectAllRows = () => {
        gridApi?.deselectAll(); // safely call deselectAll
      };
    
    const handleSendSMS = async () => {
        setLoading(true)

        const selectedRows = gridRef.current.api.getSelectedRows();

        if (message == '' || selectedRows.length == 0) {
            // Show Error
            alert("Error: Message is null or no row is selected.");
        } else {
            try {
                const response = await Api.sendSMS({
                    message: message,
                    data: selectedRows
                });

                if (response.success) {
                    // Clean all
                    deselectAllRows();
                    setMessage('')
                    alert('Send message: success');

                } else {
                    if (response.optedOut.length > 0) {
                        const message = response.optedOut.map((item, i) => `${i + 1}. ${item.PhoneNumber}`).join("\n");
                        alert("Opted-out phone numbers:\n" + message);
                    } else {
                        alert('Can not send message');
                    }
                }
            } catch (err) {
                alert('Error:', err);
            }
        }

        setLoading(false)
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
            <LoadingOverlay open={loading} />
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
                paginationPageSize={50}
                rowSelection={"multiple"}
                onGridReady={onGridReady}
            />
        </div>
    );
  }