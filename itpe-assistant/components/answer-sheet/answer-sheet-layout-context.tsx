"use client";

import { createContext, useContext } from "react";

interface AnswerSheetLayoutContextType {
    lineHeight: number;
    totalHeight: number;
}

const AnswerSheetLayoutContext = createContext<AnswerSheetLayoutContextType | null>(null);

export function useAnswerSheetLayout() {
    const context = useContext(AnswerSheetLayoutContext);
    if (!context) {
        throw new Error("useAnswerSheetLayout must be used within AnswerSheetLayoutProvider");
    }
    return context;
}

export const AnswerSheetLayoutProvider = AnswerSheetLayoutContext.Provider;
