export interface User {
    id: string;
    name: string;
    email: string;
    role: 'super_admin' | 'admin_resto' | 'admin_garden' | 'admin_ia' | 'user';
    createdAt: string;
    lastLogin?: string;
}

export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    category: 'entree' | 'plat' | 'dessert' | 'boisson';
    available: boolean;
    image?: string;
}

export interface GardenProduct {
    id: string;
    name: string;
    variety?: string;
    description: string;
    price: number;
    unit?: 'kg' | 'piece' | 'botte' | 'unité';
    stock: number;
    inStock: boolean;
    category: 'legume' | 'fruit' | 'epice' | 'aromate' | 'elevage' | 'autre';
    image?: string;
}

export interface IAService {
    id: string;
    name: string;
    description: string;
    category: 'automatisation' | 'chatbot' | 'monitoring' | 'integration';
    pricing: string;
    active: boolean;
    features: string[];
}

export interface Reservation {
    id: string;
    userId: string;
    date: string;
    time: string;
    guests: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    createdAt: string;
}

export interface Order {
    id: string;
    userId: string;
    items: Array<{
        id: string;
        type: 'resto' | 'garden';
        quantity: number;
        price: number;
    }>;
    total: number;
    status: 'pending' | 'paid' | 'delivered' | 'cancelled';
    paymentId?: string;
    createdAt: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
}

export interface ChatSession {
    id: string;
    userId: string;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
}
