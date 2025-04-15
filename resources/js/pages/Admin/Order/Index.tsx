import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FilePenLine, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

export default function Index({ orders: initialOrders }) {
    const [orders, setProducts] = useState(initialOrders);
    const { delete: destroy, processing } = useForm();

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this order?')) {
            destroy(`/admin/orders/${id}`, {
                onSuccess: () => {
                    setProducts(orders.filter((order) => order.id !== id));
                },
            });
        }
    };

    return (
        <AppLayout>
            <Head title="Orders" />
            <div className="rounded bg-white p-6 shadow">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Orders</h2>
                    <Link href="/admin/orders/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Order
                        </Button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-200 text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-center">
                                <th className="border px-2 py-2 text-center">ID</th>
                                {/* <th className="border px-2 py-2 text-center">Image</th> */}
                                <th className="border px-2 py-2 text-center">Name</th>
                                <th className="border py-2 text-center">Size</th>
                                <th className="border py-2 text-center">Color</th>
                                <th className="border py-2 text-center">Price</th>
                                <th className="border py-2 text-center">Total</th>
                                <th className="border px-2 py-2 text-center">Status</th>
                                <th className="border px-4 py-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id} className="text-center hover:bg-gray-50">
                                        <td className="border py-2">{order.id}</td>
                                        {/* <td className="border py-2">
                                            {product.images?.[0]?.image ? (
                                                <div className="flex justify-center">
                                                    <img
                                                        src={`/storage/${product.images[0].image}`}
                                                        alt={product.name}
                                                        className="h-14 w-14 object-cover rounded"
                                                        onError={(e) =>
                                                            (e.currentTarget.src = '/placeholder.jpg')
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">No Image</span>
                                            )}
                                        </td> */}
                                        <td className="border py-2">{order.product_name}</td>
                                        <td className="border py-2">
                                            {Array.isArray(JSON.parse(order.product_size)) &&
                                                JSON.parse(order.product_size).map((size, index, arr) => (
                                                    <span key={index}>
                                                        {size}
                                                        {index < arr.length - 1 && ', '}
                                                    </span>
                                                ))}
                                        </td>

                                        <td className="border py-2">
                                            {(() => {
                                                try {
                                                    const colors = JSON.parse(order.product_color);
                                                    return (
                                                        Array.isArray(colors) &&
                                                        colors.map((color, index) => (
                                                            <span key={index} className="mr-1 inline-block capitalize">
                                                                <span
                                                                    className={`mr-1 inline-block h-3 w-3 rounded-full`}
                                                                    style={{ backgroundColor: color, border: '1px solid #000' }}
                                                                ></span>
                                                                {color}
                                                                {index < colors.length - 1 && ', '}
                                                            </span>
                                                        ))
                                                    );
                                                } catch (e) {
                                                    return <span className="text-red-500">Invalid color data</span>;
                                                }
                                            })()}
                                        </td>

                                        <td className="border py-2">{order.product_price}</td>
                                        <td className="border py-2">{order.total_amount}</td>
                                        <td className="border py-2">
                                            <span
                                                className={`rounded px-2 py-1 text-xs font-semibold capitalize ${
                                                    order.status === 'pending'
                                                        ? 'bg-yellow-500 text-white'
                                                        : order.status === 'completed'
                                                          ? 'bg-green-500 text-white'
                                                          : order.status === 'cancelled'
                                                            ? 'bg-red-500 text-white'
                                                            : order.status === 'processing'
                                                              ? 'bg-blue-500 text-white'
                                                              : 'bg-gray-300 text-gray-800'
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>

                                        <td className="border py-2">
                                            <div className="flex justify-center gap-2">
                                                <Link href={`/admin/orders/${order.id}/edit`}>
                                                    <Button size="icon" variant="outline">
                                                        <FilePenLine className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    onClick={() => handleDelete(order.id)}
                                                    size="icon"
                                                    variant="destructive"
                                                    disabled={processing}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
