
import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface GuestIdContextType {
  guestId: string | null;
  setGuestId: React.Dispatch<React.SetStateAction<string | null>>;
}

const GuestIdContext = createContext<GuestIdContextType | undefined>(undefined);

export const GuestIdProvider = ({ children }: { children: React.ReactNode }) => {
  const [guestId, setGuestId] = useState<string | null>(null);

  useEffect(() => {
    // Try to get existing guestId from localStorage
    let id = localStorage.getItem('guestId');
    
    // If no guestId exists, create one and store it
    if (!id) {
      id = uuidv4();
      localStorage.setItem('guestId', id);
    }
    
    setGuestId(id);
  }, []);

  return (
    <GuestIdContext.Provider value={{ guestId, setGuestId }}>
      {children}
    </GuestIdContext.Provider>
  );
};

export const useGuestId = () => {
  const context = useContext(GuestIdContext);
  if (context === undefined) {
    throw new Error('useGuestId must be used within a GuestIdProvider');
  }
  return context;
};
