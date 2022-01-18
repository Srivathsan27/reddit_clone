import { Post } from "../entities/Post";
import { MyContext } from "../types/MyContext";
declare class PostError {
    field: string;
    message: string;
}
declare class PostsResponse {
    posts?: Post[];
    numberOfPosts?: number;
    errors?: PostError;
}
declare class PostResponse {
    post?: Post;
    errors?: PostError;
}
declare class PostInput {
    title: string;
    content: string;
}
export declare class PostResolver {
    posts({ em }: MyContext): Promise<PostsResponse>;
    post({ em }: MyContext, id: number): Promise<PostResponse>;
    newPost({ em }: MyContext, input: PostInput): Promise<PostResponse>;
    updatePost({ em }: MyContext, id: number, input: PostInput): Promise<PostResponse>;
    delete({ em }: MyContext, id: number): Promise<PostResponse>;
}
export {};
