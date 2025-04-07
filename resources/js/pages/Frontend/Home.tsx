import { Head } from '@inertiajs/react';
import FrontendLayout from '@/layouts/frontend-layoue';
import Carusel from '@/components/frontend/Carusel';
import CaruselCategory from '@/components/frontend/CaruselCategory';

export default function Home() {
    return (
        <FrontendLayout>
            <Head title="Home" />

            <div className="bg-white">

                <Carusel />
                <CaruselCategory />

                {/* Hero Section */}
                <div className="relative bg-gray-900">
                    <div className="absolute inset-0">
                        <img
                            className="w-full h-full object-cover"
                            src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
                            alt="Hero"
                        />
                        <div className="absolute inset-0 bg-gray-900 mix-blend-multiply" />
                    </div>
                    <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
                        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Welcome to Our Store
                        </h1>
                        <p className="mt-6 text-xl text-gray-300 max-w-3xl">
                            Discover our collection of trendy and comfortable clothing.
                        </p>
                    </div>
                </div>

                {/* Featured Products */}
                <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-6">
                        Featured Products
                    </h2>
                    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {/* Product cards will go here */}
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
