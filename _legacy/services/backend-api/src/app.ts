/**
 * LINGUAACCESS EXPRESS APPLICATION
 * 
 * Separated from server start logic for testability.
 */

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

const app: Express = express();

// ============================================
// MIDDLEWARE
// ============================================

app.use(
    cors({
        origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
);

app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    crossOriginOpenerPolicy: false,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

if (process.env.NODE_ENV === 'development') {
    app.use((req: Request, res: Response, next: NextFunction) => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
        next();
    });
}

// ============================================
// ROUTES
// ============================================

app.get('/health', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'LinguaAccess backend is running',
        timestamp: new Date().toISOString(),
    });
});

import authRoutes from './routes/auth';
import learnerRoutes from './routes/learner';
import parentRoutes from './routes/parent';
import assessmentRoutes from './routes/assessment';
import mlRoutes from './routes/ml';

app.use('/api/auth', authRoutes);
app.use('/api/learner', learnerRoutes);
app.use('/api/parent', parentRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/ml', mlRoutes);

// ============================================
// 404 HANDLER
// ============================================

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        error: {
            message: `Route ${req.method} ${req.path} not found`,
            status: 404,
        },
    });
});

// ============================================
// ERROR HANDLER
// ============================================

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled Error in App:', err);
    res.status(err.status || 500).json({
        success: false,
        error: {
            message: err.message || 'Internal Server Error',
            status: err.status || 500,
            stack: err.stack,
        },
    });
});

export default app;
