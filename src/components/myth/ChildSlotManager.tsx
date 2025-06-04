import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

interface ChildSlot {
  id: number;
  name: string;
}

interface ChildSlotManagerProps {
  totalSlots: number;
}

const ChildSlotManager: React.FC<ChildSlotManagerProps> = ({ totalSlots }) => {
  const { t } = useTranslation();
  const [childSlots, setChildSlots] = useState<ChildSlot[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Initialize slots based on totalSlots prop
    if (totalSlots > 0) {
      const initialSlots: ChildSlot[] = Array.from({ length: totalSlots }, (_, i) => {
        const storedName = localStorage.getItem(`child_slot_${i + 1}`);
        return { id: i + 1, name: storedName || '' };
      });
      setChildSlots(initialSlots);
    } else {
      setChildSlots([]); // No slots if totalSlots is 0 or less
    }
  }, [totalSlots]);

  const handleNameChange = (id: number, newName: string) => {
    setChildSlots(prevSlots =>
      prevSlots.map(slot => (slot.id === id ? { ...slot, name: newName } : slot))
    );
  };

  const handleSaveChildSlots = () => {
    childSlots.forEach(slot => {
      localStorage.setItem(`child_slot_${slot.id}`, slot.name);
    });
    setMessage(t('childSlotManager.saveSuccess', 'Child names saved successfully!'));
    setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
  };

  return (
    <div className="mt-12 p-6 bg-myth-dark rounded-lg shadow-xl">
      <h2 className="text-2xl font-orbitron font-bold mb-6 text-myth-accent">
        {t('childSlotManager.title', 'Manage Child Profiles')}
      </h2>
      <p className="text-myth-textSecondary mb-4">
        {t('childSlotManager.availableSlots', { count: totalSlots })}
      </p>
      
      <div className="space-y-4">
        {childSlots.map(slot => (
          <div key={slot.id} className="flex flex-col space-y-1">
            <Label htmlFor={`childName${slot.id}`} className="text-myth-textSecondary">
              {t('childSlotManager.slotLabel', `Slot ${slot.id} Name`)}
            </Label>
            <Input
              id={`childName${slot.id}`}
              type="text"
              value={slot.name}
              onChange={(e) => handleNameChange(slot.id, e.target.value)}
              placeholder={t('childSlotManager.slotPlaceholder', `Enter name for Slot ${slot.id}`)}
              className="bg-myth-darker border-myth-dark-light text-myth-textPrimary"
            />
          </div>
        ))}
      </div>

      <Button
        onClick={handleSaveChildSlots}
        className="w-full mt-6 bg-myth-accent hover:bg-myth-accent-dark text-white font-semibold py-3 rounded-md transition duration-150 ease-in-out"
      >
        {t('childSlotManager.saveButton', 'Save Child Names')}
      </Button>
      {message && (
        <p className="mt-4 text-sm text-green-500 text-center">
          {message}
        </p>
      )}
    </div>
  );
};

export default ChildSlotManager;