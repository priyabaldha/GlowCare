"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ProductDetailsPage({ params }) {
    const { id } = use(params);

    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    const [addingToCart, setAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState("");

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    // Fetch product
    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await fetch(
                    `/api/products/${id}`
                );

                const data = await response.json();

                if (data.success) {
                    setProduct(data.product);
                }
            } catch (error) {
                console.error(
                    "Failed to fetch product:",
                    error
                );
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [id]);

    // Check wishlist
    useEffect(() => {
        async function checkWishlist() {
            try {
                const response = await fetch(
                    "/api/wishlist"
                );

                if (!response.ok) {
                    return;
                }

                const data = await response.json();

                if (data.success) {
                    const exists =
                        data.wishlist?.products?.some(
                            (item) =>
                                item._id?.toString() ===
                                id.toString()
                        );

                    setIsWishlisted(exists);
                }
            } catch (error) {
                console.error(
                    "Failed to check wishlist:",
                    error
                );
            }
        }

        checkWishlist();
    }, [id]);

    // Add / Remove Wishlist
    async function handleWishlist() {
        if (wishlistLoading) {
            return;
        }

        setWishlistLoading(true);

        const oldState = isWishlisted;

        // Update UI immediately
        setIsWishlisted(!oldState);

        try {
            const response = await fetch(
                "/api/wishlist",
                {
                    method: oldState
                        ? "DELETE"
                        : "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        productId: id,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                setIsWishlisted(oldState);

                alert(
                    data.message ||
                        "Please login first."
                );
            }
        } catch (error) {
            console.error(
                "Wishlist error:",
                error
            );

            setIsWishlisted(oldState);
        } finally {
            setWishlistLoading(false);
        }
    }

    // Add to Cart
    async function handleAddToCart() {
        setAddingToCart(true);
        setCartMessage("");

        try {
            const response = await fetch(
                "/api/cart",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        productId: product._id,
                        quantity: quantity,
                    }),
                }
            );

            const responseText =
                await response.text();

            console.log(
                "CART API RESPONSE:",
                response.status,
                responseText
            );

            if (!response.ok) {
                setCartMessage(
                    "Failed to add product to cart."
                );
                return;
            }

            const data =
                JSON.parse(responseText);

            if (data.success) {
                setCartMessage(
                    "Added to your bag!"
                );
            } else {
                setCartMessage(
                    data.message ||
                        "Failed to add product."
                );
            }
        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );

            setCartMessage(
                "Something went wrong."
            );
        } finally {
            setAddingToCart(false);
        }
    }

    // Loading
    if (loading) {
        return (
            <main className="product-loading">
                <p>
                    Preparing your glow...
                </p>
            </main>
        );
    }

    // Product not found
    if (!product) {
        return (
            <main className="product-not-found">

                <h1>
                    Product not found
                </h1>

                <p>
                    Sorry, we couldn't find the
                    product you're looking for.
                </p>

                <Link
                    href="/products"
                    className="primary-button"
                >
                    Back to Shop
                </Link>

            </main>
        );
    }

    return (
        <main className="product-details-page">

            {/* Breadcrumb */}
            <div className="product-breadcrumb">

                <Link href="/">
                    Home
                </Link>

                <span>/</span>

                <Link href="/products">
                    Shop
                </Link>

                <span>/</span>

                <span>
                    {product.name}
                </span>

            </div>

            {/* Product Details */}
            <section className="product-details">

                {/* Product Image */}
                <div className="product-details-image">

                    <div className="details-image-placeholder">

                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="details-product-image"
                        />

                    </div>

                </div>

                {/* Product Information */}
                <div className="product-details-info">

                    <p className="product-category">
                        {product.category}
                    </p>

                    <h1>
                        {product.name}
                    </h1>

                    <div className="details-rating">

                        <span>
                            ★ {product.rating}
                        </span>

                        <span>·</span>

                        <span>
                            24 reviews
                        </span>

                    </div>

                    <p className="details-total">
                        Total: ₹
                        {product.price * quantity}
                    </p>

                    <div className="details-divider"></div>

                    <p className="details-description">
                        A thoughtfully formulated
                        skincare essential designed
                        to fit effortlessly into your
                        everyday routine. Gentle,
                        simple and made for your
                        natural glow.
                    </p>

                    {/* Quantity */}
                    <div className="quantity-section">

                        <span>
                            Quantity
                        </span>

                        <div className="quantity-control">

                            <button
                                onClick={() =>
                                    setQuantity(
                                        (current) =>
                                            Math.max(
                                                1,
                                                current - 1
                                            )
                                    )
                                }
                            >
                                −
                            </button>

                            <span>
                                {quantity}
                            </span>

                            <button
                                onClick={() =>
                                    setQuantity(
                                        (current) =>
                                            current + 1
                                    )
                                }
                            >
                                +
                            </button>

                        </div>

                    </div>

                    {/* Product Actions */}
                    <div className="product-action-row">

                        {/* Add to Cart */}
                        <button
                            className="add-to-cart-button"
                            onClick={handleAddToCart}
                            disabled={addingToCart}
                        >
                            {addingToCart
                                ? "Adding..."
                                : "Add to Bag"}

                            <span>→</span>
                        </button>

                        {/* Wishlist */}
                        <button
                            type="button"
                            className={`details-wishlist-button ${
                                isWishlisted
                                    ? "wishlist-active"
                                    : ""
                            }`}
                            onClick={handleWishlist}
                            disabled={wishlistLoading}
                            aria-label={
                                isWishlisted
                                    ? "Remove from wishlist"
                                    : "Add to wishlist"
                            }
                        >
                            <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill={
                                    isWishlisted
                                        ? "currentColor"
                                        : "none"
                                }
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path
                                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
                                />
                            </svg>
                        </button>

                    </div>

                    {/* Cart Message */}
                    {cartMessage && (
                        <p className="cart-message">
                            {cartMessage}
                        </p>
                    )}

                    {/* Product Notes */}
                    <div className="product-notes">

                        <div>
                            <span>01</span>

                            <p>
                                Gentle formula
                            </p>
                        </div>

                        <div>
                            <span>02</span>

                            <p>
                                Everyday essential
                            </p>
                        </div>

                        <div>
                            <span>03</span>

                            <p>
                                GlowCare approved
                            </p>
                        </div>

                    </div>

                </div>

            </section>

        </main>
    );
}