import React from 'react';

export const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans flex flex-col">
      {children}
    </div>
  );
};

export default RootLayout;
