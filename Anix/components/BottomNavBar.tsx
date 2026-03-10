
import React from 'react';
import { Icon } from './Icon';
import type { Page } from '../types';

interface BottomNavBarProps {
    currentPage: Page;
    setCurrentPage: (page: Page) => void;
    onProfileClick: () => void;
    onAiClick: () => void;
}

const NavButton: React.FC<{ icon: string; active: boolean; onClick: () => void; label: string }> = ({ icon, active, onClick, label }) => (
    <button onClick={onClick} className="flex flex-col items-center justify-center w-full h-full" aria-label={label}>
        <Icon name={icon} className={`w-7 h-7 transition-colors ${active ? 'text-primary' : 'text-text_secondary'}`} />
    </button>
);

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentPage, setCurrentPage, onProfileClick, onAiClick }) => {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background/80 backdrop-blur-md border-t border-border z-20">
            <div className="flex justify-around items-center h-full relative">
                <NavButton
                    icon="home"
                    active={currentPage === 'home'}
                    onClick={() => setCurrentPage('home')}
                    label="Home"
                />
                <NavButton
                    icon="messages"
                    active={currentPage === 'messages'}
                    onClick={() => setCurrentPage('messages')}
                    label="Messages"
                />
                
                {/* Meta AI Style Central Button */}
                <div className="flex items-center justify-center -mt-8 relative z-30">
                  <button 
                      onClick={onAiClick}
                      className="w-14 h-14 bg-background border-4 border-background rounded-full flex items-center justify-center shadow-lg transform transition-transform active:scale-90"
                      aria-label="Meta AI Assistant"
                  >
                      <div className="w-11 h-11 flex items-center justify-center text-primary">
                          <Icon name="meta-ai" className="w-10 h-10" />
                      </div>
                  </button>
                </div>

                <NavButton
                    icon="search"
                    active={currentPage === 'search'}
                    onClick={() => setCurrentPage('search')}
                    label="Search"
                />
                <NavButton
                    icon="profile"
                    active={currentPage === 'profile'}
                    onClick={onProfileClick}
                    label="Profile"
                />
            </div>
        </nav>
    );
};
