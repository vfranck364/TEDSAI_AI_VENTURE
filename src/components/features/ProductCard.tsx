'use client';

import { GardenProduct } from '@/types';
import Image from 'next/image';

interface ProductCardProps {
    product: GardenProduct;
    onAddToCart: (product: GardenProduct) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group border border-gray-100">
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src={product.image || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {!product.inStock && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">Rupture de stock</span>
                    </div>
                )}
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.variety}</p>
                    </div>
                    <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                        {product.category}
                    </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    Récolté frais dans nos jardins urbains selon les principes de l'agriculture régénératrice.
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-700">
                        {product.price ? `${product.price.toLocaleString()} XAF` : 'Prix sur demande'}
                    </span>

                    <button
                        onClick={() => onAddToCart(product)}
                        disabled={!product.inStock}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed group"
                    >
                        <i className="fa-solid fa-cart-plus transition-transform group-hover:scale-120"></i>
                        Ajouter
                    </button>
                </div>
            </div>
        </div>
    );
}
