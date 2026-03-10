
import React, { useState, useMemo } from 'react';
import { Modal } from './Modal';
import { SettingsModal } from './SettingsModal';
import { Post as PostComponent } from './Post';
import { Icon } from './Icon';
import type { User, Post } from '../types';

interface ProfileModalProps {
  user: User;
  posts: Post[];
  onLike: (postId: string) => void;
  onDelete: (postId: string) => void;
  onSaveEdit: (postId: string, newContent: string) => void;
  onClose: () => void;
  onEdit: () => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ 
    user, 
    posts, 
    onLike, 
    onDelete, 
    onSaveEdit, 
    onClose, 
    onEdit, 
    onLogout 
}) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const filteredPosts = useMemo(() => {
    switch(activeTab) {
        case 'posts':
            return posts.filter(p => p.author.id === user.id);
        case 'likes':
            return posts.filter(p => p.isLiked);
        case 'media':
            return posts.filter(p => p.author.id === user.id && p.imageUrl);
        default:
            return posts.filter(p => p.author.id === user.id);
    }
  }, [posts, user.id, activeTab]);

  return (
    <>
      <Modal onClose={onClose} title={`${user.name}`}>
        <div className="relative overflow-hidden">
          {/* Banner */}
          <div className="h-40 md:h-52 bg-card_bg relative group">
              <img src={user.bannerUrl || `https://picsum.photos/seed/${user.id}-banner/800/300`} alt="Banner" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
          </div>

          {/* Profile Details */}
          <div className="px-4 relative bg-background">
            <div className="absolute -top-16 md:-top-20 left-4">
                <div className="relative group">
                  <img 
                      src={user.avatarUrl}
                      alt={user.name}
                      className="w-28 h-28 md:w-36 md:h-36 rounded-full border-4 border-background object-cover bg-background shadow-lg"
                  />
                  <div 
                      className="absolute inset-0 rounded-full bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={onEdit}
                  >
                      <Icon name="edit" className="w-8 h-8 text-white" />
                  </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 space-x-2">
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 border border-border rounded-full hover:bg-card_bg transition-colors"
                >
                  <Icon name="settings" className="w-6 h-6 text-text_secondary" />
                </button>
                <button 
                  onClick={onEdit}
                  className="px-4 py-1.5 border border-border rounded-full font-bold hover:bg-card_bg transition-colors"
                >
                  Éditer le profil
                </button>
            </div>

            <div className="mt-8 mb-4">
                <h2 className="text-xl md:text-2xl font-black text-text_primary">{user.name}</h2>
                <p className="text-text_secondary">{user.handle}</p>
                <p className="mt-3 text-text_primary">{user.bio || "Pas de biographie."}</p>
                
                <div className="flex flex-wrap gap-x-4 mt-3 text-text_secondary text-sm">
                    <div className="flex items-center space-x-1">
                        <Icon name="calendar" className="w-4 h-4" />
                        <span>Rejoint en Octobre 2023</span>
                    </div>
                </div>

                <div className="flex items-center space-x-4 mt-3 text-sm">
                    <button className="hover:underline"><span className="font-bold text-text_primary">{user.following}</span> <span className="text-text_secondary">abonnements</span></button>
                    <button className="hover:underline"><span className="font-bold text-text_primary">{user.followers}</span> <span className="text-text_secondary">abonnés</span></button>
                </div>
            </div>
          </div>

          {/* Twitter Style Tabs */}
          <div className="flex border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
            {['posts', 'replies', 'media', 'likes'].map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="flex-1 py-4 text-sm font-bold capitalize relative hover:bg-card_bg transition-colors"
                >
                    <span className={activeTab === tab ? 'text-text_primary' : 'text-text_secondary'}>
                        {tab === 'posts' ? 'Posts' : tab === 'replies' ? 'Réponses' : tab === 'media' ? 'Médias' : 'J\'aime'}
                    </span>
                    {activeTab === tab && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-primary rounded-full" />
                    )}
                </button>
            ))}
          </div>
          
          {/* Post Feed on Profile */}
          <div className="divide-y divide-border pb-10">
            {filteredPosts.length > 0 ? (
                filteredPosts.map(post => (
                    <PostComponent 
                        key={post.id} 
                        post={post} 
                        currentUser={user}
                        onSaveEdit={onSaveEdit}
                        onDelete={onDelete}
                        onLike={onLike}
                        onViewProfile={() => {}} // Déjà sur le profil
                    />
                ))
            ) : (
                <div className="p-12 text-center text-text_secondary">
                    <p className="text-xl font-bold text-text_primary">Aucun contenu pour le moment</p>
                    <p className="mt-2">Les posts de cet utilisateur apparaîtront ici.</p>
                </div>
            )}
          </div>
        </div>
      </Modal>
      {isSettingsOpen && <SettingsModal onClose={() => setIsSettingsOpen(false)} />}
    </>
  );
};
