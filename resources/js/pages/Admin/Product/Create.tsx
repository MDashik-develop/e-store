import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        status: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/products', {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Create Product" />
            <div className="h-full flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-bold mb-4">Create Product</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}

                        <input
                            type="number"
                            placeholder="Price"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                        {errors.price && <p className="text-red-500">{errors.price}</p>}

                        <input
                            type="text"
                            placeholder="Category ID"
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                        {errors.category_id && <p className="text-red-500">{errors.category_id}</p>}

                        <textarea
                            placeholder="Description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        ></textarea>
                        {errors.description && <p className="text-red-500">{errors.description}</p>}

                        <input
                            type="number"
                            placeholder="Stock"
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                        {errors.stock && <p className="text-red-500">{errors.stock}</p>}

                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Select Status</option>
                            <option value="1">Active</option>
                            <option value="0">Inactive</option>
                        </select>
                        {errors.status && <p className="text-red-500">{errors.status}</p>}

                        <div className="flex justify-end gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Product'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
