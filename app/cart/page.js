"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    async function fetchCart() {
        try {
            const response = await fetch("/api/cart", {
                cache: "no-store",
            });

            const data = await response.json();

            if (data.success) {
                const items = data.cart?.items || [];

                setCartItems(
                    items.map((item) => ({
                        id: item.product._id,
                        name: item.product.name,
                        image: item.product.image,
                        category: item.product.category,
                        price: item.product.price,
                        quantity: item.quantity,
                    }))
                );
            }
        } catch (error) {
            console.error(
                "Failed to fetch cart:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    async function updateQuantity(productId, quantity) {
        try {
            const response = await fetch("/api/cart", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                    quantity,
                }),
            });

            const data = await response.json();

            if (data.success) {
                fetchCart();
            }
        } catch (error) {
            console.error(
                "Failed to update quantity:",
                error
            );
        }
    }

    async function removeFromCart(productId) {
        try {
            const response = await fetch("/api/cart", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    productId,
                }),
            });

            const data = await response.json();

            if (data.success) {
                fetchCart();
            }
        } catch (error) {
            console.error(
                "Failed to remove item:",
                error
            );
        }
    }

    const cartTotal = cartItems.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    if (loading) {
        return (
            <main className="cart-page">
                <section className="empty-cart">
                    <p className="section-eyebrow">
                        YOUR GLOWCARE BAG
                    </p>

                    <h1>
                        Preparing your
                        <span>bag.</span>
                    </h1>
                </section>
            </main>
        );
    }

    if (cartItems.length === 0) {
        return (
            <main className="cart-page">
                <section className="empty-cart">

                    <p className="section-eyebrow">
                        YOUR GLOWCARE BAG
                    </p>

                    <h1>
                        Your bag is
                        <span>feeling light.</span>
                    </h1>

                    <p>
                        Looks like you haven't added
                        anything yet. Let's find
                        something your skin will love.
                    </p>

                    <Link
                        href="/products"
                        className="primary-button"
                    >
                        Explore Products
                        <span>→</span>
                    </Link>

                </section>
            </main>
        );
    }

    return (
        <main className="cart-page">

            {/* Header */}
            <section className="cart-header">

                <p className="section-eyebrow">
                    YOUR GLOWCARE BAG
                </p>

                <h1>
                    Your
                    <span>essentials.</span>
                </h1>

            </section>

            {/* Cart Content */}
            <section className="cart-content">

                {/* Cart Items */}
                <div className="cart-items">

                    {cartItems.map((item) => (
                        <article
                            className="cart-item"
                            key={item.id}
                        >

                            {/* Image */}
                            <div className="cart-item-image">

                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="cart-product-image"
                                />

                            </div>

                            {/* Information */}
                            <div className="cart-item-info">

                                <p className="product-category">
                                    {item.category}
                                </p>

                                <h2>
                                    {item.name}
                                </h2>

                                <p className="cart-item-price">
                                    ₹{item.price}
                                </p>

                                {/* Quantity */}
                                <div className="cart-item-actions">

                                    <div className="quantity-control">

                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    Math.max(
                                                        1,
                                                        item.quantity - 1
                                                    )
                                                )
                                            }
                                        >
                                            −
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            onClick={() =>
                                                updateQuantity(
                                                    item.id,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </div>

                                    <button
                                        className="remove-button"
                                        onClick={() =>
                                            removeFromCart(
                                                item.id
                                            )
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                            {/* Item Total */}
                            <div className="cart-item-total">
                                ₹
                                {item.price *
                                    item.quantity}
                            </div>

                        </article>
                    ))}

                </div>

                {/* Order Summary */}
                <aside className="cart-summary">

                    <p className="summary-eyebrow">
                        ORDER SUMMARY
                    </p>

                    <h2>
                        Your total
                    </h2>

                    <div className="summary-row">
                        <span>
                            Subtotal
                        </span>

                        <span>
                            ₹{cartTotal}
                        </span>
                    </div>

                    <div className="summary-row">
                        <span>
                            Shipping
                        </span>

                        <span>
                            Free
                        </span>
                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-total">
                        <span>
                            Total
                        </span>

                        <strong>
                            ₹{cartTotal}
                        </strong>
                    </div>

                    <Link
                        href="/checkout"
                        className="checkout-button"
                    >
                        Proceed to Checkout
                        <span>→</span>
                    </Link>

                    <Link
                        href="/products"
                        className="continue-shopping"
                    >
                        Continue Shopping
                    </Link>

                </aside>

            </section>

        </main>
    );
}