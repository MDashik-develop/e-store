import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, FilePenLine, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Index({ orders: initialOrders }) {
    const [orders, setOrders] = useState(initialOrders);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { delete: destroy, processing } = useForm();

    const openModal = (order) => {
        setSelectedOrder(order);
        setShowInvoiceModal(true);
    };

    const closeModal = () => {
        setSelectedOrder(null);
        setShowInvoiceModal(false);
    };

    useEffect(() => {
        document.body.style.overflow = showInvoiceModal ? 'hidden' : 'auto';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showInvoiceModal]);

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this order?')) {
            destroy(`/admin/orders/${id}`, {
                onSuccess: () => {
                    setOrders(orders.filter((order) => order.id !== id));
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
                        <Button>Add Order</Button>
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full table-auto border-collapse border border-gray-200 text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-center">
                                <th className="border px-2 py-2">ID</th>
                                <th className="border px-2 py-2">Name</th>
                                <th className="border py-2">Size</th>
                                <th className="border py-2">Color</th>
                                <th className="border py-2">Price</th>
                                <th className="border py-2">Total</th>
                                <th className="border py-2">Status</th>
                                <th className="border px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order.id} className="text-center hover:bg-gray-50">
                                        <td className="border py-2">{order.id}</td>
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
                                                            <span key={index} className="mr-2 inline-block capitalize">
                                                                <span
                                                                    className="mr-1 inline-block h-3 w-3 rounded-full"
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
                                                <Button size="icon" variant="outline" onClick={() => openModal(order)} title="View Invoice">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
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
                                    <td colSpan={8} className="p-4 text-center text-gray-500">
                                        No orders found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {showInvoiceModal && selectedOrder && (
                <div onClick={closeModal} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="animate-fadeIn relative mx-4 max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-gray-200 bg-white/90 shadow-2xl backdrop-blur-lg"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between rounded-t-2xl bg-gradient-to-r from-[#4f46e5] to-[#9333ea] px-8 py-5 text-white">
                            <div>
                                <h1 className="text-2xl font-bold">Invoice</h1>
                                <p className="text-xs">Order ID: #{selectedOrder.id}</p>
                            </div>
                            <button onClick={closeModal} className="text-3xl font-bold hover:text-red-300" title="Close">
                                &times;
                            </button>
                        </div>

                        {/* Branding */}
                        <div className="px-8 pt-4 pb-6 text-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <p className="text-xl font-bold text-gray-800">MeatShopBD</p>
                                    <p className="text-gray-500">www.meatshopbd.com</p>
                                    <p className="text-gray-500">Dhaka, Bangladesh</p>
                                </div>
                                <div className="text-right text-gray-600">
                                    <p>
                                        <strong>Date</strong>
                                        <br />
                                        {new Date(selectedOrder.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Customer & Status */}
                            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <h3 className="mb-1 mb-3 font-semibold text-gray-700">Customer</h3>
                                    <p>{selectedOrder.customer_name}</p>
                                    <p>{selectedOrder.phone}</p>
                                    <p>{selectedOrder.email}</p>
                                    <p>{selectedOrder.address}</p>
                                </div>
                                <div className="text-right md:text-left">
                                    <h3 className="mb-1 mb-3 font-semibold text-gray-700">Shipping Info</h3>
                                    <p>
                                        <strong className="text-gray-500">Delivery: </strong> {selectedOrder.shipping_address}
                                    </p>
                                        <p>
                                            <strong className="text-gray-500">Delivery: </strong>{' '}
                                            {new Date(selectedOrder.delivery_date).toLocaleDateString()}
                                        </p>
                                        <p>
                                            <strong className="text-gray-600">Payment Method: </strong>{'   d'} {selectedOrder.payment_method}
                                        </p>
                    <p>
                                            <strong className="text-gray-500">Payment Status: </strong> {selectedOrder.payment_status}
                                        <span
                                            className={`mt-2 inline-block rounded px-2 py-1 text-xs font-bold tracking-wide uppercase ${
                                                selectedOrder.status === 'completed'
                                                    ? 'bg-green-500 text-white'
                                                    : selectedOrder.status === 'pending'
                                                      ? 'bg-yellow-400 text-black'
                                                      : selectedOrder.status === 'cancelled'
                                                        ? 'bg-red-500 text-white'
                                                        : 'bg-blue-500 text-white'
                                            }`}
                                        >
                                            {selectedOrder.status}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            {/* Product Table */}
                            <div className="overflow-x-auto rounded-lg border">
                                <table className="min-w-full text-sm">
                                    <thead className="bg-gray-100 text-left text-gray-700">
                                        <tr>
                                            <th className="px-4 py-2">Image</th>
                                            <th className="px-4 py-2">Product</th>
                                            <th className="px-4 py-2">Size</th>
                                            <th className="px-4 py-2">Color</th>
                                            <th className="px-4 py-2 text-right">Price</th>
                                            <th className="px-4 py-2 text-right">Qty</th>
                                            <th className="px-4 py-2 text-right">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-t bg-white">
                                            <td className="px-4 py-3">
                                                <img src={selectedOrder.product_image} alt="product" className="h-12 w-12 rounded object-cover" />
                                            </td>
                                            <td className="px-4 py-3">{selectedOrder.product_name}</td>
                                            <td className="px-4 py-3">{JSON.parse(selectedOrder.product_size)?.join(', ') ?? '—'}</td>
                                            <td className="px-4 py-3">
                                                {JSON.parse(selectedOrder.product_color)?.map((color, i) => (
                                                    <span key={i} className="mr-2 inline-flex items-center gap-1">
                                                        <span className="h-3 w-3 rounded-full border" style={{ backgroundColor: color }}></span>
                                                        {color}
                                                    </span>
                                                ))}
                                            </td>
                                            <td className="px-4 py-3 text-right">৳{selectedOrder.product_price}</td>
                                            <td className="px-4 py-3 text-right">{selectedOrder.quantity}</td>
                                            <td className="px-4 py-3 text-right">
                                                ৳{Number(selectedOrder.product_price) * Number(selectedOrder.quantity)}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Summary */}
                            <div className="mt-6 flex justify-end">
                                <div className="w-full max-w-xs space-y-2 text-sm text-gray-700">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>৳{selectedOrder.total_amount}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping:</span>
                                        <span>৳0.00</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 text-lg font-bold">
                                        <span>Total:</span>
                                        <span>৳{selectedOrder.total_amount}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
