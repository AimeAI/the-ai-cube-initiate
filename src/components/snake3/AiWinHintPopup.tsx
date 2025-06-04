import React, { useState, useEffect } from 'react';

interface AiWinHintPopupProps {
  isVisibleInitially?: boolean;
  onDismiss?: () => void;
}

const AiWinHintPopup: React.FC<AiWinHintPopupProps> = ({ isVisibleInitially = true, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(isVisibleInitially);

  useEffect(() => {
    setIsVisible(isVisibleInitially);
  }, [isVisibleInitially]);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      onClick={handleDismiss}
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        color: 'white',
        padding: '20px',
        borderRadius: '10px',
        zIndex: 1000,
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        maxWidth: '300px',
      }}
    >
      <h4>AI Win Button Hint</h4>
      <p>
        To use the "AI Win" button, you need to click it repeatedly (spam it) in sequence.
        This guides the snake, as it needs your continuous help to navigate and win!
      </p>
      <small>(Click this message to dismiss)</small>
    </div>
  );
};

export default AiWinHintPopup;