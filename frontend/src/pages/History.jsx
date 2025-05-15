import { AgGridReact } from 'ag-grid-react';
import { useEffect, useState, useRef } from 'react';
import { themeMaterial } from 'ag-grid-community';

import LoadingOverlay from '../components/LoadingOverlay'
import Api from '../api/Api';


export default function Import() {
    const gridRef = useRef();

    const [rowData, setRowData] = useState([]);

    const [loading, setLoading] = useState(true);

    const colDefs = [
        {   field: 'Date', 
            rowGroup: true, 
            pinned: 'left', 
            filter: true, 
            flex: 1,
            cellStyle: { borderRight: '2px solid #ccc' }
        },
        {   field: 'From',
            flex: 1,
            cellStyle: { borderRight: '2px solid #ccc' }
        },
        { 
            field: 'To', 
            flex: 1,
            cellStyle: { borderRight: '2px solid #ccc' }
        },
        { 
            field: 'Body',
            flex: 2,
            cellStyle: { borderRight: '2px solid #ccc' }
        },
        {   
            field: 'Status', 
            filter: true , 
            flex: 1,
            cellStyle: { borderRight: '2px solid #ccc' }
        }
    ];

    const autoGroupColumnDef = {
        headerName: 'Date',
        field: 'date',
        cellRendererParams: {
          suppressCount: false
        }
    };

    useEffect(() => {
        const fetchHistories = async () => {
            const data = await Api.fetchHistories();
            setRowData(data.sentMessages);
            setLoading(false)
        }
        fetchHistories()
    }, []);

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
            <AgGridReact
                ref={gridRef}
                theme={aggridTheme}
                rowData={rowData}
                columnDefs={colDefs}
                autoGroupColumnDef={autoGroupColumnDef}
                groupDefaultExpanded={-1}
                pagination={true}
                paginationPageSize={20}
                animateRows={true}
            />
        </div>
    );    
}