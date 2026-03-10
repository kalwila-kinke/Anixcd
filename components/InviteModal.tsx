
import React from 'react';
import { Modal } from './Modal';
import { Icon } from './Icon';
import { useNotification } from '../contexts/NotificationContext';

interface InviteModalProps {
  onClose: () => void;
}

export const InviteModal: React.FC<InviteModalProps> = ({ onClose }) => {
  const { addNotification } = useNotification();
  const inviteLink = "https://xelar.app/join/academic-community";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    addNotification("Link copied to clipboard!");
  };

  return (
    <Modal onClose={onClose} title="Invite to Xelar">
      <div className="p-6 text-center">
        <div className="mb-6">
          <Icon name="xelar" className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Build your academic circle</h3>
          <p className="text-text_secondary">
            Share Xelar with your students, fellow professors, or research colleagues to foster better collaboration.
          </p>
        </div>

        <div className="bg-card_bg border border-border rounded-xl p-3 flex items-center justify-between mb-6">
          <span className="text-sm truncate text-text_secondary flex-1 mr-2">{inviteLink}</span>
          <button 
            onClick={handleCopy}
            className="px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary_hover transition-colors"
          >
            Copy
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700">
            <Icon name="mail" className="w-5 h-5" />
            <span>Email</span>
          </button>
          <button className="flex items-center justify-center space-x-2 p-3 bg-[#1d9bf0] text-white rounded-xl hover:opacity-90">
             <Icon name="xelar" className="w-5 h-5" />
             <span>Tweet</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
