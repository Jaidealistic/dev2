import express, { Request, Response } from 'express';
import multer from 'multer';
import axios from 'axios';
import FormData from 'form-data';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000/api/ml';

// All ML routes require authentication
router.use(authMiddleware);

/**
 * POST /api/ml/pronunciation/evaluate
 * Proxies pronunciation evaluation request to the ML service
 */
router.post('/pronunciation/evaluate', upload.single('audio'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No audio file provided' });
        }

        const { expectedText, language } = req.body;
        if (!expectedText) {
            return res.status(400).json({ success: false, message: 'Expected text is required' });
        }

        // Prepare form data for ML service
        const formData = new FormData();
        formData.append('audio', req.file.buffer, {
            filename: req.file.originalname || 'blob',
            contentType: req.file.mimetype,
        });
        formData.append('expected_text', expectedText);
        formData.append('language', language || 'en-US');

        console.log(`📡 Proxying pronunciation request to ML service: ${ML_SERVICE_URL}/pronunciation/evaluate`);

        const response = await axios.post(`${ML_SERVICE_URL}/pronunciation/evaluate`, formData, {
            headers: {
                ...formData.getHeaders(),
            },
            timeout: 30000, // 30 seconds
        });

        return res.json({
            success: true,
            data: response.data,
        });
    } catch (error: any) {
        console.error('❌ ML Service Proxy Error:', error.message);

        if (error.response) {
            return res.status(error.response.status).json({
                success: false,
                message: 'ML Service returned an error',
                error: error.response.data,
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Failed to communicate with ML service',
            error: error.message,
        });
    }
});

export default router;
