import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState, useRef } from 'react';
import { CSVLink } from 'react-csv';
import { themeMaterial } from 'ag-grid-community';
import {
    Button,
    Typography,
    Dialog, 
    DialogTitle, 
    Stack
  } from '@mui/material';

  
import Api from '../api/Api';

import LoadingOverlay from '../components/LoadingOverlay'

export default function Import() {
    const gridRef = useRef();

    const csvLinkRef = useRef();

    const [rowData, setRowData] = useState([]);

    const [showInput, setShowInput] = useState(false);

    const [file, setFile] = useState(null);

    const [loading, setLoading] = useState(true);

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
        fetchData()
    }, []);

    const handleInputChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
    };

    const fetchData = async () => {
        setLoading(true)
        const data = await Api.fetchData();
        setRowData(data.items);
        setLoading(false)
    }

    const handleImportCSV = async () => {
        if (!file) return alert('No file selected');

        setLoading(true)
        const formData = new FormData();
        formData.append('file', file);

        try {
            await Api.uploadFile(formData);
            setFile(null)
            setShowInput(false);
            await fetchData();
        } catch (err) {
            alert('Upload failed', err);
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
            <div className="flex mb-4">
                <div className="mr-4" >
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#746bca',
                            '&:hover': {
                                backgroundColor: '#272168',
                            },
                        }}
                        className="ml-4 bg-blue-600 text-white rounded"
                        onClick={() => setShowInput(true)}>
                        Import CSV
                    </Button>
                </div>
                <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#746bca',
                        '&:hover': {
                            backgroundColor: '#272168',
                        },
                    }}
                    onClick={() => csvLinkRef.current.link.click()}
                    className="bg-blue-600 text-white rounded"
                >
                    Export CSV
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
            <Dialog open={showInput} onClose={() => setShowInput(false)}>
                <DialogTitle>Import CSV</DialogTitle>
                <div>
                    <div style={popupStyles.popup}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <Button variant="contained" component="label">
                                Upload File
                                <input type="file" hidden accept=".csv" onChange={handleInputChange}/>
                            </Button>
                            <Typography variant="body2" noWrap>
                                {file ? file.name : 'No file chosen'}
                            </Typography>
                        </Stack>

                        <div style={{ marginTop: '3rem' }}>
                            <Button  variant="contained" component="label" onClick={() => handleImportCSV(false)}>Submit</Button>
                            <Button  component="label" onClick={() => setShowInput(false)} style={{ marginLeft: '1rem' }}>
                                Cancel
                            </Button>
                            </div>
                        </div>
                </div>
            </Dialog>

            <CSVLink
                data={rowData}
                headers={[
                    { label: "Name", key: "Name" },
                    { label: "PhoneNumber", key: "PhoneNumber" },
                    { label: "Location", key: "Location" }
                ]}
                filename="Clients.csv"
                className="hidden"
                ref={csvLinkRef}
                target="_blank"
            />
        </div>
    );
  }

  const popupStyles = {
    overlay: {
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    popup: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        minWidth: '300px',
    },
};