import { create } from 'zustand';

export interface PlayspaceItem {
    id: string;
    type: 'stone' | 'emotion' | 'abstract';
    x: number;
    y: number;
    color: string;
    label?: string;
}

interface PlayspaceState {
    items: PlayspaceItem[];
    addItem: (item: Omit<PlayspaceItem, 'id'>) => void;
    updateItem: (id: string, updates: Partial<PlayspaceItem>) => void;
    removeItem: (id: string) => void;
    clearItems: () => void;
}

export const usePlayspaceStore = create<PlayspaceState>((set) => ({
    items: [],
    addItem: (item) => set((state) => ({
        items: [...state.items, { ...item, id: Math.random().toString(36).substring(7) }]
    })),
    updateItem: (id, updates) => set((state) => ({
        items: state.items.map((item) => item.id === id ? { ...item, ...updates } : item)
    })),
    removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
    })),
    clearItems: () => set({ items: [] }),
}));
