
import React, { useState, useMemo } from 'react';
import { Modal } from './Modal';
import { Icon } from './Icon';
import { Post as PostComponent } from './Post';
import type { User, Post } from '../types';

interface PublicProfileModalProps {
  user: User;
  posts: Post[];
  onLike: (postId: string) => void;
  onClose: () => void;
}

export const PublicProfileModal: React.FC<PublicProfileModalProps> = ({ user, posts, onLike, onClose }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const filteredPosts = useMemo(() => {
    return posts.filter(p => p.author.id === user.id);
  }, [posts, user.id]);

  return (
    <Modal onClose={onClose} title={`${user.name}`}>
      <div className="relative overflow-hidden bg-background">
        {/* Banner */}
        <div className="h-40 md:h-52 bg-card_bg relative">
          <img src={user.bannerUrl || `https://picsum.photos/seed/${user.id}-banner/800/300`} alt="Banner" className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="px-4 relative">
          <div className="absolute -top-16 md:-top-20 left-4">
            <img 
                src={user.avatarUrl}
                alt={user.name}
                className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-background object-cover bg-background shadow-lg"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button 
                onClick={() => setIsFollowing(!isFollowing)}
                className={`px-6 py-2 rounded-full font-bold transition-all ${isFollowing ? 'border border-border hover:border-red-500 hover:text-red-500 hover:bg-red-500/5' : 'bg-text_primary text-background hover:opacity-90'}`}
            >
                {isFollowing ? 'Abonné' : 'Suivre'}
            </button>
          </div>

          <div className="mt-8 mb-4">
            <h2 className="text-xl md:text-2xl font-black text-text_primary">{user.name}</h2>
            <p className="text-text_secondary">{user.handle}</p>
            <p className="mt-3 text-text_primary leading-relaxed">{user.bio || 'Pas de biographie disponible.'}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          {['posts', 'media', 'likes'].map((tab) => (
              <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 py-4 text-sm font-bold capitalize relative"
              >
                  <span className={activeTab === tab ? 'text-text_primary' : 'text-text_secondary'}>{tab}</span>
                  {activeTab === tab && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary rounded-full" />}
              </button>
          ))}
        </div>

        <div className="divide-y divide-border">
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
                <PostComponent 
                    key={post.id} 
                    post={post} 
                    currentUser={user} // Mock context
                    onSaveEdit={() => {}} 
                    onDelete={() => {}} 
                    onLike={onLike}
                    onViewProfile={() => {}}
                />
            ))
          ) : (
            <div className="p-10 text-center text-text_secondary">Aucun post.</div>
          )}
        </div>
      </div>
    </Modal>
  );
};
