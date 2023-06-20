import './Face.scss';
import Webcam from 'react-webcam';
import Button from '@mui/material/Button';
import { useRef, useCallback, useState, useEffect, forwardRef } from 'react';
import {
  Backdrop,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { FilterCenterFocus, Videocam, VideocamOff } from '@material-ui/icons';
import { v4 as uuidv4 } from 'uuid';
import { TransitionProps } from '@mui/material/transitions';
import { AxiosError } from 'axios';
import Slide from '@mui/material/Slide';
import useSnackbar from '../../hooks/useSnackbar';
import frsService from '../../services/frs.service';
import {
  PersonAddAlt1Outlined,
  RestartAltRounded,
  SensorOccupiedOutlined,
} from '@mui/icons-material';

export interface FaceObj {
  id: string;
  image: string;
  createdAt: string;
  type: string;
}

export interface AuthUser {
  confidence: string;
  face_id: string;
  liveness: number;
  subject_id: string;
}

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Face() {
  const webcamRef = useRef<Webcam>(null);

  const [capturedImage, setCapturedImage] = useState<FaceObj | null>(null);
  const [isCameraOn, setCameraOn] = useState(false);
  const [isCameraloading, setCameraLoading] = useState(false);
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [loader, setLoader] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [subjectId, setSubjectId] = useState('');
  const [allowRegistration, setAllowRegistration] = useState(false);
  const [browser, setBrowser] = useState('');

  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const handleStartWebcam = async () => {
    if (browser === 'Google Chrome') {
      const permissionName = 'camera' as PermissionName;
      const permission = await navigator.permissions.query({
        name: permissionName,
      });
      if (permission.state === 'prompt' || permission.state === 'granted') {
        startCam();
      } else {
        showSnackbar('Camera access is blocked', 'error');
      }
    } else {
      startCam();
    }
  };

  const startCam = () => {
    setTimeout(() => {
      if (capturedImage) setCapturedImage(null);
      setCameraLoading(true);
      setCameraOn(true);
    }, 100);
  };

  const handleStopWebcam = () => {
    setTimeout(() => {
      setCameraLoading(false);
      setCameraOn(false);
    }, 100);
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const pictureSrc = webcamRef.current.getScreenshot();
      if (pictureSrc) {
        const id = uuidv4();
        const faceObj: FaceObj = {
          id,
          createdAt: new Date().toISOString(),
          image: pictureSrc,
          type: 'FACE',
        };
        setCapturedImage(faceObj);
        handleStopWebcam();
      } else {
        console.error('pictureSrc is null');
      }
    }
  }, [webcamRef]);

  const retake = () => {
    setTimeout(() => {
      setCapturedImage(null);
      setCameraLoading(true);
      setCameraOn(true);
    }, 100);
  };

  const registerUser = async () => {
    const name = subjectId.trim();
    if (name && capturedImage) {
      try {
        const res = await frsService.register(name, capturedImage?.image);
        if (res.status === 200) {
          setShowDialog(false);
          showSnackbar('Face registered successfully', 'success');
        }
      } catch (error) {
        const err = error as AxiosError;
        console.log(err);
      }
    }
  };

  const loginUser = async () => {
    setAuthUser(null);
    setLoader(true);
    if (capturedImage) {
      try {
        const res = await frsService.login(capturedImage.image);
        console.log(res);
        setAuthUser(res.data);
        setShowAuthDialog(true);
        setLoader(false);
      } catch (error) {
        const err = error as AxiosError;
        switch (err.response?.status) {
          case 300:
            setAllowRegistration(false);
            showSnackbar('Detected multiple faces', 'warning');
            break;
          case 400:
            setAllowRegistration(false);
            showSnackbar(
              'Detected spoof-attack with liveness selector',
              'warning'
            );
            break;
          case 401:
            setAllowRegistration(true);
            showSnackbar('Face not recognized', 'error');
            break;
          default:
            showSnackbar(err.message, 'error');
        }
        setLoader(false);
      }
    } else {
      console.error('capturedImage was not found');
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  const handleAuthDialogClose = () => {
    setShowAuthDialog(false);
  };

  useEffect(() => {
    const detectBrowser = () => {
      const userAgent = navigator.userAgent;
      // Check if the userAgent contains specific browser keywords
      if (userAgent.indexOf('Chrome') > -1) {
        setBrowser('Google Chrome');
      } else if (userAgent.indexOf('Firefox') > -1) {
        setBrowser('Mozilla Firefox');
      } else if (userAgent.indexOf('Safari') > -1) {
        setBrowser('Apple Safari');
      } else if (
        userAgent.indexOf('Opera') > -1 ||
        userAgent.indexOf('OPR') > -1
      ) {
        setBrowser('Opera');
      } else if (
        userAgent.indexOf('Edge') > -1 ||
        userAgent.indexOf('Edg') > -1
      ) {
        setBrowser('Microsoft Edge');
      } else if (userAgent.indexOf('Trident') > -1) {
        setBrowser('Internet Explorer');
      } else {
        setBrowser('Unknown');
      }
    };

    detectBrowser();
  }, []);

  return (
    <>
      <div className="face_cover">
        <div className="camera_area">
          {isCameraloading && (
            <div className="camera_loader">
              <CircularProgress
                className="camera_loader"
                color="primary"
                variant="indeterminate"
                size={100}
                thickness={1}
                value={100}
              />
            </div>
          )}
          {!capturedImage && isCameraOn && (
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              onLoadStart={() => {
                setCameraLoading(true);
              }}
              onLoadedData={() => {
                setCameraLoading(false);
              }}
            />
          )}

          {capturedImage && (
            <>
              <img src={capturedImage.image} alt="img" />
            </>
          )}

          {!isCameraOn && (
            <div className="no_camera">
              <>
                <VideocamOff style={{ fontSize: 70 }}></VideocamOff>
                <h1> Camera is off</h1>
                <h4>Click on Start Camera to being</h4>
              </>
            </div>
          )}
        </div>

        <div className="face_buttons">
          <div className="camera_options">
            <Button
              startIcon={<Videocam />}
              color="error"
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                handleStartWebcam();
              }}
              disabled={isCameraOn}
            >
              Start Camera
            </Button>

            <Button
              startIcon={<VideocamOff />}
              color="error"
              variant="outlined"
              onClick={(e) => {
                e.preventDefault();
                handleStopWebcam();
              }}
              disabled={!isCameraOn}
            >
              Stop Camera
            </Button>
          </div>

          <div>
            <Button
              startIcon={<FilterCenterFocus></FilterCenterFocus>}
              color="success"
              variant="contained"
              onClick={(e) => {
                e.preventDefault();
                capture();
              }}
              disabled={!isCameraOn || isCameraloading}
            >
              Capture
            </Button>

            <Button
              startIcon={<RestartAltRounded></RestartAltRounded>}
              color="success"
              variant="outlined"
              onClick={(e) => {
                console.log(e);
                e.preventDefault();
                retake();
              }}
              disabled={!capturedImage}
            >
              Retake
            </Button>
          </div>

          <div className="user_options">
            <Button
              startIcon={<SensorOccupiedOutlined></SensorOccupiedOutlined>}
              variant="contained"
              onClick={(e) => {
                console.log(e);
                e.preventDefault();
                loginUser();
              }}
              disabled={!capturedImage}
            >
              Login
            </Button>

            <Button
              startIcon={<PersonAddAlt1Outlined></PersonAddAlt1Outlined>}
              variant="outlined"
              color="inherit"
              onClick={(e) => {
                console.log(e);
                e.preventDefault();
                setShowDialog(true);
              }}
              disabled={!capturedImage || !allowRegistration}
            >
              Register
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        className="modal_dialog"
        open={showAuthDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleAuthDialogClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'Face has been recognized successfully!'}</DialogTitle>
        <DialogContent>
          <div>
            <div className="kv_row">
              <span className="label">Face ID: </span>
              <span className="value">{authUser?.face_id}</span>
            </div>
            <div className="kv_row">
              <span className="label">Subject ID: </span>
              <span className="value">{authUser?.subject_id}</span>
            </div>
            <div className="kv_row">
              <span className="label">Liveness: </span>
              <span className="value">{authUser?.liveness}</span>
            </div>
            <div className="kv_row">
              <span className="label">Confidence: </span>
              <span className="value">{authUser?.confidence}</span>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAuthDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        className="modal_dialog"
        open={showDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleDialogClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{'Face Registration'}</DialogTitle>
        <DialogContent>
          <div className="user_name">
            <TextField
              id="outlined-basic"
              label="Name"
              variant="outlined"
              required
              onChange={(e) => setSubjectId(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => registerUser()}>
            Register
          </Button>
          <Button onClick={() => setShowDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loader}
      >
        <CircularProgress color="primary" />
      </Backdrop>

      <SnackbarComponent />
    </>
  );
}

export default Face;
