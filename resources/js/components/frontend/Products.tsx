const Products = ({ products }) => {
    return (
        <section>
            <div className="py-16">
                <h2 className="mb-6 text-2xl font-extrabold text-gray-900 text-center">Featured Products</h2>
                <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {products.map((product) => (
                        <div key={product.id} className="group relative">
                            <div className="h-64 w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                                <img                    
                                    src={`/storage/${product.images[0].image}`}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">{product.name}</h3>
                            <div className="mt-1 flex items-center justify-between">
                                <p className="text-sm text-gray-500">${product.price ?? '19.99'}</p>
                                <button className="text-sm font-medium px-2.5 py-1 rounded-[5px] bg-blue-600 hover:bg-blue-500 text-white">
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Products;
