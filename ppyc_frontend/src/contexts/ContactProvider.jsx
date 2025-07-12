import React, { useState } from 'react';
import ContactContext from './contactContext';

export const ContactProvider = ({ children }) => {
  const [contactInfo, setContactInfo] = useState({
    email: 'secretary.ppyc@gmail.com',
    phone: '(617)846-7124',
    address: '562 Pleasant Street, Winthrop MA 02152'
  });

  // Function to update contact info
  const updateContactInfo = (newInfo) => {
    setContactInfo(prev => ({ ...prev, ...newInfo }));
  };

  return (
    <ContactContext.Provider value={{ contactInfo, updateContactInfo }}>
      {children}
    </ContactContext.Provider>
  );
}; 