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
        size: [],
        color: [],
        category_id: [],
        status: '',
        images: [],
        primary_image: null,
    });

    const [colorInput, setColorInput] = useState('');
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
        setData('primary_image', index);
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
            setData('primary_image', data.primary_image - 1);
        }
    };

    const toggleSize = (sizeOption: string) => {
        const currentSizes = [...data.size];
        if (currentSizes.includes(sizeOption)) {
            setData('size', currentSizes.filter(s => s !== sizeOption));
        } else {
            setData('size', [...currentSizes, sizeOption]);
        }
    };

    const toggleCategory = (categoryId: number) => {
        const currentCategories = [...data.category_id];
        if (currentCategories.includes(categoryId)) {
            setData('category_id', currentCategories.filter(id => id !== categoryId));
        } else {
            setData('category_id', [...currentCategories, categoryId]);
        }
    };

    const handleColorKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const value = colorInput.trim();
            if (value && !data.color.includes(value)) {
                setData('color', [...data.color, value]);
                setColorInput('');
            }
        } else if (e.key === 'Backspace' && colorInput === '') {
            setData('color', data.color.slice(0, -1));
        }
    };

    const removeColor = (index: number) => {
        setData('color', data.color.filter((_, i) => i !== index));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/products', {
            onSuccess: () => {
                reset();
                setPreviewImages([]);
                setColorInput('');
            },
        });
    };

    return (
        <AppLayout>
            <Head title="Create Product" />
            <div className="h-full flex items-center justify-center bg-gray-100 p-4">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
                    <h2 className="text-xl font-bold mb-4">Create Product</h2>
                    <form onSubmit={submit} className="space-y-4" encType="multipart/form-data">
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={data.name}
                            onChange={(e) => {
                                setData('name', e.target.value);
                                setData('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'));
                            }}
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
                            type="number"
                            placeholder="Stock"
                            value={data.stock}
                            onChange={(e) => setData('stock', e.target.value)}
                            required
                            className="w-full p-2 border rounded"
                        />

                        {/* Size selection */}
                        <div>
                            <p className="mb-1 font-semibold">Select Sizes</p>
                            <div className="flex gap-2 flex-wrap">
                                {['S', 'M', 'L', 'XL', 'XXL'].map((sizeOption) => (
                                    <label
                                        key={sizeOption}
                                        className={`px-3 py-1 rounded border cursor-pointer ${
                                            data.size.includes(sizeOption)
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'bg-white text-gray-700'
                                        }`}
                                    >
                                        <input
                                            type="checkbox"
                                            value={sizeOption}
                                            checked={data.size.includes(sizeOption)}
                                            onChange={() => toggleSize(sizeOption)}
                                            className="hidden"
                                        />
                                        {sizeOption}
                                    </label>
                                ))}
                            </div>
                            {errors.size && <p className="text-red-500">{errors.size}</p>}
                        </div>

                        {/* Category selection */}
                        <div>
                            <p className="mb-1 font-semibold">Select Categories</p>
                            <div className="flex gap-2 flex-wrap">
                                {categories.map((category) => (
                                    <label
                                        key={category.id}
                                        className={`px-3 py-1 rounded border cursor-pointer ${
                                            data.category_id.includes(category.id)
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'bg-white text-gray-700'
                                        }`}
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
                            {errors.category_id && <p className="text-red-500">{errors.category_id}</p>}
                        </div>

                        <textarea
                            placeholder="Description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full p-2 border rounded"
                        ></textarea>

                        {/* Tag-style Color Input */}
                        <div>
                            <p className="mb-1 font-semibold">Colors</p>
                            <div
                                className="flex flex-wrap items-center border rounded p-2 min-h-[44px] focus-within:ring-2 ring-blue-300"
                                onClick={() => document.getElementById('color-input')?.focus()}
                            >
                                {data.color.map((color, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center bg-blue-100 text-blue-800 rounded px-2 py-1 text-sm mr-2 mb-2"
                                    >
                                        <span>{color}</span>
                                        <button
                                            type="button"
                                            className="ml-1 text-blue-600 font-bold"
                                            onClick={() => removeColor(index)}
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                                <input
                                    id="color-input"
                                    type="text"
                                    className="flex-1 min-w-[120px] border-none focus:outline-none p-1"
                                    placeholder="Type color and press Enter"
                                    value={colorInput}
                                    onChange={(e) => setColorInput(e.target.value)}
                                    onKeyDown={handleColorKeyDown}
                                />
                            </div>
                            {errors.color && <p className="text-red-500">{errors.color}</p>}
                        </div>

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
                                            className={`w-24 h-24 object-cover rounded mt-2 ${
                                                data.primary_image === index ? 'border-4 border-blue-500' : ''
                                            }`}
                                        />
                                        <div className="absolute top-[10px] right-[1px] p-1 rounded-full flex gap-[2px]">
                                            <button
                                                type="button"
                                                onClick={() => handlePrimaryImageSelect(index)}
                                                className="text-xs text-blue-500"
                                            >
                                                {data.primary_image === index ? (
                                                    <Star className="h-[18px]" />
                                                ) : (
                                                    <StarOff className="h-[18px]" />
                                                )}
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

                        <div className="flex justify-end">
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
