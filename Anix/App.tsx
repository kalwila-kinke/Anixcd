
import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { HomePage } from './pages/HomePage';
import { MessagesPage } from './pages/MessagesPage';
import { SearchPage } from './pages/SearchPage';
import { ProfileModal } from './components/ProfileModal';
import { PublicProfileModal } from './components/PublicProfileModal';
import { ChatModal } from './components/ChatModal';
import { EditProfileModal } from './components/EditProfileModal';
import { InviteModal } from './components/InviteModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { NotificationContainer } from './components/NotificationContainer';
import { BottomNavBar } from './components/BottomNavBar';
import { AuthPage } from './pages/AuthPage';
import type { User, Page, ChatContact, UserRole, Post } from './types';
import { useNotification } from './contexts/NotificationContext';
import { getCurrentUser, logout } from './services/authService';

const MOCK_CONTACTS: ChatContact[] = [
    { id: 'contact-1', user: { id: 'user-1', name: 'Dr. Emily Carter', handle: '@emilycarter', avatarUrl: 'https://picsum.photos/seed/contact1/200/200', role: 'Professor' as UserRole, email: '', dateOfBirth: '' } as User, online: true },
    { id: 'contact-2', user: { id: 'user-2', name: 'BenNet', handle: '@bennet', avatarUrl: 'https://picsum.photos/seed/contact2/200/200', role: 'Student' as UserRole, email: '', dateOfBirth: '' } as User, online: false },
    { id: 'contact-3', user: { id: 'user-3', name: 'Laura Chen', handle: '@laurachen', avatarUrl: 'https://picsum.photos/seed/contact3/200/200', role: 'Student' as UserRole, email: '', dateOfBirth: '' } as User, online: true },
    { id: 'contact-4', user: { id: 'user-4', name: 'Dr. Smith', handle: '@dsmith', avatarUrl: 'https://picsum.photos/seed/contact4/200/200', role: 'Professor' as UserRole, email: '', dateOfBirth: '' } as User, online: false },
];

