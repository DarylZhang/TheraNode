"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language, TranslationDict } from "./translations";

type I18nContextType = {
    lang: Language;
    setLang: (lang: Language) => void;
    t: (path: string, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLang] = useState<Language>("zh");

    // Load preference from localStorage
    useEffect(() => {
        const saved = localStorage.getItem("preferred_lang") as Language;
        if (saved && translations[saved]) {
            setLang(saved);
        }
    }, []);

    const handleSetLang = (newLang: Language) => {
        setLang(newLang);
        localStorage.setItem("preferred_lang", newLang);
    };

    const t = (path: string, params?: Record<string, string | number>): string => {
        const keys = path.split(".");
        let current: any = translations[lang];

        for (const key of keys) {
            if (current[key] === undefined) {
                // Fallback to English if key missing in current language
                let fallback = translations["en"] as any;
                for (const fKey of keys) {
                    if (fallback[fKey] === undefined) return path;
                    fallback = fallback[fKey];
                }
                return fallback;
            }
            current = current[key];
        }

        if (typeof current !== "string") return path;

        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                current = current.replace(`{${key}}`, String(value));
            });
        }

        return current;
    };

    return (
        <I18nContext.Provider value={{ lang, setLang: handleSetLang, t }}>
            {children}
        </I18nContext.Provider>
    );
}

export function useI18n() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error("useI18n must be used within an I18nProvider");
    }
    return context;
}
