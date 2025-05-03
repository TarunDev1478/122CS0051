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
        this.axiosInstance = axios_1.default.create({
            baseURL: BASE_URL
        });
    }
    async authenticate() {
        try {
            const response = await axios_1.default.post(`${BASE_URL}/auth`, this.authCredentials);
            this.authToken = response.data.access_token;
            // Update axios instance with the auth token
            this.axiosInstance = axios_1.default.create({
                baseURL: BASE_URL,
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
        }
        catch (error) {
            console.error('Authentication failed:', error);
            throw new Error('Failed to authenticate with the API');
        }
    }
    async fetchWithAuth(url) {
        if (!this.authToken) {
            await this.authenticate();
        }
        try {
            const response = await this.axiosInstance.get(url);
            return response.data;
        }
        catch (error) {
            if (axios_1.default.isAxiosError(error) && error.response?.status === 401) {
                // Token might be expired, try to re-authenticate
                await this.authenticate();
                const retryResponse = await this.axiosInstance.get(url);
                return retryResponse.data;
            }
            console.error(`Error fetching ${url}:`, error);
            throw error;
        }
    }
    async fetchUsers() {
        const response = await this.fetchWithAuth('/users');
        return Object.entries(response.users).map(([id, name]) => ({
            id: parseInt(id),
            name
        }));
    }
    async fetchPosts(userId) {
        const response = await this.fetchWithAuth(`/users/${userId}/posts`);
        return response.posts.map(post => ({
            ...post,
            userId // Ensure userId is set correctly
        }));
    }
    async fetchComments(postId) {
        const response = await this.fetchWithAuth(`/posts/${postId}/comments`);
        return response.comments.map(comment => ({
            ...comment,
            postId // Ensure postId is set correctly
        }));
    }
    async updateCache() {
        try {
            // First ensure we're authenticated
            await this.authenticate();
            // Clear previous data
            this.cache.users.clear();
            this.cache.posts.clear();
            this.cache.comments.clear();
            this.cache.userCommentCounts.clear();
            this.cache.postCommentCounts.clear();
            // Fetch all users
            const users = await this.fetchUsers();
            users.forEach(user => this.cache.users.set(user.id, user));
            // Fetch posts for each user
            const userPostsPromises = users.map(user => this.fetchPosts(user.id));
            const allPosts = (await Promise.all(userPostsPromises)).flat();
            allPosts.forEach(post => this.cache.posts.set(post.id, post));
            // Fetch comments for each post
            const postCommentsPromises = allPosts.map(post => this.fetchComments(post.id));
            const allComments = (await Promise.all(postCommentsPromises)).flat();
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