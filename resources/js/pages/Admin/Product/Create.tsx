import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Star, StarOff, Trash2 } from 'lucide-react';

export default function Create({ categories }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: '',
        price: '',
        stock: '',
        category_id: '',
        status: '',
        images: [],
        primary_image: null,
    });

    const [previewImages, setPreviewImages] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            const selectedFiles = Array.from(files);
            setData('images', selectedFiles);

            const previews = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviewImages(previews);
        }
    };

    const handlePrimaryImageSelect = (index: number) => {
        setData('primary_image', index); // ✅ Send index instead of File
    };

    const handleImageDelete = (index: number) => {
        const newPreviewImages = [...previewImages];
        const newImages = [...data.images];
        newPreviewImages.splice(index, 1);
        newImages.splice(index, 1);

        setPreviewImages(newPreviewImages);
        setData('images', newImages);

        if (data.primary_image === index) {
            setData('primary_image', null);
        } else if (data.primary_image && data.primary_image > index) {
            setData('primary_image', data.primary_image - 1); // shift index
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/products', {
            onSuccess: () => {
                reset();
                setPreviewImages([]);
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Create Product" />
            <div className="h-full flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-bold mb-4">Create Product</h2>
                    <form onSubmit={submit} encType="multipart/form-data" className="space-y-4">
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

                        {categories.length > 0 ? (
                            <select
                                value={data.category_id}
                                onChange={(e) => setData('category_id', e.target.value)}
                                required
                                className="w-full p-2 border rounded"
                            >
                                <option value="">Select Category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <div className="p-2 border rounded text-gray-500 bg-gray-50 text-center">
                                No categories found. Please create a category first.
                            </div>
                        )}

                        <textarea
                            placeholder="Description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full p-2 border rounded"
                        ></textarea>

                        <input
                            type="number"
                            placeholder="Stock"
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />

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

                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full p-2 border rounded"
                        />

                        {previewImages.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {previewImages.map((src, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={src}
                                            alt={`Preview ${index}`}
                                            className={`w-24 h-24 object-cover rounded mt-2 ${data.primary_image === index ? 'border-4 border-blue-500' : ''}`}
                                        />
                                        <div className="absolute top-[10px] right-[1px] p-1 rounded-full flex gap-[2px]">
                                            <button
                                                type="button"
                                                onClick={() => handlePrimaryImageSelect(index)}
                                                className="text-xs text-blue-500"
                                            >
                                                {data.primary_image === index ? <Star className="h-[18px]" /> : <StarOff className="h-[18px]" />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleImageDelete(index)}
                                                className="text-xs text-red-500 ml-2"
                                            >
                                                <Trash2 className='h-[18px]' />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

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
