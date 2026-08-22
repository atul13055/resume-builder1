import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  getUserDictionary,
  addToUserDictionary as addWordToDict,
  removeFromUserDictionary as removeWordFromDict,
  ignoreWordInSession,
  isWordIgnored,
} from '../../utils/spellChecker';

interface SpellCheckContextType {
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  toggleEnabled: () => void;
  customDictionary: string[];
  addToDictionary: (word: string) => void;
  removeFromDictionary: (word: string) => void;
  ignoreWord: (word: string) => void;
  isIgnored: (word: string) => boolean;
  activeTyposCount: number;
  reportFieldTypos: (fieldId: string, count: number) => void;
  unregisterField: (fieldId: string) => void;
}

const SpellCheckContext = createContext<SpellCheckContextType | undefined>(undefined);

export const SpellCheckProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('resumebuilder_spellcheck_enabled');
      return stored !== null ? JSON.parse(stored) : true;
    } catch {
      return true;
    }
  });

  const [customDictionary, setCustomDictionary] = useState<string[]>([]);
  const [fieldTypoMap, setFieldTypoMap] = useState<Record<string, number>>({});
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    setCustomDictionary(getUserDictionary());
  }, []);

  const toggleEnabled = () => {
    setIsEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('resumebuilder_spellcheck_enabled', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  const addToDictionary = (word: string) => {
    addWordToDict(word);
    setCustomDictionary(getUserDictionary());
    setForceUpdate((v) => v + 1);
  };

  const removeFromDictionary = (word: string) => {
    removeWordFromDict(word);
    setCustomDictionary(getUserDictionary());
    setForceUpdate((v) => v + 1);
  };

  const ignoreWord = (word: string) => {
    ignoreWordInSession(word);
    setForceUpdate((v) => v + 1);
  };

  const isIgnored = (word: string) => {
    return isWordIgnored(word);
  };

  const reportFieldTypos = (fieldId: string, count: number) => {
    setFieldTypoMap((prev) => {
      if (prev[fieldId] === count) return prev;
      return { ...prev, [fieldId]: count };
    });
  };

  const unregisterField = (fieldId: string) => {
    setFieldTypoMap((prev) => {
      if (!(fieldId in prev)) return prev;
      const next = { ...prev };
      delete next[fieldId];
      return next;
    });
  };

  const activeTyposCount = (Object.values(fieldTypoMap) as number[]).reduce((sum: number, count: number) => sum + count, 0);

  return (
    <SpellCheckContext.Provider
      value={{
        isEnabled,
        setIsEnabled,
        toggleEnabled,
        customDictionary,
        addToDictionary,
        removeFromDictionary,
        ignoreWord,
        isIgnored,
        activeTyposCount,
        reportFieldTypos,
        unregisterField,
      }}
    >
      {children}
    </SpellCheckContext.Provider>
  );
};

export const useSpellCheck = () => {
  const context = useContext(SpellCheckContext);
  if (!context) {
    throw new Error('useSpellCheck must be used within a SpellCheckProvider');
  }
  return context;
};
