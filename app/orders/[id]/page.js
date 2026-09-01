"use client";

import {
    use,
    useEffect,
    useState,
} from "react";

import Link from "next/link";
import jsPDF from "jspdf";

export default function OrderDetailsPage({
    params,
}) {
    const { id } = use(params);

    const [order, setOrder] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [cancelling, setCancelling] =
        useState(false);

    // =========================================
    // FETCH ORDER
    // =========================================

    useEffect(() => {
        fetchOrder();

        const interval =
            setInterval(
                fetchOrder,
                10000
            );

        return () =>
            clearInterval(interval);
    }, [id]);

    async function fetchOrder() {
        try {
            const response =
                await fetch(
                    "/api/orders",
                    {
                        cache: "no-store",
                    }
                );

            const data =
                await response.json();

            if (data.success) {
                const foundOrder =
                    data.orders.find(
                        (item) =>
                            item._id.toString() ===
                            id.toString()
                    );

                setOrder(
                    foundOrder || null
                );
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

    // =========================================
    // CANCEL ORDER
    // =========================================

    async function handleCancelOrder() {
        const reason =
            window.prompt(
                "Why do you want to cancel this order?"
            );

        if (
            reason === null
        ) {
            return;
        }

        setCancelling(true);

        try {
            const response =
                await fetch(
                    `/api/orders/${id}/cancel`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            reason,
                        }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                        "Unable to cancel order."
                );

                return;
            }

            if (
                data.success
            ) {
                setOrder(
                    data.order
                );

                alert(
                    "Cancellation request sent to admin."
                );
            }

        } catch (error) {
            console.error(
                "Cancel order error:",
                error
            );

            alert(
                "Something went wrong."
            );
        } finally {
            setCancelling(false);
        }
    }

    // =========================================
    // INVOICE
    // =========================================

    function downloadInvoice() {
        const doc =
            new jsPDF();

        doc.setFontSize(22);
        doc.text(
            "GlowCare",
            20,
            25
        );

        doc.setFontSize(12);

        doc.text(
            "INVOICE",
            20,
            35
        );

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
            `Order Status: ${formatStatus(
                order.status
            )}`,
            20,
            72
        );

        // Address

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

                doc.setFontSize(
                    10
                );

                doc.text(
                    `${index + 1}. ${
                        item.product?.name ||
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

    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <main className="order-details-page">
                <p>
                    Loading order...
                </p>
            </main>
        );
    }

    // =========================================
    // NOT FOUND
    // =========================================

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

    const canCancel =
        [
            "pending",
            "confirmed",
        ].includes(
            order.status
        );

    const statusSteps = [
        {
            key: "pending",
            label: "Order Placed",
        },

        {
            key: "confirmed",
            label: "Confirmed",
        },

        {
            key: "shipped",
            label: "Shipped",
        },

        {
            key: "delivered",
            label: "Delivered",
        },
    ];

    const statusOrder = [
        "pending",
        "confirmed",
        "shipped",
        "delivered",
    ];

    const currentIndex =
        statusOrder.indexOf(
            order.status
        );

    return (
        <main className="order-details-page">

            {/* =================================
                HEADER
            ================================= */}

            <section className="order-details-header">

                <p className="section-eyebrow">
                    ORDER DETAILS
                </p>

                <h1>
                    Your{" "}
                    <span>
                        order.
                    </span>
                </h1>

                <p>
                    Order ID:{" "}
                    <strong>
                        {order._id}
                    </strong>
                </p>

            </section>

            <section className="order-details-content">

                {/* =================================
                    ORDER STATUS TIMELINE
                ================================= */}

                <div
                    className="order-details-card"
                    style={{
                        marginBottom:
                            "14px",
                    }}
                >
                    <h2>
                        Order status
                    </h2>

                    {order.status ===
                        "cancellation_requested" ? (
                        <div
                            style={{
                                marginTop:
                                    "18px",
                                padding:
                                    "18px",
                                borderRadius:
                                    "14px",
                                background:
                                    "#fff4e5",
                                color:
                                    "#795548",
                            }}
                        >
                            <strong>
                                Cancellation requested
                            </strong>

                            <p
                                style={{
                                    marginTop:
                                        "7px",
                                    fontSize:
                                        "12px",
                                }}
                            >
                                Your cancellation
                                request is waiting
                                for admin approval.
                            </p>
                        </div>
                    ) : (
                        <div
                            style={{
                                marginTop:
                                    "24px",
                            }}
                        >
                            {statusSteps.map(
                                (
                                    step,
                                    index
                                ) => {
                                    const completed =
                                        currentIndex >=
                                        index;

                                    return (
                                        <div
                                            key={
                                                step.key
                                            }
                                            style={{
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                gap:
                                                    "14px",
                                                marginBottom:
                                                    index ===
                                                    statusSteps.length -
                                                        1
                                                        ? "0"
                                                        : "18px",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width:
                                                        "30px",
                                                    height:
                                                        "30px",
                                                    borderRadius:
                                                        "50%",
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    background:
                                                        completed
                                                            ? "var(--espresso-brown)"
                                                            : "var(--blush-oat)",
                                                    color:
                                                        completed
                                                            ? "var(--milk)"
                                                            : "var(--muted-text)",
                                                    fontSize:
                                                        "12px",
                                                    fontWeight:
                                                        "600",
                                                }}
                                            >
                                                {completed
                                                    ? "✓"
                                                    : index +
                                                      1}
                                            </div>

                                            <div>
                                                <strong
                                                    style={{
                                                        color:
                                                            "var(--espresso-brown)",
                                                    }}
                                                >
                                                    {
                                                        step.label
                                                    }
                                                </strong>
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}

                    {/* CANCELLED */}

                    {order.status ===
                        "cancelled" && (
                        <div
                            style={{
                                marginTop:
                                    "18px",
                                padding:
                                    "18px",
                                borderRadius:
                                    "14px",
                                background:
                                    "#f9eeee",
                                color:
                                    "#8b4c4c",
                            }}
                        >
                            <strong>
                                Order cancelled
                            </strong>

                            {order.refundStatus ===
                                "pending" && (
                                <p
                                    style={{
                                        marginTop:
                                            "8px",
                                        fontSize:
                                            "12px",
                                    }}
                                >
                                    Refund of ₹
                                    {Number(
                                        order.refundAmount
                                    ).toLocaleString(
                                        "en-IN"
                                    )}{" "}
                                    is waiting to
                                    be processed.
                                </p>
                            )}

                            {order.refundStatus ===
                                "processed" && (
                                <p
                                    style={{
                                        marginTop:
                                            "8px",
                                        fontSize:
                                            "12px",
                                    }}
                                >
                                    ₹
                                    {Number(
                                        order.refundAmount
                                    ).toLocaleString(
                                        "en-IN"
                                    )}{" "}
                                    has been refunded
                                    successfully.
                                </p>
                            )}
                        </div>
                    )}

                </div>

                {/* =================================
                    SHIPPING DETAILS
                ================================= */}

                {order.status ===
                    "shipped" ||
                    order.status ===
                        "delivered" ? (
                    <div
                        className="order-details-card"
                        style={{
                            marginBottom:
                                "14px",
                        }}
                    >
                        <h2>
                            Shipping
                        </h2>

                        <div
                            className="order-info-row"
                            style={{
                                marginTop:
                                    "15px",
                            }}
                        >
                            <span>
                                Courier
                            </span>

                            <strong>
                                {order.courierName ||
                                    "—"}
                            </strong>
                        </div>

                        <div className="order-info-row">
                            <span>
                                Tracking Number
                            </span>

                            <strong>
                                {order.trackingNumber ||
                                    "—"}
                            </strong>
                        </div>

                        {order.trackingUrl && (
                            <a
                                href={
                                    order.trackingUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                    display:
                                        "inline-block",
                                    marginTop:
                                        "15px",
                                    color:
                                        "var(--espresso-brown)",
                                    fontWeight:
                                        "600",
                                    fontSize:
                                        "12px",
                                }}
                            >
                                Track your package →
                            </a>
                        )}
                    </div>
                ) : null}

                {/* =================================
                    ORDER ITEMS
                ================================= */}

                <div className="order-details-card">

                    <h2>
                        Items
                    </h2>

                    <div className="order-detail-items">

                        {order.items.map(
                            (
                                item,
                                index
                            ) => (
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
                                        {(
                                            item.price *
                                            item.quantity
                                        ).toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </div>
                            )
                        )}

                    </div>

                </div>

                {/* =================================
                    PAYMENT
                ================================= */}

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
                            {formatStatus(
                                order.paymentStatus
                            )}
                        </strong>
                    </div>

                    <div className="order-info-row">
                        <span>
                            Order Status
                        </span>

                        <strong>
                            {formatStatus(
                                order.status
                            )}
                        </strong>
                    </div>

                    <div className="order-info-row order-final-total">
                        <span>
                            Total
                        </span>

                        <strong>
                            ₹
                            {Number(
                                order.totalAmount
                            ).toLocaleString(
                                "en-IN"
                            )}
                        </strong>
                    </div>

                </div>

                {/* =================================
                    ADDRESS
                ================================= */}

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

                {/* =================================
                    ACTIONS
                ================================= */}

                <div className="order-detail-actions">

                    <Link
                        href="/orders"
                        className="secondary-link"
                    >
                        ← Back to Orders
                    </Link>

                    {canCancel && (
                        <button
                            type="button"
                            disabled={
                                cancelling
                            }
                            onClick={
                                handleCancelOrder
                            }
                            style={{
                                padding:
                                    "12px 18px",
                                border:
                                    "1px solid #d99",
                                borderRadius:
                                    "999px",
                                background:
                                    "transparent",
                                color:
                                    "#9b5555",
                                cursor:
                                    cancelling
                                        ? "not-allowed"
                                        : "pointer",
                                fontFamily:
                                    "inherit",
                                fontSize:
                                    "11px",
                                fontWeight:
                                    "600",
                            }}
                        >
                            {cancelling
                                ? "Requesting..."
                                : "Cancel Order"}
                        </button>
                    )}

                    <button
                        type="button"
                        className="invoice-button"
                        onClick={
                            downloadInvoice
                        }
                    >
                        Download Invoice
                        <span>
                            ↓
                        </span>
                    </button>

                </div>

            </section>
        </main>
    );
}

// =========================================
// FORMAT STATUS
// =========================================

function formatStatus(
    value
) {
    if (!value) {
        return "—";
    }

    return value
        .replaceAll(
            "_",
            " "
        )
        .replace(
            /\b\w/g,
            (letter) =>
                letter.toUpperCase()
        );
}