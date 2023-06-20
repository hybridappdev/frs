import axios from "axios";

const FrsInstance = axios.create({
    baseURL: import.meta.env.VITE_FRS_SERVER_URL,
});

FrsInstance.interceptors.request.use(async (config) => {
    config.headers.app_secret = import.meta.env.VITE_APP_SECRET;
    return config;
});

class FrsService {

    async login(image: string) {
        return FrsInstance.post('/login', { image });
    }

    async register(name: string, image: string) {
        return FrsInstance.post('/register', { name, image });
    }

    async viewSubject(subject_id: string) {
        return FrsInstance.post('/view-subject', { gallery_name: import.meta.env.VITE_KAIROS_GALLERY_NAME, subject_id });
    }

    async deleteSubject(subject_id: string) {
        return FrsInstance.post('/view-subject', { gallery_name: import.meta.env.VITE_KAIROS_GALLERY_NAME, subject_id });
    }

    async viewGallery() {
        return FrsInstance.post('/view-gallery', { gallery_name: import.meta.env.VITE_KAIROS_GALLERY_NAME });
    }

    async deleteGallery() {
        return FrsInstance.post('/delete-gallery', { gallery_name: import.meta.env.VITE_KAIROS_GALLERY_NAME });
    }

}

export default new FrsService();
