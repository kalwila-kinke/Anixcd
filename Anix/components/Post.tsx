
import React, { useState, useRef, useEffect } from 'react';
import { Icon } from './Icon';
import { EditPostModal } from './EditPostModal';
import type { Post as PostType, User } from '../types';
import { useNotification } from '../contexts/NotificationContext';

interface PostProps {
  post: PostType;
  currentUser: User;
  onSaveEdit: (postId: string, newContent: string) => void;
  onDelete: (postId: string) => void;
  onLike: (postId: string) => void;
  onViewProfile: (user: User) => void;
}

export const Post: React.FC<PostProps> = ({ post, currentUser, onSaveEdit, onDelete, onLike, onViewProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef<HTMLDivElement>(null);
  const { addNotification } = useNotification();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const menuItems = [
    { label: 'Modifier', icon: 'edit', action: () => setIsEditing(true), ownerOnly: true },
    { label: 'Supprimer', icon: 'trash', action: () => onDelete(post.id), ownerOnly: true, danger: true },
    { label: 'À propos', icon: 'info', action: () => addNotification("Xelar v1.0.0", "info") },
    { label: 'Service', icon: 'settings', action: () => addNotification("Service Xelar actif", "info") },
    { label: 'Langue', icon: 'globe', action: () => addNotification("Langue : Français", "info") },
    { label: 'Sécurité', icon: 'shield', action: () => addNotification("Paramètres de sécurité", "info") },
    { label: 'Conditions', icon: 'file-text', action: () => addNotification("Conditions d'utilisation", "info") },
    { label: 'Jeux', icon: 'gamepad', action: () => addNotification("Mini-jeux académiques", "info") },
    { label: 'Page', icon: 'layout', action: () => addNotification("Détails de la page", "info") },
    { label: 'Pages bloquées', icon: 'block', action: () => addNotification("Liste des bloqués", "info") },
    { label: 'Compte', icon: 'profile', action: () => addNotification("Modifier mon compte", "info") },
    { label: 'Déconnexion', icon: 'logout', action: () => window.location.reload(), danger: true },
  ];

  return (
    <article className="bg-card_bg border border-border rounded-2xl p-4 transition-all duration-200 hover:shadow-md">
      <div className="flex items-start space-x-3">
        <button onClick={() => onViewProfile(post.author)} className="flex-shrink-0 transition-transform hover:scale-105" aria-label={`Voir le profil de ${post.author.name}`}>
          <img src={post.author.avatarUrl} alt={post.author.name} className="w-12 h-12 rounded-full border border-border" />
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <button onClick={() => onViewProfile(post.author)} className="text-left group">
              <span className="font-bold text-text_primary group-hover:underline">{post.author.name}</span>
              <span className="text-text_secondary ml-2 text-sm">{post.author.handle} · {post.timestamp}</span>
            </button>
            
            <div className="relative" ref={optionsRef}>
              <button 
                onClick={() => setShowOptions(!showOptions)}
                className="p-2 rounded-full hover:bg-primary/10 text-text_secondary hover:text-primary transition-colors"
                aria-label="Plus d'options"
              >
                <Icon name="more-horizontal" className="w-5 h-5"/>
              </button>

              {showOptions && (
                <div className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-xl shadow-xl z-20 overflow-hidden">
                  <div className="max-h-80 overflow-y-auto">
                    {menuItems.map((item, idx) => (
                      (!item.ownerOnly || post.author.id === currentUser.id) && (
                        <button
                          key={idx}
                          onClick={() => { item.action(); setShowOptions(false); }}
                          className={`w-full flex items-center space-x-3 px-4 py-2 text-sm hover:bg-card_bg transition-colors ${item.danger ? 'text-red-500' : 'text-text_primary'}`}
                        >
                          <Icon name={item.icon} className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <p className="mt-2 text-text_primary whitespace-pre-wrap leading-relaxed">{post.content}</p>
          
          {post.imageUrl && (
            <div className="mt-3 overflow-hidden rounded-2xl border border-border">
                <img src={post.imageUrl} alt="Contenu" className="w-full h-auto object-cover" style={{ maxHeight: '512px' }} />
            </div>
          )}
          
          <div className="flex justify-between items-center mt-4 text-text_secondary max-w-xs">
            <button className="flex items-center space-x-2 group hover:text-primary transition-colors">
              <div className="p-2 rounded-full group-hover:bg-primary/10">
                <Icon name="comment" className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">{post.comments}</span>
            </button>
            <button
              onClick={() => onLike(post.id)}
              className={`flex items-center space-x-2 group transition-colors ${post.isLiked ? 'text-red-500' : 'hover:text-red-500'}`}
            >
              <div className={`p-2 rounded-full ${post.isLiked ? 'bg-red-500/10' : 'group-hover:bg-red-500/10'}`}>
                <Icon name="heart" className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
              </div>
              <span className="text-sm font-medium">{post.likes}</span>
            </button>
          </div>
        </div>
      </div>
      {isEditing && (
        <EditPostModal
          post={post}
          onClose={() => setIsEditing(false)}
          onSave={onSaveEdit}
        />
      )}
    </article>
  );
};
