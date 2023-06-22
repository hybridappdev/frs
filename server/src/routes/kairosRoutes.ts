import { AxiosResponse } from 'axios';
import express, { Request, Response } from 'express';
import KairosClient from '../KairosClient';
import 'dotenv/config';

const router = express.Router();
const GALLERY_NAME = process.env.KAIROS_GALLERY_NAME;
const LIVENESS_THRESHOLD = 0.1;
const CONFIDENCE_THRESHOLD = 0.6;
const loggingEnabled = true;

router.post('/login', async (req: Request, res: Response) => {
    try {
        const recognizeUser = {
            "image": req.body.image,
            "gallery_name": GALLERY_NAME,
            "selector": "liveness"
        }
        const kairosRes: AxiosResponse = await KairosClient.post('/recognize', recognizeUser);
        const data = kairosRes.data;
        if (loggingEnabled)
            console.log(JSON.stringify(data, null, " "));
        if (data && data.images) {
            const detectedFaces = data.images;
            if (detectedFaces.length === 0) {
                res.sendStatus(401);
            } else if (detectedFaces.length === 1) {
                if (detectedFaces[0].transaction.status === 'success' && detectedFaces[0].transaction.confidence > CONFIDENCE_THRESHOLD) {
                    if (detectedFaces[0].transaction.liveness > LIVENESS_THRESHOLD) {
                        res.status(200).json({
                            face_id: detectedFaces[0].transaction.face_id,
                            subject_id: detectedFaces[0].transaction.subject_id,
                            confidence: detectedFaces[0].transaction.confidence,
                            liveness: detectedFaces[0].transaction.liveness,
                            // fullData: detectedFaces[0].transaction
                        });
                    } else {
                        res.status(400).json({ error: 'Detected spoof-attack due to liveness selector' });
                    }
                } else {
                    res.sendStatus(401);
                }
            } else {
                const liveFaces = detectedFaces.filter((x: any) => {
                    return x.transaction.liveness > LIVENESS_THRESHOLD
                });
                if (liveFaces.length === 1) {
                    res.status(200).json({
                        face_id: liveFaces[0].transaction.face_id,
                        subject_id: liveFaces[0].transaction.subject_id,
                        confidence: liveFaces[0].transaction.confidence,
                        liveness: liveFaces[0].transaction.liveness
                    });
                } else {
                    res.status(300).json(detectedFaces);
                    // res.status(401).json({ error: 'Detected spoof-attack due to liveness selector' });
                }
            }
        } else {
            res.status(404).json(data);
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/register', async (req: Request, res: Response) => {
    try {
        const enrollUser = {
            "image": req.body.image,
            "subject_id": req.body.name,
            "gallery_name": GALLERY_NAME
        }
        const kairosRes: AxiosResponse = await KairosClient.post('/enroll', enrollUser);
        const data = kairosRes.data;
        if (data && data.images) {
            const detectedFaces = data.images;
            if (detectedFaces.length === 0) {
                res.sendStatus(404);
            } else if (detectedFaces.length === 1) {
                if (detectedFaces[0].transaction.status === 'success') {
                    res.status(200).json({
                        face_id: detectedFaces[0].transaction.face_id,
                        subject_id: detectedFaces[0].transaction.subject_id
                    });
                } else {
                    res.sendStatus(404);
                }
            } else {
                res.status(300).json(detectedFaces);
            }
        }
    } catch (error) {
        res.status(500).json(error);
    }
});

router.post('/view-gallery', async (req: Request, res: Response) => {
    try {
        const kairosRes: AxiosResponse = await KairosClient.post('/gallery/view', {
            gallery_name: GALLERY_NAME
        });
        const data = kairosRes.data;
        if (loggingEnabled)
            console.log(JSON.stringify(data, null, " "));
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
});



export default router;