import { useState } from "react";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";

export default function Index({ categories: initialCategories }) {
    const [categories, setCategories] = useState(initialCategories); // ✅ Local state
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id) => {
        if (confirm("Are you sure you want to delete this category?")) {
            destroy(`/admin/categories/${id}`, {
                onSuccess: () => {
                    setCategories(categories.filter((category) => category.id !== id)); // ✅ Remove from UI
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Categories" />

            <div className="p-6 bg-white rounded shadow">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Categories</h2>
                    <Link href="/admin/categories/create">
                        <Button>Add New Category</Button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border px-4 py-2">ID</th>
                                <th className="border px-4 py-2">Name</th>
                                <th className="border px-4 py-2">Slug</th>
                                <th className="border px-4 py-2">Status</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <tr key={category.id} className="text-center">
                                        <td className="border px-4 py-2">{category.id}</td>
                                        <td className="border px-4 py-2">{category.name}</td>
                                        <td className="border px-4 py-2">{category.slug}</td>
                                        <td className="border px-4 py-2">
                                            {category.status ? (
                                                <span className="text-green-600">Active</span>
                                            ) : (
                                                <span className="text-red-600">Inactive</span>
                                            )}
                                        </td>
                                        <td className="border px-4 py-2 flex justify-center gap-2">
                                            <Link href={`/admin/categories/${category.id}/edit`}>
                                                <Button>Edit</Button>
                                            </Link>
                                            <Button
                                                onClick={() => handleDelete(category.id)}
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
                                    <td colSpan="5" className="text-center p-4">
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
