import { createContext, useContext, useState, type ReactNode } from 'react';

interface FinancialPrivacyContextType {
  isHidden: boolean;
  toggle: () => void;
  mask: (value: string) => string;
  maskNumber: (value: number, prefix?: string) => string;
}

const FinancialPrivacyContext = createContext<FinancialPrivacyContextType>({
  isHidden: false,
  toggle: () => {},
  mask: (v) => v,
  maskNumber: (v, p) => `${p || ''}${v.toLocaleString()}`,
});

export function FinancialPrivacyProvider({ children }: { children: ReactNode }) {
  const [isHidden, setIsHidden] = useState(false);

  const toggle = () => setIsHidden(prev => !prev);

  const mask = (value: string): string => {
    if (!isHidden) return value;
    // Replace digits and dollar amounts with bullets
    return value.replace(/\$[\d,]+(\.\d+)?/g, '$•••••').replace(/(?<!\$)\b\d[\d,]*(\.\d+)?\b/g, '•••');
  };

  const maskNumber = (value: number, prefix = '$'): string => {
    if (!isHidden) return `${prefix}${value.toLocaleString()}`;
    return `${prefix}•••••`;
  };

  return (
    <FinancialPrivacyContext.Provider value={{ isHidden, toggle, mask, maskNumber }}>
      {children}
    </FinancialPrivacyContext.Provider>
  );
}

export const useFinancialPrivacy = () => useContext(FinancialPrivacyContext);
