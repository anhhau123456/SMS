import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

const InputPopup = ({
    showPopup,
    setShowPopup,
    handleFileUpload
}) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = () => {
        setShowPopup(false);
        setInputValue('');
        handleFileUpload(inputValue);
    };

    return (
        <div class="center-horizontal">
            <button className="button" onClick={() => setShowPopup(true)}>Open Input Popup</button>
            {showPopup && (
                <div style={popupStyles.overlay}>
                    <div style={popupStyles.popup}>
                        <h3>Enter something:</h3>
                        <input
                            class="input"
                            type="file"
                            accept=".xlsx, .xls"
                            onChange={(e) => setInputValue(e)}
                        />
                        <div style={{ marginTop: '1rem' }}>
                        <button className="button" onClick={handleSubmit}>Submit</button>
                        <button className="button" onClick={() => setShowPopup(false)} style={{ marginLeft: '1rem' }}>
                            Cancel
                        </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

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

export default InputPopup;
