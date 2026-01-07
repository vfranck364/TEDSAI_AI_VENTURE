'use client';

import { GardenProduct } from '@/types';
import Image from 'next/image';

interface CartItem extends GardenProduct {
    cartQuantity: number;
}

interface CartSidebarProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartItem[];
    onUpdateQuantity: (id: string, delta: number) => void;
    onRemove: (id: string) => void;
}

export default function CartSidebar({ isOpen, onClose, items, onUpdateQuantity, onRemove }: CartSidebarProps) {
    const total = items.reduce((sum, item) => sum + (item.price || 0) * item.cartQuantity, 0);

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-[1000] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-white z-[1001] shadow-2xl transition-transform duration-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b flex justify-between items-center bg-gray-50">
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                            <i className="fa-solid fa-cart-shopping text-green-600"></i>
                            Votre Panier
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                            <i className="fa-solid fa-times text-xl"></i>
                        </button>
                    </div>

                    {/* Items List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {items.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                                <i className="fa-solid fa-basket-shopping text-6xl mb-4"></i>
                                <p className="text-xl">Votre panier est vide</p>
                                <button
                                    onClick={onClose}
                                    className="mt-4 text-green-600 font-bold hover:underline"
                                >
                                    Continuer vos achats
                                </button>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="flex gap-4 group">
                                    <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0 border">
                                        <Image
                                            src={item.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800'}
                                            alt={item.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-gray-900">{item.name}</h4>
                                            <button
                                                onClick={() => onRemove(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <i className="fa-solid fa-trash-can"></i>
                                            </button>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-2">{item.variety}</p>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center border rounded-lg bg-gray-50">
                                                <button
                                                    onClick={() => onUpdateQuantity(item.id, -1)}
                                                    className="px-3 py-1 hover:bg-gray-200 transition-colors disabled:opacity-30"
                                                    disabled={item.cartQuantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="px-3 font-semibold">{item.cartQuantity}</span>
                                                <button
                                                    onClick={() => onUpdateQuantity(item.id, 1)}
                                                    className="px-3 py-1 hover:bg-gray-200 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <span className="font-bold text-green-700">
                                                {((item.price || 0) * item.cartQuantity).toLocaleString()} XAF
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="p-6 border-t bg-gray-50 space-y-4">
                            <div className="flex justify-between text-xl font-bold">
                                <span>Total</span>
                                <span className="text-green-700">{total.toLocaleString()} XAF</span>
                            </div>
                            <p className="text-xs text-gray-500 text-center">
                                Livraison gratuite dans tout Yaoundé pour les commandes &gt; 10,000 XAF.
                            </p>
                            <button
                                onClick={() => alert('Vers le checkout Stripe... (Simulation)')}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3"
                            >
                                Passer la commande
                                <i className="fa-solid fa-arrow-right"></i>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
