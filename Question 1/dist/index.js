"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Service_1 = require("./routes/Service");
const index_1 = require("./Server/index");
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const PORT = 3001;
// Initialize services
const analyticsService = new Service_1.AnalyticsService();
const app = (0, index_1.createServer)(analyticsService);
// Background cache updater
const CACHE_UPDATE_INTERVAL = 60 * 1000; // 1 minute
setInterval(() => analyticsService.updateCache(), CACHE_UPDATE_INTERVAL);
analyticsService.updateCache().catch(console.error); // Initial cache load
// Start server
app.listen(PORT, () => {
    console.log(`Analytics microservice running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map