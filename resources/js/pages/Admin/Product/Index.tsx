import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { FilePenLine, Trash2, Plus } from "lucide-react";

export default function Index({ products: initialProducts }) {
    const [products, setProducts] = useState(initialProducts);
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this product?")) {
            destroy(`/admin/products/${id}`, {
                onSuccess: () => {
                    setProducts(products.filter((product) => product.id !== id));
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Products" />
            <div className="p-6 bg-white rounded shadow">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Products</h2>
                    <Link href="/admin/products/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Product
                        </Button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-200 text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-center">
                                <th className="border px-2 py-2 text-center">ID</th>
                                <th className="border px-3 py-2 text-center">Image</th>
                                <th className="border px-4 py-2 text-center">Name</th>
                                <th className="border px-4 py-2 text-center">Status</th>
                                <th className="border px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <tr key={product.id} className="text-center">
                                        <td className="border py-2">{product.id}</td>
                                        <td className="border py-2">
                                            {product.images?.[0]?.image ? (
                                                <div className="flex justify-center">
                                                    <img
                                                        src={`/storage/${product.images[0].image}`}
                                                        alt={product.name}
                                                        className="h-14 w-14 object-cover rounded"
                                                        onError={(e) =>
                                                            (e.currentTarget.src = '/placeholder.jpg')
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">No Image</span>
                                            )}
                                        </td>
                                        <td className="border py-2">{product.name}</td>
                                        <td className="border py-2">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                    product.status
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {product.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="border py-2">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/admin/products/${product.id}/edit`}
                                                >
                                                    <Button size="icon" variant="outline">
                                                        <FilePenLine className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    onClick={() => handleDelete(product.id)}
                                                    size="icon"
                                                    variant="destructive"
                                                    disabled={processing}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">
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
