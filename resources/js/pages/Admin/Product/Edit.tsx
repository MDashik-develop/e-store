import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { Star, StarOff, Trash2 } from 'lucide-react';

export default function Edit({ product }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category_id: product.category_id,
        status: product.status.toString(),
        images: product.images || [],  // Images should be set from the server
        primary_image: product.primary_image || null,
    });

    const [previewImages, setPreviewImages] = useState(product.images.map(img => `/storage/${img.image}`)); // Initialize preview images from the product data
    const [deletedImages, setDeletedImages] = useState([]); // To track deleted images

    // Handle file selection and preview
    const handleFileChange = (e) => {
        const files = e.target.files;
        if (files) {
            const selectedFiles = Array.from(files);
            setData('images', selectedFiles);

            // Create preview URLs
            const previews = selectedFiles.map(file => URL.createObjectURL(file));
            setPreviewImages(previews);
        }
    };

    // Handle image deletion (both from preview and backend)
    const handleImageDelete = (index) => {
        const imageToDelete = previewImages[index]; // Get the image to delete from the preview
        const newPreviewImages = [...previewImages];
        newPreviewImages.splice(index, 1); // Remove from preview
        setPreviewImages(newPreviewImages);

        // Remove from form data (images array)
        const newFormImages = [...data.images];
        newFormImages.splice(index, 1);
        setData('images', newFormImages);

        // Add to deleted images list to be sent to the backend
        setDeletedImages([...deletedImages, imageToDelete]);
    };

    // Handle primary image selection
    const handlePrimaryImageSelect = (index) => {
        setData('primary_image', data.images[index]);
    };

    // Handle form submission (submit to update product)
    const submit = (e) => {
        e.preventDefault();

        put(`/admin/products/${product.id}`, {
            data: {
                ...data,
                deleted_images: deletedImages, // Send the deleted images
            },
            onSuccess: () => {
                reset(); // Reset form after success
                alert('Product updated successfully!');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Product" />
            <div className="h-full flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                    <h2 className="text-xl font-bold mb-4">Edit Product</h2>
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

                        <textarea
                            placeholder="Description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            required
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
                                            className={`w-24 h-24 object-cover rounded mt-2 ${data.primary_image === data.images[index] ? 'border-4 border-blue-500' : ''}`}
                                        />
                                        <div className="absolute top-[10px] right-[1px] p-1 rounded-full flex gap-[2px]">
                                            <button
                                                type="button"
                                                onClick={() => handlePrimaryImageSelect(index)}
                                                className="text-xs text-blue-500"
                                            >
                                                {data.primary_image === data.images[index] ? <Star className="h-[18px]" /> : <StarOff className="h-[18px]" />}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleImageDelete(index)}
                                                className="text-xs text-red-500 ml-2"
                                            >
                                                <Trash2 className="h-[18px]" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end gap-2">
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
