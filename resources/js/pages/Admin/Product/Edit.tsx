import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Star, StarOff, Trash2 } from 'lucide-react';

export default function Edit({ product }) {
    const initialImages = product.images.map(img => ({
        url: `/storage/${img.image}`,
        name: img.image,
    }));

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category_id: product.category_id,
        status: product.status.toString(),
        images: [],
        primary_image: product.primary_image,
        deleted_images: [],
    });

    const [previewImages, setPreviewImages] = useState(initialImages);

    // Handle file changes and display previews
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setData('images', files);

        const previews = files.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name,
        }));

        setPreviewImages([...initialImages, ...previews]);
    };

    // Handle image deletion
    const handleImageDelete = (index) => {
        const img = previewImages[index];
        setPreviewImages(previewImages.filter((_, i) => i !== index));

        if (!img.url.startsWith('blob:')) {
            setData('deleted_images', [...data.deleted_images, img.name]);
        } else {
            const remainingFiles = data.images.filter(file => file.name !== img.name);
            setData('images', remainingFiles);
        }
    };

    // Handle selecting the primary image
    const handlePrimaryImageSelect = (img) => {
        setData('primary_image', img.name);
    };

    // Submit the form
    const submit = (e) => {
        e.preventDefault();

        // Create a new FormData instance
        const formData = new FormData();
        formData.append('_method', 'put');  // To ensure the PUT request
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('stock', data.stock);
        formData.append('category_id', data.category_id);
        formData.append('status', data.status);
        formData.append('primary_image', data.primary_image);

        // Append images if any
        data.images.forEach(file => {
            formData.append('images[]', file);
        });

        // Append deleted images
        data.deleted_images.forEach(imageName => {
            formData.append('deleted_images[]', imageName);
        });

        // Send the POST request
        post(`/admin/products/${product.id}`, {
            data: formData,
            forceFormData: true,
            onSuccess: () => alert('Product updated successfully!'),
            onError: (errors) => {
                console.error(errors); // Optionally log errors to console
            }
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Product" />
            <form onSubmit={submit} encType="multipart/form-data" className="p-6 bg-white rounded shadow space-y-4 max-w-xl mx-auto mt-10">
                <input
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Name"
                    className="w-full p-2 border rounded"
                />
                <textarea
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    placeholder="Description"
                    className="w-full p-2 border rounded"
                />
                <input
                    value={data.price}
                    onChange={(e) => setData('price', e.target.value)}
                    type="number"
                    placeholder="Price"
                    className="w-full p-2 border rounded"
                />
                <input
                    value={data.stock}
                    onChange={(e) => setData('stock', e.target.value)}
                    type="number"
                    placeholder="Stock"
                    className="w-full p-2 border rounded"
                />

                <select
                    value={data.status}
                    onChange={(e) => setData('status', e.target.value)}
                    className="w-full p-2 border rounded"
                >
                    <option value="">Select Status</option>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                </select>

                <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="w-full p-2 border rounded"
                />
                {errors.images && <div className="text-red-500">{errors.images}</div>}

                <div className="flex flex-wrap gap-2">
                    {previewImages.map((img, idx) => (
                        <div key={idx} className="relative">
                            <img
                                src={img.url}
                                className={`w-24 h-24 object-cover rounded ${data.primary_image === img.name ? 'border-4 border-blue-500' : ''}`}
                            />
                            <div className="absolute top-1 right-1 flex gap-1">
                                <button type="button" onClick={() => handlePrimaryImageSelect(img)}>
                                    <Star className="w-5 h-5 text-blue-600" />
                                </button>
                                <button type="button" onClick={() => handleImageDelete(idx)}>
                                    <Trash2 className="w-5 h-5 text-red-600" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <Button type="submit" disabled={processing}>
                    {processing ? 'Updating...' : 'Update Product'}
                </Button>
            </form>
        </AppLayout>
    );
}
