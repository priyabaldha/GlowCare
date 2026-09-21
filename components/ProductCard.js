"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
    const [isWishlisted, setIsWishlisted] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [cartLoading, setCartLoading] =
        useState(false);

    const { addToCart } = useCart();

    useEffect(() => {
        checkWishlist();
    }, [product._id]);

    async function checkWishlist() {
        try {
            const response =
                await fetch("/api/wishlist");

            if (!response.ok) {
                return;
            }

            const data =
                await response.json();

            if (data.success) {
                const exists =
                    data.wishlist?.products?.some(
                        (item) =>
                            item._id?.toString() ===
                            product._id?.toString()
                    );

                setIsWishlisted(exists);
            }
        } catch (error) {
            console.error(
                "Wishlist check error:",
                error
            );
        }
    }

    async function handleWishlist() {
        if (loading) return;

        setLoading(true);

        const oldState =
            isWishlisted;

        setIsWishlisted(!oldState);

        try {
            const response =
                await fetch(
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
                            productId:
                                product._id,
                        }),
                    }
                );

            const data =
                await response.json();

            if (
                !response.ok ||
                !data.success
            ) {
                setIsWishlisted(
                    oldState
                );

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

            setIsWishlisted(
                oldState
            );

            alert(
                "Something went wrong with wishlist."
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleAddToCart() {
        if (cartLoading) return;

        setCartLoading(true);

        try {
            const success =
                await addToCart(
                    product,
                    1
                );

            if (success) {
                alert(
                    "Added to your bag!"
                );
            } else {
                alert(
                    "Please login first."
                );
            }
        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );

            alert(
                "Something went wrong. Please try again."
            );
        } finally {
            setCartLoading(false);
        }
    }

    return (
        <article className="product-card">

            {/* Product Image */}
            <div className="product-image-wrapper">

                <Link
                    href={`/products/${product._id}`}
                    className="product-image-link"
                >
                    <div className="product-image-placeholder">

                        <Image
                            src={
                                product.image?.startsWith("/")
                                    ? product.image
                                    : "/images/products/placeholder.png"
                            }
                            alt={product.name}
                            fill
                            className="product-card-image"
                            sizes="(max-width: 650px) 100vw, (max-width: 1100px) 50vw, 25vw"
                        />

                    </div>
                </Link>

                {/* Wishlist */}
                <button
                    type="button"
                    className={`wishlist-button ${
                        isWishlisted
                            ? "wishlist-active"
                            : ""
                    }`}
                    onClick={
                        handleWishlist
                    }
                    disabled={loading}
                    aria-label={
                        isWishlisted
                            ? "Remove from wishlist"
                            : "Add to wishlist"
                    }
                >
                    <svg
                        width="21"
                        height="21"
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

                {/* Add To Cart */}
                <button
                    type="button"
                    className="cart-icon-button"
                    onClick={
                        handleAddToCart
                    }
                    disabled={
                        cartLoading
                    }
                    aria-label="Add to cart"
                >
                    <svg
                        width="19"
                        height="19"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle
                            cx="9"
                            cy="20"
                            r="1"
                        />

                        <circle
                            cx="19"
                            cy="20"
                            r="1"
                        />

                        <path
                            d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 8H6"
                        />
                    </svg>
                </button>

            </div>

            {/* Product Information */}
            <div className="product-info">

                <div className="product-category">
                    {product.category}
                </div>

                <Link
                    href={`/products/${product._id}`}
                >
                    <h3>
                        {product.name}
                    </h3>
                </Link>

                <div className="product-bottom">

                    <span className="product-price">
                        ₹{product.price}
                    </span>

                    <span className="product-rating">
                        ★ {product.rating}
                    </span>

                </div>

            </div>

        </article>
    );
}