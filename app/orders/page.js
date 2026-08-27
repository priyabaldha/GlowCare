"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            const response = await fetch(
                "/api/orders"
            );

            const data = await response.json();

            if (data.success) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error(
                "Failed to fetch orders:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <main className="orders-page">
                <section className="orders-empty">
                    <p className="section-eyebrow">
                        YOUR GLOWCARE ORDERS
                    </p>

                    <h1>
                        Loading your
                        <span>orders.</span>
                    </h1>
                </section>
            </main>
        );
    }

    if (orders.length === 0) {
        return (
            <main className="orders-page">
                <section className="orders-empty">

                    <p className="section-eyebrow">
                        YOUR GLOWCARE ORDERS
                    </p>

                    <h1>
                        No orders
                        <span>yet.</span>
                    </h1>

                    <p>
                        Your completed orders will
                        appear here.
                    </p>

                    <Link
                        href="/products"
                        className="primary-button"
                    >
                        Start Shopping
                        <span>→</span>
                    </Link>

                </section>
            </main>
        );
    }

    return (
        <main className="orders-page">

            {/* Header */}
            <section className="orders-header">

                <p className="section-eyebrow">
                    YOUR GLOWCARE ORDERS
                </p>

                <h1>
                    Your
                    <span>orders.</span>
                </h1>

                <p>
                    Track and view your GlowCare
                    purchases.
                </p>

            </section>

            {/* Orders */}
            <section className="orders-list">

                {orders.map((order) => (
                    <article
                        className="order-card"
                        key={order._id}
                    >

                        {/* Order Header */}
                        <div className="order-card-header">

                            <div>
                                <p>
                                    Order ID
                                </p>

                                <strong>
                                    {order._id}
                                </strong>
                            </div>

                            <div>
                                <p>
                                    Status
                                </p>

                                <span
                                    className={`order-status status-${order.status}`}
                                >
                                    {order.status}
                                </span>
                            </div>

                            <div>
                                <p>
                                    Total
                                </p>

                                <strong>
                                    ₹
                                    {order.totalAmount}
                                </strong>
                            </div>

                        </div>

                        <div className="order-divider"></div>

                        {/* Products */}
                        <div className="order-items">

                            {order.items.map(
                                (item, index) => (
                                    <div
                                        className="order-item"
                                        key={index}
                                    >

                                        <div>
                                            <strong>
                                                {
                                                    item
                                                        .product
                                                        ?.name
                                                }
                                            </strong>

                                            <span>
                                                Qty:{" "}
                                                {
                                                    item.quantity
                                                }
                                            </span>
                                        </div>

                                        <span>
                                            ₹
                                            {item.price *
                                                item.quantity}
                                        </span>

                                    </div>
                                )
                            )}

                        </div>

                        {/* Address */}
                        <div className="order-address">

                            <p>
                                Delivered to
                            </p>

                            <span>
                                {
                                    order
                                        .shippingAddress
                                        .name
                                }
                                <br />

                                {
                                    order
                                        .shippingAddress
                                        .address
                                }
                                <br />

                                {
                                    order
                                        .shippingAddress
                                        .city
                                }
                                ,{" "}
                                {
                                    order
                                        .shippingAddress
                                        .state
                                }{" "}
                                -{" "}
                                {
                                    order
                                        .shippingAddress
                                        .pincode
                                }
                            </span>

                        </div>
                        <Link
                            href={`/orders/${order._id}`}
                            className="secondary-link"
                        >
                            View Order →
                        </Link>
                    </article>

                ))}

            </section>

        </main>
    );
}