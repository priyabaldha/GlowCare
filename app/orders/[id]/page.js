"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import jsPDF from "jspdf";

export default function OrderDetailsPage({ params }) {
    const { id } = use(params);

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrder();
    }, [id]);

    async function fetchOrder() {
        try {
            const response = await fetch(
                "/api/orders"
            );

            const data = await response.json();

            if (data.success) {
                const foundOrder =
                    data.orders.find(
                        (item) =>
                            item._id.toString() ===
                            id.toString()
                    );

                setOrder(foundOrder || null);
            }
        } catch (error) {
            console.error(
                "Failed to fetch order:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <main className="order-details-page">
                <p>Loading order...</p>
            </main>
        );
    }

    if (!order) {
        return (
            <main className="order-details-page">

                <h1>
                    Order not found
                </h1>

                <Link
                    href="/orders"
                    className="primary-button"
                >
                    Back to Orders
                </Link>

            </main>
        );
    }

    function downloadInvoice() {
        const doc = new jsPDF();

        doc.setFontSize(22);
        doc.text("GlowCare", 20, 25);

        doc.setFontSize(12);
        doc.text("INVOICE", 20, 35);

        doc.setFontSize(10);

        doc.text(
            `Order ID: ${order._id}`,
            20,
            48
        );

        doc.text(
            `Payment: ${order.paymentMethod?.toUpperCase()}`,
            20,
            56
        );

        doc.text(
            `Payment Status: ${order.paymentStatus}`,
            20,
            64
        );

        doc.text(
            `Order Status: ${order.status}`,
            20,
            72
        );

        // Delivery address
        doc.setFontSize(13);
        doc.text(
            "Delivery Address",
            20,
            88
        );

        doc.setFontSize(10);

        doc.text(
            order.shippingAddress.name,
            20,
            98
        );

        doc.text(
            order.shippingAddress.address,
            20,
            106
        );

        doc.text(
            `${order.shippingAddress.city}, ${order.shippingAddress.state}`,
            20,
            114
        );

        doc.text(
            `Pincode: ${order.shippingAddress.pincode}`,
            20,
            122
        );

        doc.text(
            `Phone: ${order.shippingAddress.phone}`,
            20,
            130
        );

        // Products
        doc.setFontSize(13);
        doc.text(
            "Order Items",
            20,
            150
        );

        let y = 162;

        order.items.forEach(
            (item, index) => {
                const itemTotal =
                    item.price *
                    item.quantity;

                doc.setFontSize(10);

                doc.text(
                    `${index + 1}. ${item.product?.name ||
                    "Product"
                    }`,
                    20,
                    y
                );

                doc.text(
                    `Qty: ${item.quantity}`,
                    120,
                    y
                );

                doc.text(
                    `₹${itemTotal}`,
                    165,
                    y
                );

                y += 10;
            }
        );

        // Total
        y += 10;

        doc.setFontSize(14);

        doc.text(
            `Total: ₹${order.totalAmount}`,
            20,
            y
        );

        doc.setFontSize(10);

        doc.text(
            "Thank you for shopping with GlowCare.",
            20,
            y + 20
        );

        doc.save(
            `GlowCare-Invoice-${order._id}.pdf`
        );
    }

    return (
        <main className="order-details-page">

            {/* Header */}
            <section className="order-details-header">

                <p className="section-eyebrow">
                    ORDER DETAILS
                </p>

                <h1>
                    Your
                    <span>order.</span>
                </h1>

                <p>
                    Order ID:{" "}
                    <strong>{order._id}</strong>
                </p>

            </section>

            <section className="order-details-content">

                {/* Order Items */}
                <div className="order-details-card">

                    <h2>
                        Items
                    </h2>

                    <div className="order-detail-items">

                        {order.items.map(
                            (item, index) => (
                                <div
                                    className="order-detail-item"
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
                                            Quantity:{" "}
                                            {
                                                item.quantity
                                            }
                                        </span>
                                    </div>

                                    <strong>
                                        ₹
                                        {item.price *
                                            item.quantity}
                                    </strong>

                                </div>
                            )
                        )}

                    </div>

                </div>

                {/* Payment */}
                <div className="order-details-card">

                    <h2>
                        Payment
                    </h2>

                    <div className="order-info-row">
                        <span>
                            Method
                        </span>

                        <strong>
                            {order.paymentMethod?.toUpperCase()}
                        </strong>
                    </div>

                    <div className="order-info-row">
                        <span>
                            Payment Status
                        </span>

                        <strong>
                            {order.paymentStatus}
                        </strong>
                    </div>

                    <div className="order-info-row">
                        <span>
                            Order Status
                        </span>

                        <strong>
                            {order.status}
                        </strong>
                    </div>

                    <div className="order-info-row order-final-total">
                        <span>
                            Total
                        </span>

                        <strong>
                            ₹{order.totalAmount}
                        </strong>
                    </div>

                </div>

                {/* Address */}
                <div className="order-details-card">

                    <h2>
                        Delivery address
                    </h2>

                    <p>
                        <strong>
                            {
                                order
                                    .shippingAddress
                                    .name
                            }
                        </strong>
                    </p>

                    <p>
                        {
                            order
                                .shippingAddress
                                .address
                        }
                    </p>

                    <p>
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
                    </p>

                    <p>
                        Phone:{" "}
                        {
                            order
                                .shippingAddress
                                .phone
                        }
                    </p>

                </div>

                {/* Actions */}
                <div className="order-detail-actions">

                    <Link
                        href="/orders"
                        className="secondary-link"
                    >
                        ← Back to Orders
                    </Link>

                    <button
                        type="button"
                        className="invoice-button"
                        onClick={downloadInvoice}
                    >
                        Download Invoice
                        <span>↓</span>
                    </button>

                </div>

            </section>

        </main>
    );
}