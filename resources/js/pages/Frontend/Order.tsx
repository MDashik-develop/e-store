// resources/js/Pages/OrderForm.jsx

import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function OrderForm() {
    const [form, setForm] = useState({
        customer_name: '',
        phone: '',
        address: '',
        total_amount: '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        router.post('/orders', form, {
            onError: (err) => {
                setErrors(err);
            },
            onSuccess: () => {
                alert('Order placed successfully!');
                setForm({
                    customer_name: '',
                    phone: '',
                    address: '',
                    total_amount: '',
                });
            }
        });
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Place an Order</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block mb-1">Product Name</label>
                    <input
                        type="text"
                        name="product_name"
                        value={form.customer_name}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.customer_name && (
                        <div className="text-red-500 text-sm">{errors.customer_name}</div>
                    )}
                </div>
                <div className="mb-4">
                    <label className="block mb-1">Customer Name</label>
                    <input
                        type="text"
                        name="customer_name"
                        value={form.customer_name}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.customer_name && (
                        <div className="text-red-500 text-sm">{errors.customer_name}</div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.phone && (
                        <div className="text-red-500 text-sm">{errors.phone}</div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Address</label>
                    <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    ></textarea>
                    {errors.address && (
                        <div className="text-red-500 text-sm">{errors.address}</div>
                    )}
                </div>

                <div className="mb-4">
                    <label className="block mb-1">Total Amount</label>
                    <input
                        type="number"
                        name="total_amount"
                        value={form.total_amount}
                        onChange={handleChange}
                        className="w-full border px-3 py-2 rounded"
                    />
                    {errors.total_amount && (
                        <div className="text-red-500 text-sm">{errors.total_amount}</div>
                    )}
                </div>

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
