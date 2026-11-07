// Goi cac API cua Forum service (services/forum)
import { FORUM_URL } from "./config";
import type { AuthFetch } from "./http";

export type PostFilter = "all" | "experts" | "following";

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  isExpert: boolean;
  isMine: boolean;
  followingAuthor: boolean;
  content: string;
  createdAt: string;
  likeCount: number;
  likedByMe: boolean;
}

export interface LikeResult {
  likeCount: number;
  likedByMe: boolean;
}

export const forumApi = (authFetch: AuthFetch) => ({
  list: (filter: PostFilter) => authFetch<Post[]>(`${FORUM_URL}/api/forum/posts?filter=${filter}`),

  create: (content: string) =>
    authFetch<Post>(`${FORUM_URL}/api/forum/posts`, { method: "POST", body: JSON.stringify({ content }) }),

  remove: (postId: string) => authFetch<void>(`${FORUM_URL}/api/forum/posts/${postId}`, { method: "DELETE" }),

  like: (postId: string) => authFetch<LikeResult>(`${FORUM_URL}/api/forum/posts/${postId}/like`, { method: "POST" }),

  unlike: (postId: string) =>
    authFetch<LikeResult>(`${FORUM_URL}/api/forum/posts/${postId}/like`, { method: "DELETE" }),

  follow: (authorId: string) => authFetch<void>(`${FORUM_URL}/api/forum/follows/${authorId}`, { method: "POST" }),

  unfollow: (authorId: string) =>
    authFetch<void>(`${FORUM_URL}/api/forum/follows/${authorId}`, { method: "DELETE" }),
});
