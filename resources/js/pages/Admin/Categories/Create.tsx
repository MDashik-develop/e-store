import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        status: '',
        image: null, // <-- image field
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/categories', {
            forceFormData: true, // important for file upload
            onSuccess: () => reset(),
        });
    };

    return (
        <AppLayout>
            <Head title="Create Categories" />
            <div className="h-full flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-bold mb-4">Create Categories</h2>
                    <form onSubmit={submit} className="space-y-4">
                        <input
                            type="text"
                            placeholder="Category Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}

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

                        {/* Image Upload Field */}
                        <input
                            type="file"
                            onChange={(e) => setData('image', e.target.files[0])}
                            className="w-full"
                        />
                        {errors.image && <p className="text-red-500">{errors.image}</p>}

                        <div className="flex justify-end gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : 'Create Category'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
