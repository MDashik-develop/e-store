import { useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Star, Trash2 } from 'lucide-react';

export default function Edit({ product, categories }) {
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
        category_id: Array.isArray(product.category_id) ? product.category_id : [product.category_id], // Ensure it's an array
        status: product.status.toString(),
        images: [],
        primary_image: product.primary_image,
        deleted_images: [],
        size: product.size || [],
        color: product.color || [],
    });

    const [previewImages, setPreviewImages] = useState(initialImages);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setData('images', files);

        const previews = files.map(file => ({
            url: URL.createObjectURL(file),
            name: file.name,
        }));

        setPreviewImages([...initialImages, ...previews]);
    };

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

    const handlePrimaryImageSelect = (img) => {
        setData('primary_image', img.name);
    };

    const toggleSize = (sizeOption) => {
        const currentSizes = [...data.size];
        if (currentSizes.includes(sizeOption)) {
            setData('size', currentSizes.filter(s => s !== sizeOption));
        } else {
            setData('size', [...currentSizes, sizeOption]);
        }
    };

    const toggleColor = (color) => {
        const currentColors = [...data.color];
        if (currentColors.includes(color)) {
            setData('color', currentColors.filter(c => c !== color));
        } else {
            setData('color', [...currentColors, color]);
        }
    };

    const toggleCategory = (categoryId) => {
        const currentCategories = [...data.category_id];
        if (currentCategories.includes(categoryId)) {
            setData('category_id', currentCategories.filter(id => id !== categoryId));
        } else {
            setData('category_id', [...currentCategories, categoryId]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Ensure `size` and `category_id` are always arrays
        const size = Array.isArray(data.size) ? data.size : [data.size];
        const category_id = Array.isArray(data.category_id) ? data.category_id : [data.category_id];

        const formData = new FormData();
        formData.append('_method', 'put');
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('price', data.price);
        formData.append('stock', data.stock);
        formData.append('status', data.status);
        formData.append('primary_image', data.primary_image);
        formData.append('size', JSON.stringify(size)); // Ensure this is an array
        formData.append('color', JSON.stringify(data.color)); // Handle color field
        formData.append('category_id', JSON.stringify(category_id)); // Ensure this is an array

        data.images.forEach(file => {
            formData.append('images[]', file);
        });

        data.deleted_images.forEach(imageName => {
            formData.append('deleted_images[]', imageName);
        });

        post(`/admin/products/${product.id}`, {
            data: formData,
            forceFormData: true,
            onSuccess: () => alert('Product updated successfully!'),
            onError: (errors) => console.error(errors),
        });
    };

    return (
        <AppLayout>
            <Head title="Edit Product" />
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="p-6 bg-white rounded shadow space-y-4 max-w-xl mx-auto mt-10">
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

                <div>
                    <p className="mb-1 font-semibold">Select Sizes</p>
                    <div className="flex gap-2 flex-wrap">
                        {['S', 'M', 'L', 'XL', 'XXL'].map(size => (
                            <label
                                key={size}
                                className={`px-3 py-1 rounded border cursor-pointer ${data.size.includes(size) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                            >
                                <input
                                    type="checkbox"
                                    value={size}
                                    checked={data.size.includes(size)}
                                    onChange={() => toggleSize(size)}
                                    className="hidden"
                                />
                                {size}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="mb-1 font-semibold">Select Colors</p>
                    <div className="flex gap-2 flex-wrap">
                        {['Red', 'Blue', 'Green', 'Black', 'White'].map(color => (
                            <label
                                key={color}
                                className={`px-3 py-1 rounded border cursor-pointer ${data.color.includes(color) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                            >
                                <input
                                    type="checkbox"
                                    value={color}
                                    checked={data.color.includes(color)}
                                    onChange={() => toggleColor(color)}
                                    className="hidden"
                                />
                                {color}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="mb-1 font-semibold">Select Categories</p>
                    <div className="flex gap-2 flex-wrap">
                        {categories.map(category => (
                            <label
                                key={category.id}
                                className={`px-3 py-1 rounded border cursor-pointer ${data.category_id.includes(category.id) ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'}`}
                            >
                                <input
                                    type="checkbox"
                                    value={category.id}
                                    checked={data.category_id.includes(category.id)}
                                    onChange={() => toggleCategory(category.id)}
                                    className="hidden"
                                />
                                {category.name}
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="font-semibold">Images</p>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded"
                    />
                    <div className="mt-2 flex gap-2">
                        {previewImages.map((image, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={image.url}
                                    alt="Preview"
                                    className="h-24 object-cover rounded"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleImageDelete(index)}
                                    className="absolute top-0 right-0 text-white bg-black p-1 rounded"
                                >
                                    <Trash2 size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handlePrimaryImageSelect(image)}
                                    className={`absolute bottom-0 left-0 text-white bg-black p-1 rounded ${data.primary_image === image.name ? 'bg-green-500' : ''}`}
                                >
                                    {data.primary_image === image.name ? 'Primary' : 'Set Primary'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <Button type="submit" disabled={processing} className="w-full">
                    {processing ? 'Updating...' : 'Update Product'}
                </Button>
            </form>
        </AppLayout>
    );
}
