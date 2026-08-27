"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import jsPDF from "jspdf";

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] =
        useState(false);

    useEffect(() => {
        if (orderId) {
            fetchOrder();
        } else {
            setLoading(false);
        }
    }, [orderId]);

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
                            orderId.toString()
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

    function downloadInvoice() {
    if (!order) return;

    setDownloading(true);

    try {
        const doc = new jsPDF();

        const pageWidth =
            doc.internal.pageSize.getWidth();

        const pageHeight =
            doc.internal.pageSize.getHeight();

        // =========================
        // HEADER
        // =========================

        doc.setFillColor(61, 48, 43);

        doc.rect(
            0,
            0,
            pageWidth,
            38,
            "F"
        );

        doc.setTextColor(
            255,
            255,
            255
        );

        doc.setFontSize(22);
        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "GlowCare",
            20,
            23
        );

        doc.setFontSize(9);
        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.text(
            "SKINCARE & BEAUTY",
            20,
            31
        );

        doc.setFontSize(18);
        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "INVOICE",
            pageWidth - 20,
            24,
            {
                align: "right",
            }
        );

        // =========================
        // ORDER INFO
        // =========================

        let y = 55;

        doc.setTextColor(
            60,
            50,
            45
        );

        doc.setFontSize(9);
        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.text(
            "ORDER ID",
            20,
            y
        );

        doc.text(
            "PAYMENT",
            125,
            y
        );

        y += 7;

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            order._id.toString(),
            20,
            y
        );

        doc.text(
            order.paymentMethod
                ? order.paymentMethod
                      .toUpperCase()
                : "N/A",
            125,
            y
        );

        y += 12;

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.text(
            "PAYMENT STATUS",
            125,
            y
        );

        y += 7;

        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            order.paymentStatus
                ? order.paymentStatus
                      .toUpperCase()
                : "N/A",
            125,
            y
        );

        // =========================
        // DELIVERY
        // =========================

        y += 20;

        doc.setDrawColor(
            225,
            216,
            210
        );

        doc.line(
            20,
            y,
            pageWidth - 20,
            y
        );

        y += 15;

        doc.setFontSize(11);
        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "DELIVERY ADDRESS",
            20,
            y
        );

        y += 9;

        doc.setFontSize(10);

        doc.text(
            order.shippingAddress.name,
            20,
            y
        );

        y += 7;

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.text(
            order.shippingAddress.address,
            20,
            y
        );

        y += 7;

        doc.text(
            `${order.shippingAddress.city}, ${order.shippingAddress.state}`,
            20,
            y
        );

        y += 7;

        doc.text(
            `Pincode: ${order.shippingAddress.pincode}`,
            20,
            y
        );

        y += 7;

        doc.text(
            `Phone: ${order.shippingAddress.phone}`,
            20,
            y
        );

        // =========================
        // ITEMS
        // =========================

        y += 18;

        doc.setFillColor(
            244,
            238,
            233
        );

        doc.rect(
            20,
            y,
            pageWidth - 40,
            13,
            "F"
        );

        doc.setTextColor(
            70,
            58,
            50
        );

        doc.setFontSize(9);
        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "PRODUCT",
            25,
            y + 8
        );

        doc.text(
            "QTY",
            125,
            y + 8
        );

        doc.text(
            "PRICE",
            150,
            y + 8
        );

        doc.text(
            "TOTAL",
            185,
            y + 8,
            {
                align: "right",
            }
        );

        y += 23;

        // =========================
        // PRODUCT ROWS
        // =========================

        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.setFontSize(9);

        order.items.forEach(
            (item) => {
                const name =
                    item.product?.name ||
                    "Product";

                const itemTotal =
                    item.price *
                    item.quantity;

                doc.text(
                    name,
                    25,
                    y
                );

                doc.text(
                    String(item.quantity),
                    125,
                    y
                );

                doc.text(
                    `Rs. ${item.price}`,
                    150,
                    y
                );

                doc.text(
                    `Rs. ${itemTotal}`,
                    185,
                    y,
                    {
                        align: "right",
                    }
                );

                doc.setDrawColor(
                    235,
                    228,
                    223
                );

                doc.line(
                    20,
                    y + 6,
                    pageWidth - 20,
                    y + 6
                );

                y += 17;
            }
        );

        // =========================
        // TOTALS
        // =========================

        y += 12;

        const totalsLeft = 125;
        const totalsRight = 185;

        doc.setTextColor(
            80,
            68,
            60
        );

        doc.setFontSize(10);

        doc.text(
            "Subtotal",
            totalsLeft,
            y
        );

        doc.text(
            `Rs. ${order.totalAmount}`,
            totalsRight,
            y,
            {
                align: "right",
            }
        );

        y += 10;

        doc.text(
            "Shipping",
            totalsLeft,
            y
        );

        doc.text(
            "FREE",
            totalsRight,
            y,
            {
                align: "right",
            }
        );

        y += 8;

        doc.setDrawColor(
            210,
            200,
            194
        );

        doc.line(
            totalsLeft,
            y,
            totalsRight,
            y
        );

        y += 15;

        doc.setTextColor(
            45,
            37,
            33
        );

        doc.setFontSize(14);
        doc.setFont(
            "helvetica",
            "bold"
        );

        doc.text(
            "TOTAL",
            totalsLeft,
            y
        );

        doc.text(
            `Rs. ${order.totalAmount}`,
            totalsRight,
            y,
            {
                align: "right",
            }
        );

        // =========================
        // PAYMENT BADGE
        // =========================

        y += 20;

        if (
            order.paymentStatus ===
            "paid"
        ) {
            doc.setFillColor(
                235,
                244,
                231
            );

            doc.roundedRect(
                20,
                y,
                65,
                17,
                4,
                4,
                "F"
            );

            doc.setTextColor(
                75,
                105,
                65
            );

            doc.setFontSize(8);
            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "PAYMENT RECEIVED",
                52.5,
                y + 11,
                {
                    align: "center",
                }
            );
        } else {
            doc.setFillColor(
                247,
                239,
                229
            );

            doc.roundedRect(
                20,
                y,
                65,
                17,
                4,
                4,
                "F"
            );

            doc.setTextColor(
                145,
                105,
                65
            );

            doc.setFontSize(8);
            doc.setFont(
                "helvetica",
                "bold"
            );

            doc.text(
                "PAYMENT PENDING",
                52.5,
                y + 11,
                {
                    align: "center",
                }
            );
        }

        // =========================
        // FOOTER
        // =========================

        doc.setTextColor(
            125,
            112,
            105
        );

        doc.setFontSize(9);
        doc.setFont(
            "helvetica",
            "normal"
        );

        doc.text(
            "Thank you for choosing GlowCare.",
            pageWidth / 2,
            pageHeight - 25,
            {
                align: "center",
            }
        );

        doc.setFontSize(8);

        doc.text(
            "Gentle care. Everyday glow.",
            pageWidth / 2,
            pageHeight - 16,
            {
                align: "center",
            }
        );

        // =========================
        // DOWNLOAD
        // =========================

        doc.save(
            `GlowCare-Invoice-${order._id}.pdf`
        );

    } catch (error) {
        console.error(
            "Invoice error:",
            error
        );

    } finally {
        setDownloading(false);
    }
}

    if (loading) {
        return (
            <main className="order-success-page">
                <div className="success-loading">
                    Preparing your order...
                </div>
            </main>
        );
    }

    return (
        <main className="order-success-page">

            {/* Decorative circles */}
            <div className="success-decoration success-decoration-one"></div>

            <div className="success-decoration success-decoration-two"></div>

            <section className="order-success-card">

                {/* Success icon */}
                <div className="success-icon">
                    ✓
                </div>

                {/* Heading */}
                <div className="success-heading">

                    <p className="section-eyebrow">
                        ORDER CONFIRMED
                    </p>

                    <h1>
                        Thank you for
                        <span>your order.</span>
                    </h1>

                    <p className="success-message">
                        Your GlowCare essentials are
                        on their way. We've successfully
                        received your order.
                    </p>

                </div>

                {/* Order ID */}
                {orderId && (
                    <div className="success-order-id">

                        <div className="order-id-icon">
                            ✓
                        </div>

                        <div>
                            <span>
                                ORDER ID
                            </span>

                            <strong>
                                {orderId}
                            </strong>
                        </div>

                    </div>
                )}

                {/* Order information */}
                {order && (
                    <div className="success-info-grid">

                        <div className="success-info-card">

                            <span className="success-info-label">
                                PAYMENT
                            </span>

                            <strong>
                                {order.paymentMethod
                                    ?.toUpperCase()}
                            </strong>

                            <small
                                className={
                                    order.paymentStatus ===
                                        "paid"
                                        ? "status-paid"
                                        : "status-pending"
                                }
                            >
                                {order.paymentStatus}
                            </small>

                        </div>

                        <div className="success-info-card">

                            <span className="success-info-label">
                                ORDER STATUS
                            </span>

                            <strong>
                                {order.status}
                            </strong>

                            <small>
                                Successfully placed
                            </small>

                        </div>

                        <div className="success-info-card">

                            <span className="success-info-label">
                                TOTAL
                            </span>

                            <strong>
                                ₹{order.totalAmount}
                            </strong>

                            <small>
                                Shipping included
                            </small>

                        </div>

                    </div>
                )}

                {/* Buttons */}
                <div className="success-actions">

                    <Link
                        href={`/orders/${orderId}`}
                        className="success-primary-button"
                    >
                        View Order

                        <span>
                            →
                        </span>
                    </Link>

                    <button
                        type="button"
                        className="success-secondary-button"
                        onClick={downloadInvoice}
                        disabled={
                            !order ||
                            downloading
                        }
                    >
                        {downloading
                            ? "Preparing..."
                            : "Download Invoice"}

                        <span>
                            ↓
                        </span>
                    </button>

                </div>

                {/* Continue shopping */}
                <Link
                    href="/products"
                    className="success-shopping-link"
                >
                    Continue Shopping
                    <span>→</span>
                </Link>

                {/* Benefits */}
                <div className="success-benefits">

                    <div className="success-benefit">

                        <div>
                            ✓
                        </div>

                        <span>
                            Clean Care
                            <small>
                                Thoughtfully selected
                            </small>
                        </span>

                    </div>

                    <div className="success-benefit">

                        <div>
                            ♡
                        </div>

                        <span>
                            Gentle Essentials
                            <small>
                                Made for everyday use
                            </small>
                        </span>

                    </div>

                    <div className="success-benefit">

                        <div>
                            →
                        </div>

                        <span>
                            Fast Delivery
                            <small>
                                Your order is on its way
                            </small>
                        </span>

                    </div>

                </div>

            </section>

        </main>
    );
}