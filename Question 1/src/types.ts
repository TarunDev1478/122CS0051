export interface AuthResponse {
    token_type: string;
    access_token: string;
    expires_in: number;
}

export interface User {
    id: number;
    name: string;
}

export interface Post {
    id: number;
    userId: number;
    content: string;
}

export interface Comment {
    id: number;
    postId: number;
    content: string;
}

export interface UsersResponse {
    users: Record<string, string>;
}

export interface PostsResponse {
    posts: Post[];
}

export interface CommentsResponse {
    comments: Comment[];
}

export interface AnalyticsCache {
    users: Map<number, User>;
    posts: Map<number, Post>;
    comments: Map<number, Comment[]>;
    userCommentCounts: Map<number, number>;
    postCommentCounts: Map<number, number>;
    lastUpdated: Date;
}

export interface AuthCredentials {
    email: string;
    name: string;
    rollNo: string;
    accessCode: string;
    clientID: string;
    clientSecret: string;
}