const INITIAL_POSTS: Post[] = [
    {
        id: 'post-1',
        author: { id: 'current-user', name: 'Dr. Alex Riley', handle: '@alexriley', avatarUrl: 'https://picsum.photos/seed/user/200/200', role: 'Professor' as UserRole, email: 'alex@xelar.com', dateOfBirth: '1985-05-15', followers: 1258, following: 342 },
        content: "Bienvenue sur mon profil Xelar ! Je partage ici mes recherches en IA.",
        imageUrl: 'https://picsum.photos/seed/post_welcome/600/400',
        timestamp: '2h ago',
        likes: 156,
        comments: 23,
        isLiked: false,
    },
    {
        id: 'post-2',
        author: { id: 'user-2', name: 'BenNet', handle: '@bennet', avatarUrl: 'https://picsum.photos/seed/contact2/200/200', role: 'Student' as UserRole, email: 'bennet@example.com', dateOfBirth: '2001-05-10', followers: 150, following: 250 } as User,
        content: "Quelqu'un a-t-il des ressources sur les GNN ?",
        timestamp: '5h ago',
        likes: 98,
        comments: 12,
        isLiked: true,
    }
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isEditProfileModalOpen, setEditProfileModalOpen] = useState(false);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false);
  const [viewedProfile, setViewedProfile] = useState<User | null>(null);
  const [activeChatContact, setActiveChatContact] = useState<ChatContact | null>(null);
  const [contacts, setContacts] = useState<ChatContact[]>([]);
  const { addNotification } = useNotification();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  useEffect(() => {
    if(currentUser) {
        setTimeout(() => {
            setContacts(MOCK_CONTACTS);
        }, 1000);
    } else {
        setContacts([]);
    }
  }, [currentUser]);

  const handleCreatePost = (content: string, imageUrl: string | null) => {
    if (!currentUser) return;
    const newPost: Post = {
        id: new Date().toISOString(),
        author: currentUser,
        content,
        imageUrl: imageUrl || undefined,
        timestamp: 'À l\'instant',
        likes: 0,
        comments: 0,
        isLiked: false,
    };
    setPosts(prev => [newPost, ...prev]);
    addNotification('Post publié avec succès !');
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isLiked: !p.isLiked, likes: p.isLiked ? p.likes - 1 : p.likes + 1 } : p));
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    addNotification('Post supprimé.', 'info');
  };

  const handleSaveEditPost = (postId: string, newContent: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, content: newContent } : p));
    addNotification('Modification enregistrée !');
  };

  const handleAuthSuccess = (user: User) => {
      setCurrentUser(user);
      addNotification(`Content de vous revoir, ${user.name}!`);
  };
  
  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setProfileModalOpen(false);
    addNotification("Vous avez été déconnecté.", "info");
  };

  const handleViewProfile = (user: User) => {
    if (user.id === currentUser?.id) {
        setProfileModalOpen(true);
    } else {
        setViewedProfile(user);
    }
  };

  const handleEditProfile = () => {
    setProfileModalOpen(false);
    setEditProfileModalOpen(true);
  }

  const handleSaveProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    // Mettre à jour l'auteur dans les posts existants pour refléter les changements de profil
    setPosts(prev => prev.map(p => p.author.id === updatedUser.id ? { ...p, author: updatedUser } : p));
    addNotification('Profil mis à jour !');
  }
  
  if (!currentUser) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage 
            currentUser={currentUser} 
            posts={posts} 
            onCreatePost={handleCreatePost}
            onLike={handleLikePost}
            onDelete={handleDeletePost}
            onSaveEdit={handleSaveEditPost}
            onViewProfile={handleViewProfile} 
        />;
      case 'messages':
        return <MessagesPage contacts={contacts} onContactClick={setActiveChatContact} />;
      case 'search':
        return <SearchPage onViewProfile={handleViewProfile} />;
      default:
        return <HomePage 
            currentUser={currentUser} 
            posts={posts} 
            onCreatePost={handleCreatePost}
            onLike={handleLikePost}
            onDelete={handleDeletePost}
            onSaveEdit={handleSaveEditPost}
            onViewProfile={handleViewProfile} 
        />;
    }
  };

  return (
    <div className="bg-background text-text_primary min-h-screen">
      <Header />
      <main className="container mx-auto max-w-7xl px-0 md:px-4 grid grid-cols-12 gap-x-4">
        <div className="hidden md:block md:col-span-3">
          <LeftSidebar currentPage={currentPage} setCurrentPage={setCurrentPage} onProfileClick={() => setProfileModalOpen(true)} onLogout={handleLogout} />
        </div>
        <div className="col-span-12 md:col-span-6 border-x border-border pb-16 md:pb-0">
          {renderPage()}
        </div>
        <div className="hidden md:block md:col-span-3">
          <RightSidebar contacts={contacts} onContactClick={setActiveChatContact} onInviteClick={() => setInviteModalOpen(true)} />
        </div>
      </main>
      
      <BottomNavBar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        onProfileClick={() => setProfileModalOpen(true)}
        onAiClick={() => setIsAiAssistantOpen(true)}
      />

      {isProfileModalOpen && (
        <ProfileModal 
            user={currentUser} 
            posts={posts}
            onLike={handleLikePost}
            onDelete={handleDeletePost}
            onSaveEdit={handleSaveEditPost}
            onClose={() => setProfileModalOpen(false)} 
            onEdit={handleEditProfile} 
            onLogout={handleLogout} 
        />
      )}
      {isEditProfileModalOpen && <EditProfileModal user={currentUser} onClose={() => setEditProfileModalOpen(false)} onSave={handleSaveProfile} />}
      {viewedProfile && (
        <PublicProfileModal 
            user={viewedProfile} 
            posts={posts}
            onLike={handleLikePost}
            onClose={() => setViewedProfile(null)} 
        />
      )}
      {activeChatContact && <ChatModal contact={activeChatContact} onClose={() => setActiveChatContact(null)} />}
      {isInviteModalOpen && <InviteModal onClose={() => setInviteModalOpen(false)} />}
      {isAiAssistantOpen && <AiAssistantModal onClose={() => setIsAiAssistantOpen(false)} />}
      <NotificationContainer />
    </div>
  );
}

export default App;
