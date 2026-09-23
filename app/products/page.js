"use client";

import { useEffect, useMemo, useState } from "react";
import ProductCard from "../../components/ProductCard";

const shopCategories = [
    "All",
    "Face Wash",
    "Serums",
    "Moisturizers",
    "Sunscreen",
];

const sortOptions = [
    { value: "featured", label: "Featured" },
    { value: "newest", label: "Newest" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Rating: High to Low" },
    { value: "name", label: "Name: A to Z" },
];

export default function ProductsPage() {
    const [selectedCategory, setSelectedCategory] =
        useState("All");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search
    const [searchQuery, setSearchQuery] = useState("");

    // Price filter
    const [maxPrice, setMaxPrice] = useState(2000);

    // Rating filter
    const [minRating, setMinRating] = useState(0);

    // Stock filter
    const [inStockOnly, setInStockOnly] = useState(false);

    // Sorting
    const [sortBy, setSortBy] = useState("featured");

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch(
                    "/api/products"
                );

                const data = await response.json();

                if (data.success) {
                    setProducts(data.products);
                }
            } catch (error) {
                console.error(
                    "Failed to fetch products:",
                    error
                );
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    /*
     * FILTER + SEARCH + SORT
     */
    const displayedProducts = useMemo(() => {
        let result = [...products];

        /* Category */
        if (selectedCategory !== "All") {
            result = result.filter(
                (product) =>
                    product.category ===
                    selectedCategory
            );
        }

        /* Search */
        const search = searchQuery
            .trim()
            .toLowerCase();

        if (search) {
            result = result.filter((product) => {
                const name =
                    product.name?.toLowerCase() || "";

                const shortName =
                    product.shortName?.toLowerCase() || "";

                const category =
                    product.category?.toLowerCase() || "";

                return (
                    name.includes(search) ||
                    shortName.includes(search) ||
                    category.includes(search)
                );
            });
        }

        /* Price */
        result = result.filter(
            (product) =>
                Number(product.price) <= maxPrice
        );

        /* Rating */
        if (minRating > 0) {
            result = result.filter(
                (product) =>
                    Number(product.rating || 0) >=
                    minRating
            );
        }

        /* Stock */
        if (inStockOnly) {
            result = result.filter(
                (product) =>
                    Number(product.stock || 0) > 0
            );
        }

        /* Sorting */
        switch (sortBy) {
            case "newest":
                result.sort(
                    (a, b) =>
                        new Date(b.createdAt) -
                        new Date(a.createdAt)
                );
                break;

            case "price-low":
                result.sort(
                    (a, b) =>
                        Number(a.price) -
                        Number(b.price)
                );
                break;

            case "price-high":
                result.sort(
                    (a, b) =>
                        Number(b.price) -
                        Number(a.price)
                );
                break;

            case "rating":
                result.sort(
                    (a, b) =>
                        Number(b.rating || 0) -
                        Number(a.rating || 0)
                );
                break;

            case "name":
                result.sort((a, b) =>
                    (a.name || "").localeCompare(
                        b.name || ""
                    )
                );
                break;

            case "featured":
            default:
                break;
        }

        return result;
    }, [
        products,
        selectedCategory,
        searchQuery,
        maxPrice,
        minRating,
        inStockOnly,
        sortBy,
    ]);

    function clearFilters() {
        setSelectedCategory("All");
        setSearchQuery("");
        setMaxPrice(2000);
        setMinRating(0);
        setInStockOnly(false);
        setSortBy("featured");
    }

    if (loading) {
        return (
            <main className="gc-shop-page">
                <section className="gc-shop-loading">
                    <p className="gc-shop-eyebrow">
                        THE GLOWCARE COLLECTION
                    </p>

                    <h1>
                        Preparing your
                        <span>glow.</span>
                    </h1>
                </section>
            </main>
        );
    }

    return (
        <main className="gc-shop-page">

            {/* =========================================
                SHOP HERO
            ========================================= */}

            <section className="gc-shop-hero">

                <div className="gc-shop-hero-content">

                    <p className="gc-shop-eyebrow">
                        THE GLOWCARE COLLECTION
                    </p>

                    <h1>
                        Skincare for
                        <span>every ritual.</span>
                    </h1>

                    <p className="gc-shop-intro">
                        Discover thoughtfully selected
                        essentials designed to make your
                        everyday skincare routine feel a
                        little more special.
                    </p>

                </div>

                <div className="gc-shop-hero-number">
                    02
                </div>

            </section>


            {/* =========================================
                SHOP CONTENT
            ========================================= */}

            <section className="gc-shop-content">

                {/* SEARCH + SORT */}
                <div className="gc-shop-topbar">

                    <div className="gc-shop-search">

                        <span className="gc-shop-search-icon">
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={(event) =>
                                setSearchQuery(
                                    event.target.value
                                )
                            }
                        />

                        {searchQuery && (
                            <button
                                type="button"
                                className="gc-shop-search-clear"
                                onClick={() =>
                                    setSearchQuery("")
                                }
                                aria-label="Clear search"
                            >
                                ×
                            </button>
                        )}

                    </div>


                    <div className="gc-shop-sort">

                        <span>
                            SORT BY
                        </span>

                        <select
                            value={sortBy}
                            onChange={(event) =>
                                setSortBy(
                                    event.target.value
                                )
                            }
                        >
                            {sortOptions.map(
                                (option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                )
                            )}
                        </select>

                    </div>

                </div>


               

                {/* =====================================
                    ADVANCED FILTERS
                ===================================== */}

                <div className="gc-shop-advanced">

                    {/* PRICE */}

                    <div className="gc-shop-filter-group">

                        <div className="gc-shop-filter-heading">
                            <span>PRICE</span>

                            <strong>
                                Up to ₹{maxPrice}
                            </strong>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="2000"
                            step="50"
                            value={maxPrice}
                            onChange={(event) =>
                                setMaxPrice(
                                    Number(
                                        event.target.value
                                    )
                                )
                            }
                            className="gc-shop-range"
                        />

                    </div>


                    {/* RATING */}

                    <div className="gc-shop-filter-group">

                        <div className="gc-shop-filter-heading">
                            <span>RATING</span>

                            <strong>
                                {minRating === 0
                                    ? "All"
                                    : `${minRating}+ ★`}
                            </strong>
                        </div>

                        <div className="gc-shop-rating-buttons">

                            {[0, 3, 4, 4.5].map(
                                (rating) => (
                                    <button
                                        key={rating}
                                        type="button"
                                        className={
                                            minRating ===
                                            rating
                                                ? "active"
                                                : ""
                                        }
                                        onClick={() =>
                                            setMinRating(
                                                rating
                                            )
                                        }
                                    >
                                        {rating === 0
                                            ? "All"
                                            : `${rating}+ ★`}
                                    </button>
                                )
                            )}

                        </div>

                    </div>


                    {/* STOCK */}

                    <label className="gc-shop-stock">

                        <input
                            type="checkbox"
                            checked={inStockOnly}
                            onChange={(event) =>
                                setInStockOnly(
                                    event.target.checked
                                )
                            }
                        />

                        <span className="gc-shop-check">
                            ✓
                        </span>

                        <span>
                            In stock only
                        </span>

                    </label>


                    {/* CLEAR */}

                    <button
                        type="button"
                        className="gc-shop-clear"
                        onClick={clearFilters}
                    >
                        Clear filters
                    </button>

                </div>


                 {/* =====================================
                    FILTER TOOLBAR
                ===================================== */}

                <div className="gc-shop-toolbar">

                    <div className="gc-shop-filters">

                        {shopCategories.map(
                            (category) => (
                                <button
                                    key={category}
                                    type="button"
                                    className={`gc-shop-filter ${
                                        selectedCategory ===
                                        category
                                            ? "gc-shop-filter-active"
                                            : ""
                                    }`}
                                    onClick={() =>
                                        setSelectedCategory(
                                            category
                                        )
                                    }
                                >
                                    {category}
                                </button>
                            )
                        )}

                    </div>


                    <p className="gc-shop-count">
                        {displayedProducts.length}{" "}
                        {displayedProducts.length === 1
                            ? "product"
                            : "products"}
                    </p>

                </div>

                {/* =====================================
                    PRODUCTS
                ===================================== */}

                {displayedProducts.length > 0 ? (

                    <div className="gc-shop-product-grid">

                        {displayedProducts.map(
                            (product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            )
                        )}

                    </div>

                ) : (

                    <div className="gc-shop-empty">

                        <p className="gc-shop-eyebrow">
                            NO MATCHES
                        </p>

                        <h2>
                            Nothing found for
                            <span>this search.</span>
                        </h2>

                        <p className="gc-shop-empty-text">
                            Try another search or remove
                            some filters to explore the
                            full GlowCare collection.
                        </p>

                        <button
                            type="button"
                            onClick={clearFilters}
                        >
                            View all products →
                        </button>

                    </div>

                )}

            </section>

        </main>
    );
}