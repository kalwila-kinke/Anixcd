
import React, { useState, useEffect } from 'react';
import { Icon } from './Icon';
import { UserRole } from '../types';

// Mock de données récentes pour le défileur
const DISCOVERY_ITEMS = [
  {
    id: 'post-1',
    authorName: 'Dr. Emily Carter',
    avatar: 'https://picsum.photos/seed/contact1/40/40',
    text: 'Just published a new paper on astrophysics...',
    image: 'https://picsum.photos/seed/post1/40/40'
  },
  {
    id: 'post-2',
    authorName: 'BenNet',
    avatar: 'https://picsum.photos/seed/contact2/40/40',
    text: 'Thrilled to present my research at #ICLR2024!',
    image: null
  },
  {
    id: 'post-3',
    authorName: 'Laura Chen',
    avatar: 'https://picsum.photos/seed/contact3/40/40',
    text: 'Working on a new methodology for GNNs...',
    image: 'https://picsum.photos/seed/post3/40/40'
  }
];

export const Header: React.FC = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (isFocused) return;

    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % DISCOVERY_ITEMS.length);
        setFade(true);
      }, 300); // Temps du fade out
    }, 4000);

    return () => clearInterval(interval);
  }, [isFocused]);

  const currentItem = DISCOVERY_ITEMS[currentIndex];

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-2 flex-shrink-0">
             <Icon name="xelar" className="h-8 w-8 text-primary" />
             <h1 className="text-2xl font-bold text-text_primary hidden sm:block">Xelar</h1>
          </div>

          {/* Dynamic Search Bar */}
          <div className="flex-1 max-w-xl mx-4 relative group">
            <div className="relative w-full h-10">
              <input 
                type="text" 
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                  if (e.target.value === '') setIsFocused(false);
                }}
                placeholder={isFocused ? "Search Xelar..." : ""}
                className="w-full h-full pl-10 pr-4 rounded-full bg-card_bg border border-border focus:outline-none focus:ring-2 focus:ring-primary transition-all text-text_primary z-10 relative"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text_secondary z-20 pointer-events-none">
                <Icon name="search" className="w-5 h-5" />
              </div>

              {/* Discovery Ticker Overlay */}
              {!isFocused && (
                <div 
                  className={`absolute inset-0 flex items-center pl-10 pr-4 pointer-events-none transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}
                >
                  <div className="flex items-center space-x-2 w-full truncate">
                    <img src={currentItem.avatar} alt="" className="w-5 h-5 rounded-full border border-border" />
                    <span className="text-sm font-bold text-primary truncate shrink-0">{currentItem.authorName}:</span>
                    <span className="text-sm text-text_secondary truncate flex-1">"{currentItem.text}"</span>
                    {currentItem.image && (
                      <img src={currentItem.image} alt="" className="w-6 h-6 rounded-md object-cover border border-border shrink-0" />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4 flex-shrink-0">
             <div className="relative hidden md:block">
                <img src="https://picsum.photos/seed/user/40/40" alt="User Avatar" className="w-9 h-9 rounded-full border border-border hover:opacity-80 cursor-pointer transition-opacity" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
             </div>
             <button className="px-5 py-2 bg-primary text-white rounded-full font-bold hover:bg-primary_hover transition-all shadow-sm active:scale-95">
               Post
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};
