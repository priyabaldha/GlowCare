"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "../../../context/CartContext";

export default function ProductDetailsPage({ params }) {
    const { id } = use(params);

    const { fetchCart } = useCart();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);
const [loading, setLoading] = useState(true);

const [selectedImage, setSelectedImage] = useState("");
    const [addingToCart, setAddingToCart] = useState(false);
    const [cartMessage, setCartMessage] = useState("");

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    const [reviews, setReviews] = useState([]);
    const [averageRating, setAverageRating] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);

    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState("");

    const [reviewLoading, setReviewLoading] = useState(false);
    const [reviewMessage, setReviewMessage] = useState("");
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

                setSelectedImage(
                    data.product.image
                );
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

    // Fetch product reviews
useEffect(() => {
    async function fetchReviews() {
        try {
            const response = await fetch(
                `/api/reviews?productId=${id}`
            );

            const data = await response.json();

            if (data.success) {
                setReviews(data.reviews || []);
                setAverageRating(
                    data.averageRating || 0
                );
                setTotalReviews(
                    data.totalReviews || 0
                );
            }
        } catch (error) {
            console.error(
                "Failed to fetch reviews:",
                error
            );
        }
    }

    fetchReviews();
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
                await fetchCart();

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
    // Submit Review
async function handleSubmitReview(event) {
    event.preventDefault();

    setReviewMessage("");

    if (reviewRating === 0) {
        setReviewMessage(
            "Please select a rating."
        );
        return;
    }

    if (!reviewComment.trim()) {
        setReviewMessage(
            "Please write a review."
        );
        return;
    }

    setReviewLoading(true);

    try {
        const response = await fetch(
            "/api/reviews",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    productId: id,
                    rating: reviewRating,
                    comment:
                        reviewComment.trim(),
                }),
            }
        );

        const data =
            await response.json();

        if (!response.ok || !data.success) {
            setReviewMessage(
                data.message ||
                    "Failed to submit review."
            );
            return;
        }

        setReviewMessage(
            "Thank you for your review!"
        );

        setReviewRating(0);
        setReviewComment("");

        // Refresh reviews
        const reviewsResponse =
            await fetch(
                `/api/reviews?productId=${id}`
            );

        const reviewsData =
            await reviewsResponse.json();

        if (reviewsData.success) {
            setReviews(
                reviewsData.reviews || []
            );

            setAverageRating(
                reviewsData.averageRating || 0
            );

            setTotalReviews(
                reviewsData.totalReviews || 0
            );

            setProduct((current) => ({
                ...current,
                rating:
                    reviewsData.averageRating ||
                    current.rating,
            }));
        }
    } catch (error) {
        console.error(
            "Submit review error:",
            error
        );

        setReviewMessage(
            "Something went wrong."
        );
    } finally {
        setReviewLoading(false);
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
                {/* Product Images */}

<div className="product-details-image">
    <div className="details-image-main">
        <Image
            src={selectedImage || product.image}
            alt={product.name}
            fill
            className="details-product-image"
            sizes="(max-width: 900px) 100vw, 50vw"
        />
    </div>

    <div className="details-image-thumbnails">
        {[
            product.image,
            ...(product.images || []),
        ]
            .filter(Boolean)
            .map((image, index) => (
                <button
                    key={`${image}-${index}`}
                    type="button"
                    className={`details-image-thumbnail ${
                        selectedImage === image
                            ? "active"
                            : ""
                    }`}
                    onClick={() =>
                        setSelectedImage(image)
                    }
                >
                    <Image
                        src={image}
                        alt={`${product.name} image ${index + 1}`}
                        fill
                        sizes="90px"
                    />
                </button>
            ))}
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
        ★{" "}
        {averageRating > 0
            ? averageRating.toFixed(1)
            : "0.0"}
    </span>

    <span>·</span>

    <span>
        {totalReviews}{" "}
        {totalReviews === 1
            ? "review"
            : "reviews"}
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
                            className={`details-wishlist-button ${isWishlisted
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
                    


            {/* =========================================
                REVIEWS
            ========================================= */}

            <section className="reviews-section">

                <div className="reviews-header">

                    <div>
                        <p className="section-eyebrow">
                            CUSTOMER NOTES
                        </p>

                        <h2>
                            Reviews & ratings
                        </h2>

                        <p>
                            Honest thoughts from the
                            GlowCare community.
                        </p>
                    </div>

                    <div className="reviews-summary">

                        <strong>
                            {averageRating > 0
                                ? averageRating.toFixed(1)
                                : "0.0"}
                        </strong>

                        <div className="review-stars">
                            ★★★★★
                        </div>

                        <span>
                            {totalReviews}{" "}
                            {totalReviews === 1
                                ? "review"
                                : "reviews"}
                        </span>

                    </div>

                </div>


                {/* Review Form */}

                <div className="review-form-card">

                    <div>
                        <p className="section-eyebrow">
                            SHARE YOUR EXPERIENCE
                        </p>

                        <h3>
                            How did you like it?
                        </h3>

                        <p>
                            Purchased and received your
                            order? Tell us what you think.
                        </p>
                    </div>


                    <form
                        onSubmit={handleSubmitReview}
                        className="review-form"
                    >

                        <div className="review-rating-input">

                            <span>
                                Your rating
                            </span>

                            <div>
                                {[1, 2, 3, 4, 5].map(
                                    (star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={
                                                star <=
                                                reviewRating
                                                    ? "star-selected"
                                                    : ""
                                            }
                                            onClick={() =>
                                                setReviewRating(
                                                    star
                                                )
                                            }
                                            aria-label={`${star} star`}
                                        >
                                            ★
                                        </button>
                                    )
                                )}
                            </div>

                        </div>


                        <textarea
                            value={reviewComment}
                            onChange={(event) =>
                                setReviewComment(
                                    event.target.value
                                )
                            }
                            placeholder="Write your review..."
                            maxLength={500}
                        />


                        <div className="review-form-bottom">

                            <small>
                                {reviewComment.length}/500
                            </small>

                            <button
                                type="submit"
                                disabled={reviewLoading}
                            >
                                {reviewLoading
                                    ? "Submitting..."
                                    : "Submit review"}

                                <span>→</span>
                            </button>

                        </div>


                        {reviewMessage && (
                            <p className="review-message">
                                {reviewMessage}
                            </p>
                        )}

                    </form>

                </div>


                {/* Review List */}

                <div className="reviews-list">

                    {reviews.length === 0 ? (
                        <div className="reviews-empty">

                            <span>✦</span>

                            <h3>
                                Be the first to review
                            </h3>

                            <p>
                                Your experience could help
                                someone discover their next
                                skincare favourite.
                            </p>

                        </div>
                    ) : (
                        reviews.map((review) => (
                            <article
                                key={review._id}
                                className="review-card"
                            >

                                <div className="review-card-top">

                                    <div className="reviewer-info">

                                        <div className="reviewer-avatar">
                                            {review.user?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() ||
                                                "G"}
                                        </div>

                                        <div>

                                            <h4>
                                                {review.user?.name ||
                                                    "GlowCare customer"}
                                            </h4>

                                            <span>
                                                ✓ Verified purchase
                                            </span>

                                        </div>

                                    </div>


                                    <div className="review-date">
                                        {new Date(
                                            review.createdAt
                                        ).toLocaleDateString(
                                            "en-IN",
                                            {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            }
                                        )}
                                    </div>

                                </div>


                                <div className="review-card-rating">
                                    {"★".repeat(
                                        review.rating
                                    )}

                                    {"☆".repeat(
                                        5 - review.rating
                                    )}
                                </div>


                                <p className="review-comment">
                                    {review.comment}
                                </p>

                            </article>
                        ))
                    )}

                </div>

            </section>

    
        </main>
    );
}