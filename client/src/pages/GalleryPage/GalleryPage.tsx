import { useEffect } from 'react';
import frsService from '../../services/frs.service';

function GalleryPage() {
  useEffect(() => {
    frsService.viewGallery().then(
      (res) => {
        console.log(res);
      },
      (err) => {
        console.error(err);
      }
    );
  }, []);
  return <div className="page_container settings_page">Gallery</div>;
}

export default GalleryPage;
