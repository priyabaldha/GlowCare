"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WishlistPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    async function fetchWishlist() {
        try {
            const response = await fetch(
                "/api/wishlist",
                {
                    cache: "no-store",
                }
            );

            const data = await response.json();

            if (data.success) {
                setProducts(
                    data.wishlist?.products || []
                );
            }
        } catch (error) {
            console.error(
                "Failed to fetch wishlist:",
                error
            );
        } finally {
            setLoading(false);
        }
    }

    async function removeFromWishlist(productId) {
        try {
            const response = await fetch(
                "/api/wishlist",
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        productId,
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                setProducts((current) =>
                    current.filter(
                        (product) =>
                            product._id !== productId
                    )
                );
            }
        } catch (error) {
            console.error(
                "Remove wishlist error:",
                error
            );
        }
    }

    async function addToCart(productId) {
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
                        productId,
                        quantity: 1,
                    }),
                }
            );

            const data = await response.json();

            if (data.success) {
                alert("Added to your bag!");
            } else {
                alert(
                    data.message ||
                        "Failed to add to cart."
                );
            }
        } catch (error) {
            console.error(
                "Add to cart error:",
                error
            );
        }
    }

    /* ================================
       LOADING
    ================================= */

    if (loading) {
        return (
            <main className="wishlist-page">

                <section className="wishlist-loading">

                    <p className="section-eyebrow">
                        YOUR GLOWCARE WISHLIST
                    </p>

                    <h1>
                        Your
                        <span>favorites.</span>
                    </h1>

                    <p>
                        Loading your saved products...
                    </p>

                </section>

            </main>
        );
    }


    /* ================================
       EMPTY
    ================================= */

    if (products.length === 0) {
        return (
            <main className="wishlist-page">

                <section className="wishlist-empty">

                    <p className="section-eyebrow">
                        YOUR GLOWCARE WISHLIST
                    </p>

                    <h1>
                        Nothing here
                        <span>yet.</span>
                    </h1>

                    <p>
                        Save the skincare essentials
                        you love and find them here
                        whenever you need them.
                    </p>

                    <Link
                        href="/products"
                        className="wishlist-explore-button"
                    >
                        Explore Products
                        <span>→</span>
                    </Link>

                </section>

            </main>
        );
    }


    /* ================================
       WISHLIST
    ================================= */

    return (
        <main className="wishlist-page">

            {/* Header */}

            <section className="wishlist-header">

                <p className="section-eyebrow">
                    YOUR GLOWCARE WISHLIST
                </p>

                <h1>
                    Your
                    <span>favorites.</span>
                </h1>

                <p>
                    The products you've saved
                    for later.
                </p>

            </section>


            {/* Products */}

            <section className="wishlist-grid">

                {products.map((product) => (
                    <article
                        className="wishlist-card"
                        key={product._id}
                    >

                        {/* Image */}

                        <div className="wishlist-image-wrap">

                            <Link
                                href={`/products/${product._id}`}
                                className="wishlist-image"
                            >
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    sizes="
                                        (max-width: 600px) 100vw,
                                        (max-width: 1000px) 50vw,
                                        33vw
                                    "
                                    className="wishlist-product-image"
                                />
                            </Link>


                            {/* Remove */}

                            <button
                                type="button"
                                className="wishlist-remove"
                                onClick={() =>
                                    removeFromWishlist(
                                        product._id
                                    )
                                }
                                aria-label={`Remove ${product.name} from wishlist`}
                            >
                                ×
                            </button>

                        </div>


                        {/* Product Info */}

                        <div className="wishlist-info">

                            <p className="wishlist-category">
                                {product.category}
                            </p>

                            <Link
                                href={`/products/${product._id}`}
                                className="wishlist-product-link"
                            >
                                <h2>
                                    {product.name}
                                </h2>
                            </Link>

                            <p className="wishlist-price">
                                ₹{product.price}
                            </p>


                            {/* Add to bag */}

                            <button
                                type="button"
                                className="wishlist-add-button"
                                onClick={() =>
                                    addToCart(
                                        product._id
                                    )
                                }
                            >
                                <span>
                                    Add to Bag
                                </span>

                                <span className="wishlist-add-arrow">
                                    →
                                </span>
                            </button>

                        </div>

                    </article>
                ))}

            </section>

        </main>
    );
}