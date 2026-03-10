
import React, { useState } from 'react';
import { searchXelar } from '../services/geminiService';
import type { Post, User } from '../types';
import { Post as PostComponent } from '../components/Post';
import { UserRole } from '../types';
import { useNotification } from '../contexts/NotificationContext';

interface SearchPageProps {
    onViewProfile: (user: User) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ onViewProfile }) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ users: User[], posts: Post[] }>({ users: [], posts: [] });
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const { addNotification } = useNotification();

    // Mock current user for PostComponent props
    const mockCurrentUser: User = { 
        id: 'kuny-user', 
        name: 'Kuny', 
        handle: '@Kuny', 
        avatarUrl: 'https://picsum.photos/seed/kuny/200/200', 
        role: UserRole.Student, 
        email: 'kuny@xelar.com', 
        dateOfBirth: '1990-01-01', 
        followers: 137, 
        following: 42 
    };

    const handleSearch = async () => {
        if (!query.trim()) return;
        setLoading(true);
        setSearched(true);
        try {
            const searchResults = await searchXelar(query);
            setResults({
                users: (searchResults.users || []) as User[],
                posts: (searchResults.posts || []).map(p => ({
                    ...p,
                    likes: Math.floor(Math.random() * 100),
                    comments: Math.floor(Math.random() * 50),
                    isLiked: false,
                    timestamp: '2d ago'
                })) as Post[]
            });
        } catch (error) {
            addNotification("Search failed. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleLike = (postId: string) => {
        setResults(prev => ({
            ...prev,
            posts: prev.posts.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p)
        }));
    };

    const handleDelete = (postId: string) => {
        setResults(prev => ({
            ...prev,
            posts: prev.posts.filter(p => p.id !== postId)
        }));
        addNotification("Post removed from search results.", "info");
    };

    const handleSaveEdit = (postId: string, newContent: string) => {
        setResults(prev => ({
            ...prev,
            posts: prev.posts.map(p => p.id === postId ? { ...p, content: newContent } : p)
        }));
        addNotification("Post updated!");
    };

    return (
        <div className="p-4">
            <div className="relative mb-4">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search Xelar..."
                    className="w-full px-4 py-3 rounded-full bg-card_bg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button 
                    onClick={handleSearch} 
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-white rounded-full font-bold hover:bg-primary_hover transition-colors"
                >
                    Search
                </button>
            </div>
            
            {loading && (
                <div className="flex justify-center p-12">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}

            {!loading && searched && results.users.length === 0 && results.posts.length === 0 && (
                <div className="text-center p-8 text-text_secondary">No results found for "{query}"</div>
            )}
            
            {!loading && (results.users.length > 0 || results.posts.length > 0) && (
                <div className="space-y-8 pb-8">
                    {results.users.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4 px-2">Users</h2>
                            <div className="grid grid-cols-1 gap-3">
                                {results.users.map(user => (
                                     <button 
                                        key={user.id} 
                                        onClick={() => onViewProfile(user)}
                                        className="w-full flex items-center space-x-4 p-4 rounded-2xl bg-card_bg border border-border hover:bg-border transition-all text-left group"
                                    >
                                        <img src={user.avatarUrl || `https://picsum.photos/seed/${user.handle}/200/200`} alt={user.name} className="w-14 h-14 rounded-full border-2 border-transparent group-hover:border-primary transition-colors" />
                                        <div className="flex-1">
                                            <p className="font-bold text-lg">{user.name}</p>
                                            <p className="text-sm text-text_secondary">{user.handle}</p>
                                            {user.bio && <p className="text-sm mt-1 line-clamp-1 opacity-80">{user.bio}</p>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    {results.posts.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold mb-4 px-2">Posts</h2>
                            <div className="space-y-4">
                                {results.posts.map(post => (
                                    <PostComponent 
                                      key={post.id} 
                                      post={post} 
                                      currentUser={mockCurrentUser} 
                                      onSaveEdit={handleSaveEdit}
                                      onDelete={handleDelete}
                                      onLike={handleLike}
                                      onViewProfile={onViewProfile}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
