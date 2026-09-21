"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [removeItem, setRemoveItem] = useState(null);
    const [removing, setRemoving] = useState(false);

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

    async function handleRemoveItem() {
        if (!removeItem) return;

        setRemoving(true);

        try {
            await removeFromCart(removeItem.id);

            setRemoveItem(null);

        } finally {
            setRemoving(false);
        }
    }

    async function handleMoveToWishlist() {
        if (!removeItem) return;

        setRemoving(true);

        try {
            // Add product to wishlist
            const wishlistResponse = await fetch(
                "/api/wishlist",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        productId: removeItem.id,
                    }),
                }
            );

            const wishlistData =
                await wishlistResponse.json();

            if (
                !wishlistResponse.ok ||
                !wishlistData.success
            ) {
                alert(
                    wishlistData.message ||
                    "Failed to move item to wishlist."
                );

                return;
            }

            // Remove product from cart
            await removeFromCart(removeItem.id);

            setRemoveItem(null);

        } catch (error) {
            console.error(
                "Move to wishlist error:",
                error
            );

            alert(
                "Something went wrong. Please try again."
            );

        } finally {
            setRemoving(false);
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

                    <div className="cart-empty-actions">

                        <Link
                            href="/products"
                            className="primary-button"
                        >
                            Explore Products
                            <span>→</span>
                        </Link>

                        <Link
                            href="/orders"
                            className="cart-orders-link"
                        >
                            View My Orders
                            <span>→</span>
                        </Link>

                    </div>

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
                                            onClick={() => {
                                                if (item.quantity === 1) {
                                                    setRemoveItem(item);
                                                } else {
                                                    updateQuantity(
                                                        item.id,
                                                        item.quantity - 1
                                                    );
                                                }
                                            }}
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

                    <div className="cart-summary-actions">

                        <Link
                            href="/checkout"
                            className="checkout-button"
                        >
                            Proceed to Checkout
                            <span>→</span>
                        </Link>

                        <Link
                            href="/orders"
                            className="cart-orders-link"
                        >
                            View My Orders
                            <span>→</span>
                        </Link>

                        <Link
                            href="/products"
                            className="continue-shopping"
                        >
                            Continue Shopping
                        </Link>

                    </div>

                </aside>

            </section>
            {removeItem && (
                <div
                    className="remove-modal-overlay"
                    onClick={() => {
                        if (!removing) {
                            setRemoveItem(null);
                        }
                    }}
                >
                    <div
                        className="remove-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <button
                            className="remove-modal-close"
                            onClick={() =>
                                setRemoveItem(null)
                            }
                            disabled={removing}
                        >
                            ×
                        </button>

                        <p className="section-eyebrow">
                            YOUR GLOWCARE BAG
                        </p>

                        <h2>
                            Remove this
                            <span>product?</span>
                        </h2>

                        <div className="remove-modal-product">

                            <div className="remove-modal-image">
                                <Image
                                    src={removeItem.image}
                                    alt={removeItem.name}
                                    fill
                                />
                            </div>

                            <div>
                                <p className="product-category">
                                    {removeItem.category}
                                </p>

                                <h3>
                                    {removeItem.name}
                                </h3>

                                <p>
                                    ₹{removeItem.price}
                                </p>
                            </div>

                        </div>

                        <p className="remove-modal-description">
                            You can remove this product completely
                            or save it to your wishlist for later.
                        </p>

                        <div className="remove-modal-actions">

                            <button
                                className="wishlist-modal-button"
                                onClick={
                                    handleMoveToWishlist
                                }
                                disabled={removing}
                            >
                                {removing
                                    ? "Moving..."
                                    : "♡ Move to Wishlist"}
                            </button>

                            <button
                                className="confirm-remove-button"
                                onClick={
                                    handleRemoveItem
                                }
                                disabled={removing}
                            >
                                {removing
                                    ? "Removing..."
                                    : "Remove"}
                            </button>

                        </div>

                        <button
                            className="cancel-modal-button"
                            onClick={() =>
                                setRemoveItem(null)
                            }
                            disabled={removing}
                        >
                            Keep in Cart
                        </button>

                    </div>
                </div>
            )}
        </main>
    );
}