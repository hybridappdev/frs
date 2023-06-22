import { useState } from 'react';
import { Snackbar, Alert, AlertColor } from '@mui/material';

const useSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('success');

  type Severity = 'error' | 'success' | 'info' | 'warning' | undefined;

  const handleClose = () => {
    setOpen(false);
  };

  const showSnackbar = (message: string, severity: Severity) => {
    setMessage(message);
    setSeverity(severity || 'info');
    setOpen(true);
  };

  const SnackbarComponent = () => (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert onClose={handleClose} severity={severity}>
        {message}
      </Alert>
    </Snackbar>
  );

  return { showSnackbar, SnackbarComponent };
};

export default useSnackbar;
