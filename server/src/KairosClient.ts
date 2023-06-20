import axios from 'axios';
import 'dotenv/config';

const KairosClient = axios.create({
  baseURL: process.env.KAIROS_QUERY_URL,
  timeout: 10000, // Request timeout in milliseconds (10 seconds)
  headers: {
    'Content-Type': 'application/json',
    'app_id': process.env.KAIROS_APP_ID,
    'app_key': process.env.KAIROS_KEY,
    'store_image': 'false' //avoid file storage of face metadata extracted

    // Add any other default headers you need
  },
});

export default KairosClient;
