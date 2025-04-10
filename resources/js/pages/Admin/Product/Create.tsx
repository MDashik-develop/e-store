import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Star, StarOff, Trash2 } from 'lucide-react';

export default function Edit({ product, categories }) {
    const { data, setData, put, processing, errors } = useForm({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        category_id: product.category_id || '',
        status: product.status.toString(),
        images: [],
        primary_image: null,
    });

    const [previewImages, setPreviewImages] = useState([]);
    const [existingImages, setExistingImages] = useState(product.images || []);

    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files) {
            const selectedFiles = Array.from(files);
            setData('images', selectedFiles);
            const previews = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviewImages(previews);
        }
    };

    const handlePrimaryImageSelect = (index, isExisting = false) => {
        const image = isExisting ? existingImages[index] : data.images[index];
        setData('primary_image', image);
    };

    const handleImageDelete = (index, isExisting = false) => {
        if (isExisting) {
            const updated = [...existingImages];
            const deletedImage = updated.splice(index, 1)[0];
            setExistingImages(updated);
            if (data.primary_image === deletedImage) {
                setData('primary_image', null);
            }
        } else {
            const updatedPreview = [...previewImages];
            const updatedImages = [...data.images];
            const deletedImage = updatedImages.splice(index, 1)[0];
            updatedPreview.splice(index, 1);
            setPreviewImages(updatedPreview);
            setData('images', updatedImages);
            if (data.primary_image === deletedImage) {
                setData('primary_image', null);
            }
        }
    };

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/products/${product.id}`, {
            onSuccess: () => alert('Product updated successfully!'),
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Product" />
            <div className="h-full flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                    <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                    <form onSubmit={submit} encType="multipart/form-data" className="space-y-4">
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />
                        {errors.name && <p className="text-red-500">{errors.name}</p>}

                        <input
                            type="number"
                            placeholder="Price"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />

                        <textarea
                            placeholder="Description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        ></textarea>

                        <input
                            type="number"
                            placeholder="Stock"
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        />

                        <select
                            value={data.category_id}
                            onChange={(e) => setData('category_id', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={data.status}
                            onChange={(e) => setData('status', e.target.value)}
                            className="w-full p-2 border rounded"
                            required
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

                        {/* Existing Images */}
                        {existingImages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {existingImages.map((src, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={src}
                                            alt=""
                                            className={`w-24 h-24 object-cover rounded border-2 ${data.primary_image === src ? 'border-blue-500' : 'border-gray-300'}`}
                                        />
                                        <div className="absolute top-1 right-1 flex gap-1">
                                            <button
                                                type="button"
                                                onClick={() => handlePrimaryImageSelect(index, true)}
                                                className="text-blue-600"
                                            >
                                                {data.primary_image === src ? <Star className="h-5" /> : <StarOff className="h-5" />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleImageDelete(index, true)}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* New Images Preview */}
                        {previewImages.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                                {previewImages.map((src, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={src}
                                            alt=""
                                            className={`w-24 h-24 object-cover rounded border-2 ${data.primary_image === data.images[index] ? 'border-blue-500' : 'border-gray-300'}`}
                                        />
                                        <div className="absolute top-1 right-1 flex gap-1">
                                            <button
                                                type="button"
                                                onClick={() => handlePrimaryImageSelect(index)}
                                                className="text-blue-600"
                                            >
                                                {data.primary_image === data.images[index] ? <Star className="h-5" /> : <StarOff className="h-5" />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleImageDelete(index)}
                                                className="text-red-600"
                                            >
                                                <Trash2 className="h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Updating...' : 'Update Product'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
