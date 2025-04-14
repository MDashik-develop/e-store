import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Order({ products }) {
    const availableSizes = Array.isArray(products.size)
        ? products.size
        : (typeof products.size === 'string' ? JSON.parse(products.size) : []);

    const availableColors = Array.isArray(products.color)
        ? products.color
        : (typeof products.color === 'string' ? JSON.parse(products.color) : []);

    const [form, setForm] = useState({
        product_name: products.name,
        product_id: products.id,
        product_description: products.description,
        customer_name: '',
        email: '',
        phone: '',
        address: '',
        shipping_address: '',
        price: products.price || 0,
        quantity: 1,
        total_amount: products.price || 0,
        size: [],
        color: [],
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedForm = { ...form, [name]: value };

        if (name === 'price' || name === 'quantity') {
            const price = parseFloat(updatedForm.price) || 0;
            const quantity = parseInt(updatedForm.quantity) || 0;
            updatedForm.total_amount = price * quantity;
        }

        setForm(updatedForm);
    };

    const changeQuantity = (delta) => {
        const newQty = Math.max(1, form.quantity + delta);
        setForm({
            ...form,
            quantity: newQty,
            total_amount: form.price * newQty,
        });
    };

    const toggleMultiSelect = (field, value) => {
        const updated = form[field].includes(value)
            ? form[field].filter((v) => v !== value)
            : [...form[field], value];
        setForm({ ...form, [field]: updated });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        router.post('/admin/orders', form, {
            onError: (err) => {
                setErrors(err);
            },
            onSuccess: () => {
                alert('Order placed successfully!');
                setForm({
                    product_name: products.name,
                    product_id: products.id,
                    product_description: products.description,
                    customer_name: '',
                    email: form.email,
                    phone: form.phone,
                    address: form.address,
                    shipping_address: form.shipping_address,
                    price: products.price || 0,
                    quantity: 1,
                    total_amount: products.price || 0,
                    size: [],
                    color: [],
                });
            }
        });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Place an Order</h2>
            <form onSubmit={handleSubmit}>

                {/* Product Name */}
                <div className="mb-4">
                    <label className="block mb-1">Product Name</label>
                    <input
                        type="text"
                        name="name"
                        value={form.product_name}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.product_name && <div className="text-red-500 text-sm">{errors.product_name}</div>}
                </div>

                {/* Customer Name */}
                <div className="mb-4">
                    <label className="block mb-1">Customer Name</label>
                    <input
                        type="text"
                        name="customer_name"
                        value={form.customer_name}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.customer_name && <div className="text-red-500 text-sm">{errors.customer_name}</div>}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="block mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.email && <div className="text-red-500 text-sm">{errors.email}</div>}
                </div>

                {/* Phone */}
                <div className="mb-4">
                    <label className="block mb-1">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.phone && <div className="text-red-500 text-sm">{errors.phone}</div>}
                </div>

                {/* Billing Address */}
                <div className="mb-4">
                    <label className="block mb-1">Billing Address</label>
                    <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    ></textarea>
                    {errors.address && <div className="text-red-500 text-sm">{errors.address}</div>}
                </div>

                {/* Shipping Address */}
                <div className="mb-4">
                    <label className="block mb-1">Shipping Address</label>
                    <textarea
                        name="shipping_address"
                        value={form.shipping_address}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    ></textarea>
                    {errors.shipping_address && <div className="text-red-500 text-sm">{errors.shipping_address}</div>}
                </div>

                {/* Price & Quantity */}
                <div className="flex gap-2 justify-between">
                    <div className="mb-4 w-7/12">
                        <label className="block mb-1">Price</label>
                        <input
                            type="number"
                            name="price"
                            value={form.price}
                            onChange={handleChange}
                            className="w-full border px-3 py-2 rounded"
                        />
                        {errors.price && <div className="text-red-500 text-sm">{errors.price}</div>}
                    </div>

                    <div className="mb-4 w-5/12">
                        <label className="block mb-1">Quantity</label>
                        <div className="flex items-center gap-2">
                            <button type="button" onClick={() => changeQuantity(-1)} className="px-3 py-1 bg-gray-300 rounded">−</button>
                            <input
                                type="number"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                className="w-16 text-center border px-2 py-1 rounded"
                                min="1"
                            />
                            <button type="button" onClick={() => changeQuantity(1)} className="px-3 py-1 bg-gray-300 rounded">+</button>
                        </div>
                        {errors.quantity && <div className="text-red-500 text-sm">{errors.quantity}</div>}
                    </div>
                </div>

                {/* Total Amount */}
                <div className="mb-4">
                    <label className="block mb-1">Total Amount</label>
                    <input
                        type="number"
                        name="total_amount"
                        value={form.total_amount}
                        readOnly
                        className="w-full border px-3 py-2 rounded bg-gray-100"
                    />
                    {errors.total_amount && <div className="text-red-500 text-sm">{errors.total_amount}</div>}
                </div>

                {/* Size Select */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Select Sizes</label>
                    <div className="flex flex-wrap gap-2">
                        {availableSizes.map((size) => (
                            <div key={size}>
                                <input
                                    type="checkbox"
                                    id={`size-${size}`}
                                    className="hidden"
                                    checked={form.size.includes(size)}
                                    onChange={() => toggleMultiSelect('size', size)}
                                />
                                <label
                                    htmlFor={`size-${size}`}
                                    className={`px-3 py-1 rounded border text-sm cursor-pointer ${
                                        form.size.includes(size) ? 'bg-blue-500 text-white' : 'bg-white text-gray-800'
                                    }`}
                                >
                                    {size}
                                </label>
                            </div>
                        ))}
                    </div>
                    {errors.size && <div className="text-red-500 text-sm">{errors.size}</div>}
                </div>

                {/* Color Select */}
                <div className="mb-4">
                    <label className="block mb-1 font-medium">Select Colors</label>
                    <div className="flex flex-wrap gap-2">
                        {availableColors.map((color) => (
                            <div key={color}>
                                <input
                                    type="checkbox"
                                    id={`color-${color}`}
                                    className="hidden"
                                    checked={form.color.includes(color)}
                                    onChange={() => toggleMultiSelect('color', color)}
                                />
                                <label
                                    htmlFor={`color-${color}`}
                                    className={`px-3 py-1 rounded border text-sm cursor-pointer ${
                                        form.color.includes(color) ? 'bg-green-500 text-white' : 'bg-white text-gray-800'
                                    }`}
                                >
                                    {color}
                                </label>
                            </div>
                        ))}
                    </div>
                    {errors.color && <div className="text-red-500 text-sm">{errors.color}</div>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Submit Order
                </button>
            </form>
        </div>
    );
}
