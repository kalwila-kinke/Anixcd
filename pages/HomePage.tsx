
import React from 'react';
import { Post as PostComponent } from '../components/Post';
import { CreatePost } from '../components/CreatePost';
import { Stories } from '../components/Stories';
import type { Post, User } from '../types';

interface HomePageProps {
    currentUser: User;
    posts: Post[];
    onCreatePost: (content: string, imageUrl: string | null) => void;
    onLike: (postId: string) => void;
    onDelete: (postId: string) => void;
    onSaveEdit: (postId: string, newContent: string) => void;
    onViewProfile: (user: User) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
    currentUser, 
    posts, 
    onCreatePost, 
    onLike, 
    onDelete, 
    onSaveEdit, 
    onViewProfile 
}) => {
    return (
        <div className="divide-y divide-border">
            <Stories />
            <CreatePost currentUser={currentUser} onCreatePost={onCreatePost} />
            <div className="space-y-0.5 bg-border/10">
                {posts.map(post => (
                    <PostComponent 
                        key={post.id} 
                        post={post} 
                        currentUser={currentUser}
                        onSaveEdit={onSaveEdit}
                        onDelete={onDelete}
                        onLike={onLike}
                        onViewProfile={onViewProfile}
                    />
                ))}
            </div>
        </div>
    );
};
