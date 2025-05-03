
import { createContext, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

type GuestIdContextType = {
  guestId: string | null;
};

const GuestIdContext = createContext<GuestIdContextType>({ guestId: null });

export const useGuestId = () => useContext(GuestIdContext);

export const GuestIdProvider = ({ children }: { children: React.ReactNode }) => {
  const [guestId, setGuestId] = useState<string | null>(null);

  useEffect(() => {
    // Check if a guestId already exists in localStorage
    let existingGuestId = localStorage.getItem('guestId');
    
    // If no guestId exists, create one and store it
    if (!existingGuestId) {
      existingGuestId = uuidv4();
      localStorage.setItem('guestId', existingGuestId);
    }
    
    setGuestId(existingGuestId);
  }, []);

  return (
    <GuestIdContext.Provider value={{ guestId }}>
      {children}
    </GuestIdContext.Provider>
  );
};
