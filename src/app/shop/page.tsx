'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '@/components/features/ProductCard';
import CartSidebar from '@/components/features/CartSidebar';
import { GardenProduct } from '@/types';
import { db } from '@/lib/firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

interface CartItem extends GardenProduct {
    cartQuantity: number;
}

export default function ShopPage() {
    const [products, setProducts] = useState<GardenProduct[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Load products from Firestore
    useEffect(() => {
        async function loadProducts() {
            try {
                const prodRef = collection(db, 'garden_products');
                const q = query(prodRef, where('inStock', '==', true));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as GardenProduct[];

                // Seed some mock data if Firestore is empty for initial UI testing
                if (data.length === 0) {
                    setProducts([
                        { id: '1', name: 'Tomates Cœur de Bœuf', variety: 'Bio - Ancienne', description: 'Chair ferme et savoureuse.', price: 1500, stock: 50, inStock: true, category: 'legume', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800' },
                        { id: '2', name: 'Poivre de Penja', variety: 'Blanc Premium', description: 'Le meilleur poivre du monde.', price: 4500, stock: 20, inStock: true, category: 'epice', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?q=80&w=800' },
                        { id: '3', name: 'Basilic Grand Vert', variety: 'Genovese', description: 'Idéal pour le pesto.', price: 500, stock: 100, inStock: true, category: 'aromate', image: 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?q=80&w=800' },
                        { id: '4', name: 'Poulet Fermier', variety: 'Local', description: 'Élevé en plein air.', price: 6500, stock: 15, inStock: true, category: 'elevage', image: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?q=80&w=800' },
                    ]);
                } else {
                    setProducts(data);
                }
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, []);

    const addToCart = (product: GardenProduct) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, cartQuantity: item.cartQuantity + 1 } : item
                );
            }
            return [...prev, { ...product, cartQuantity: 1 }];
        });
        setIsSidebarOpen(true);
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item =>
            item.id === id ? { ...item, cartQuantity: Math.max(1, item.cartQuantity + delta) } : item
        ));
    };

    const removeFromCart = (id: string) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const cartCount = cart.reduce((sum, item) => sum + item.cartQuantity, 0);

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="container mx-auto px-4">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A2463] mb-3">
                            L'Épicerie SelecTED
                        </h1>
                        <p className="text-xl text-gray-600">
                            Des produits ultra-frais, traçables et responsables.
                        </p>
                    </div>

                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="group relative flex items-center gap-3 bg-white border-2 border-green-600 text-green-700 font-bold px-6 py-3 rounded-full hover:bg-green-600 hover:text-white transition-all shadow-md"
                    >
                        <i className="fa-solid fa-cart-shopping text-xl"></i>
                        <span>Votre Panier</span>
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 flex items-center justify-center rounded-full border-2 border-white animate-bounce-short">
                                {cartCount}
                            </span>
                        )}
                    </button>
                </div>

                {/* Categories Banner */}
                <div className="flex overflow-x-auto pb-6 gap-4 mb-12 no-scrollbar">
                    {['Tout', 'Légumes', 'Épices', 'Aromates', 'Élevage', 'Épicerie Fine'].map((cat) => (
                        <button
                            key={cat}
                            className={`px-6 py-2 rounded-full whitespace-nowrap font-semibold transition-all shadow-sm ${cat === 'Tout' ? 'bg-[#0A2463] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                onAddToCart={addToCart}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && products.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                        <i className="fa-solid fa-seedling text-6xl text-gray-200 mb-4 scale-x-[-1]"></i>
                        <h3 className="text-2xl font-bold text-gray-400">Aucun produit disponible actuellement</h3>
                        <p className="text-gray-400">Revenez bientôt pour la prochaine récolte !</p>
                    </div>
                )}
            </div>

            <CartSidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                items={cart}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
            />
        </div>
    );
}
