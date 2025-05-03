import express, { Request, Response } from 'express';
import { AnalyticsService } from '../routes/Service';

export function createServer(analyticsService: AnalyticsService) {
    const app = express();

    // API Endpoints
    app.get('/users', async (req: Request, res: Response) => {
        if (analyticsService.getCacheAge() > 60) {
            await analyticsService.updateCache();
        }
        res.json(analyticsService.getTopUsers());
    });

    app.get('/posts', async (req: Request, res: Response) => {
        if (analyticsService.getCacheAge() > 60) {
            await analyticsService.updateCache();
        }

        const type = req.query.type as string;
        if (type === 'popular') {
            res.json(analyticsService.getTopPosts());
        } else if (type === 'latest') {
            res.json(analyticsService.getLatestPosts());
        } else {
            res.status(400).json({ error: 'Invalid type parameter. Use "popular" or "latest"' });
        }
    });

    return app;
}