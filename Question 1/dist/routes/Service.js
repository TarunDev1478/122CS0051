"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const axios_1 = __importDefault(require("axios"));
const BASE_URL = 'http://20.244.56.144/evaluation-service';
class AnalyticsService {
    constructor() {
        this.authToken = null;
        this.authCredentials = {
            email: "122cs0051@iiitk.ac.in",
            name: "tarun kumar",
            rollNo: "122cs0051",
            accessCode: "bzbCnz",
            clientID: "09905b65-97d0-4df4-abac-12a97977c226",
            clientSecret: "VqPJTbpVCCtDrMNN"
        };
        this.cache = {
            users: new Map(),
            posts: new Map(),
            comments: new Map(),
            userCommentCounts: new Map(),
            postCommentCounts: new Map(),
            lastUpdated: new Date(0)
        };
        // Configure axios instance to match Postman
        this.axiosInstance = axios_1.default.create({
            baseURL: BASE_URL,
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
    }
    async authenticate() {
        try {
            // Best practice is to let Axios handle the Content-Length
            // Manual setting can cause issues and is usually unnecessary
            const response = await this.axiosInstance.post('/auth', this.authCredentials);
            // Check if response and data exist before attempting to access properties
            if (response && response.data && response.data.access_token) {
                this.authToken = response.data.access_token;
                console.log(this.authToken);
                // Set the token for future requests
                this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${this.authToken}`;
                // Log truncated token for debugging (avoid logging full tokens in production)
                console.log('Auth successful. Token:', this.authToken?.slice(0, 10) + '...');
            }
            else {
                throw new Error('Invalid authentication response structure');
            }
        }
        catch (error) {
            // More detailed error handling
            if (axios_1.default.isAxiosError(error)) {
                console.error('Auth failed:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data
                });
            }
            else {
                console.error('Auth failed with non-Axios error:', error);
            }
            throw error;
        }
    }
    async makeRequest(method, url, data) {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const response = await this.axiosInstance.request({
                method,
                url,
                data,
                ...config
            });
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error)) {
                console.error(`Request to ${url} failed:`, {
                    status: error.response?.status,
                    data: error.response?.data,
                    headers: error.response?.headers
                });
            }
            throw error;
        }
    }
    async updateCache() {
        try {
            // First authenticate
            await this.authenticate();
            // Clear old data
            this.cache = {
                users: new Map(),
                posts: new Map(),
                comments: new Map(),
                userCommentCounts: new Map(),
                postCommentCounts: new Map(),
                lastUpdated: new Date()
            };
            // Fetch users (match Postman exactly)
            const usersResponse = await this.makeRequest('get', '/users');
            const users = Object.entries(usersResponse.users).map(([id, name]) => ({
                id: parseInt(id),
                name
            }));
            // Fetch posts for each user
            const postsPromises = users.map(user => this.makeRequest('get', `/users/${user.id}/posts`));
            const allPosts = (await Promise.all(postsPromises))
                .flatMap(response => response.posts);
            // Fetch comments for each post
            const commentsPromises = allPosts.map(post => this.makeRequest('get', `/posts/${post.id}/comments`));
            const allComments = (await Promise.all(commentsPromises))
                .flatMap(response => response.comments);
            // Group comments by post
            const commentsByPost = new Map();
            allComments.forEach(comment => {
                if (!commentsByPost.has(comment.postId)) {
                    commentsByPost.set(comment.postId, []);
                }
                commentsByPost.get(comment.postId)?.push(comment);
            });
            // Update comments cache and count post comments
            commentsByPost.forEach((comments, postId) => {
                this.cache.comments.set(postId, comments);
                this.cache.postCommentCounts.set(postId, comments.length);
            });
            // Calculate user comment counts
            this.cache.posts.forEach(post => {
                const commentCount = this.cache.postCommentCounts.get(post.id) || 0;
                const currentUserCount = this.cache.userCommentCounts.get(post.userId) || 0;
                this.cache.userCommentCounts.set(post.userId, currentUserCount + commentCount);
            });
            this.cache.lastUpdated = new Date();
        }
        catch (error) {
            console.error('Error updating cache:', error);
            throw error;
        }
    }
    getTopUsers() {
        return Array.from(this.cache.users.values())
            .map(user => ({
            ...user,
            commentCount: this.cache.userCommentCounts.get(user.id) || 0
        }))
            .sort((a, b) => b.commentCount - a.commentCount)
            .slice(0, 5);
    }
    getTopPosts() {
        if (this.cache.postCommentCounts.size === 0)
            return [];
        const maxComments = Math.max(...this.cache.postCommentCounts.values());
        return Array.from(this.cache.posts.values())
            .filter(post => (this.cache.postCommentCounts.get(post.id) || 0) === maxComments);
    }
    getLatestPosts() {
        return Array.from(this.cache.posts.values())
            .sort((a, b) => b.id - a.id) // Assuming higher ID means newer post
            .slice(0, 5);
    }
    getCacheAge() {
        return (new Date().getTime() - this.cache.lastUpdated.getTime()) / 1000;
    }
}
exports.AnalyticsService = AnalyticsService;
//# sourceMappingURL=Service.js.map