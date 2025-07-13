import React, { createContext, useContext, useState } from 'react';

const ContactContext = createContext();

export const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
};

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

export default ContactContext; 