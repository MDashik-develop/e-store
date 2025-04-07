import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function Index({ products: initialProducts }) {
    const [products, setProducts] = useState(initialProducts); // ✅ Fixed state setter
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this product?")) {
            destroy(`/admin/products/${id}`, {
                onSuccess: () => {
                    setProducts(products.filter((product) => product.id !== id)); // ✅ Fixed function
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Products" />

            <div className="p-6 bg-white rounded shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Products</h2>
                    <Link href="/admin/products/create">
                        <Button>Add New Product</Button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Status</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id} className="text-center">
                                        <td className="border px-4 py-2">{product.id}</td>
                                        <td className="border px-4 py-2">{product.name}</td>
                                        <td className="border px-4 py-2">
                                            {product.status ? (
                                                <span className="text-green-600">Active</span>
                                            ) : (
                                                <span className="text-red-600">Inactive</span>
                                            )}
                                        </td>
                                        <td className="border px-4 py-2 flex justify-center gap-2">
                                            <Link href={`/admin/products/${product.id}/edit`}>
                                                <Button>Edit</Button>
                                            </Link>
                                            <Button
                                                onClick={() => handleDelete(product.id)}
                                                disabled={processing}
                                                className="bg-red-500 hover:bg-red-600"
                                            >
                                                {processing ? "Deleting..." : "Delete"}
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center p-4">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
