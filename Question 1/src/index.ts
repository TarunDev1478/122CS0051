import { AnalyticsService } from './routes/Service';
import {createServer}  from './Server/index';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const PORT = 3001;

// Initialize services
const analyticsService = new AnalyticsService();
const app = createServer(analyticsService);

// Background cache updater
const CACHE_UPDATE_INTERVAL = 60 * 1000; // 1 minute
setInterval(() => analyticsService.updateCache(), CACHE_UPDATE_INTERVAL);
analyticsService.updateCache().catch(console.error); // Initial cache load

// Start server
app.listen(PORT, () => {
    console.log(`Analytics microservice running on port ${PORT}`);
});