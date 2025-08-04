import { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import { useNavigate } from "react-router-dom";

const PolicyDialog = ({ open, onClose ,selectedWeb}) => {
    const [selectedPolicy, setSelectedPolicy] = useState("");
    const navigate = useNavigate();

    const handleConfirm = () => {
        if (selectedPolicy && selectedWeb) {
            navigate(`/texteditor?for=${selectedPolicy}&website=${selectedWeb}`); 
            onClose();
        }
    };

    return (
        <Dialog open={open} onClose={onClose} >
            <div style={{ padding: '20px' }}>
                <DialogTitle>Select Policy Type</DialogTitle>
                <DialogContent>
                    <div style={{ padding: '20px 0' }}>
                        <FormControl fullWidth>
                            <InputLabel>Select Policy</InputLabel>
                            <Select
                                value={selectedPolicy}
                                onChange={(e) => setSelectedPolicy(e.target.value)}
                            >
                                <MenuItem value="privacyPolicy">Privacy Policy</MenuItem>
                                <MenuItem value="termsAndConditions">Terms and Conditions</MenuItem>
                                <MenuItem value="refundPolicy">Refund Policy</MenuItem>
                                <MenuItem value="shippingPolicy">Shipping Policy</MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        color="secondary"
                        variant="contained"
                        disabled={!selectedPolicy}
                    >
                        Proceed to Editor
                    </Button>
                </DialogActions>
            </div>

        </Dialog>
    );
};

export default PolicyDialog;
