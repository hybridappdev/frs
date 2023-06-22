import './App.scss';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  // Navigate,
} from 'react-router-dom';
import NotFound from './components/NotFound/NotFound';
import Navbar from './components/Navbar/Navbar';
import { useMediaQuery } from 'react-responsive';
import CameraPage from './pages/CameraPage/CameraPage';
// import GalleryPage from './pages/GalleryPage/GalleryPage';

function App() {
  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 1224px)' });
  return (
    <Router>
      <div
        className={`App ${isTabletOrMobile ? 'mobile-view' : 'desktop-view'}`}
      >
        <Navbar />
        <div className="main">
          <Routes>
            {/* <Route path="/" element={<Navigate to="/camera" replace />}></Route> */}
            <Route path="/" element={<CameraPage />}></Route>
            {/* <Route path="/gallery" element={<GalleryPage />}></Route> */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
