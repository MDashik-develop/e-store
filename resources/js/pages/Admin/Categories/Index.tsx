import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Edit3, Trash2, Plus } from 'lucide-react';

export default function Index({ categories: initialCategories }) {
    const [categories, setCategories] = useState(initialCategories);
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            destroy(`/admin/categories/${id}`, {
                onSuccess: () =>
                    setCategories(categories.filter((c) => c.id !== id)),
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Categories" />
            <div className="p-6 bg-white rounded shadow">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Categories</h2>
                    <Link href="/admin/categories/create">
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Category
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
                                <th className="border px-4 py-2 text-center">Slug</th>
                                <th className="border px-4 py-2 text-center">Status</th>
                                <th className="border px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <tr key={category.id} className="text-center">
                                        <td className="border py-2">{category.id}</td>
                                        <td className="border py-2">
                                            {category.image ? (
                                                <div className="flex justify-center">
                                                    <img
                                                        src={`/storage/${category.image}`}
                                                        alt={category.name}
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
                                        <td className="border py-2">{category.name}</td>
                                        <td className="border py-2">{category.slug}</td>
                                        <td className="border py-2">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                    category.status
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}
                                            >
                                                {category.status ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="border py-2">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/admin/categories/${category.id}/edit`}
                                                >
                                                    <Button size="icon" variant="outline">
                                                        <Edit3 className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    onClick={() => handleDelete(category.id)}
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
                                    <td colSpan={6} className="p-4 text-center text-gray-500">
                                        No categories found.
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
