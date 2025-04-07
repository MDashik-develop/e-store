import { Link } from '@inertiajs/react';
import { ShoppingCart, User } from 'lucide-react';

export default function Header() {
    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <span className="text-2xl font-bold text-gray-800">Your Logo</span>
                    </Link>

                    {/* Navigation - Desktop */}
                    <nav className="hidden md:flex space-x-8">
                        <Link href="/" className="text-gray-600 hover:text-gray-900">
                            Home
                        </Link>
                        <Link href="/products" className="text-gray-600 hover:text-gray-900">
                            Products
                        </Link>
                        <Link href="/categories" className="text-gray-600 hover:text-gray-900">
                            Categories
                        </Link>
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        <Link href="/cart" className="text-gray-600 hover:text-gray-900">
                            <ShoppingCart className="h-6 w-6" />
                        </Link>
                        <Link href="/login" className="text-gray-600 hover:text-gray-900">
                            <User className="h-6 w-6" />
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            type="button"
                            className="text-gray-600 hover:text-gray-900"
                            onClick={() => {/* Add mobile menu toggle logic */}}
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className="hidden md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1">
                    <Link
                        href="/"
                        className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                    >
                        Home
                    </Link>
                    <Link
                        href="/products"
                        className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                    >
                        Products
                    </Link>
                    <Link
                        href="/categories"
                        className="block px-3 py-2 text-gray-600 hover:text-gray-900"
                    >
                        Categories
                    </Link>
                </div>
            </div>
        </header>
    );
}
