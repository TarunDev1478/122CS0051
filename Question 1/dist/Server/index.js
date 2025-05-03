"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = createServer;
const express_1 = __importDefault(require("express"));
function createServer(analyticsService) {
    const app = (0, express_1.default)();
    // API Endpoints
    app.get('/users', async (req, res) => {
        if (analyticsService.getCacheAge() > 60) {
            await analyticsService.updateCache();
        }
        res.json(analyticsService.getTopUsers());
    });
    app.get('/posts', async (req, res) => {
        if (analyticsService.getCacheAge() > 60) {
            await analyticsService.updateCache();
        }
        const type = req.query.type;
        if (type === 'popular') {
            res.json(analyticsService.getTopPosts());
        }
        else if (type === 'latest') {
            res.json(analyticsService.getLatestPosts());
        }
        else {
            res.status(400).json({ error: 'Invalid type parameter. Use "popular" or "latest"' });
        }
    });
    return app;
}
//# sourceMappingURL=index.js.map