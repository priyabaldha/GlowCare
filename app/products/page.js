"use client";

import { useEffect, useState } from "react";
import ProductCard from "../../components/ProductCard";

const categories = [
    "All",
    "Face Wash",
    "Serums",
    "Moisturizers",
    "Sunscreen",
];

export default function ProductsPage() {
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await fetch("/api/products");

                const data = await response.json();

                if (data.success) {
                    setProducts(data.products);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    const filteredProducts =
        selectedCategory === "All"
            ? products
            : products.filter(
                (product) => product.category === selectedCategory
            );

    if (loading) {
        return (
            <main className="products-page">
                <section className="products-loading">
                    <p>Preparing your glow...</p>
                </section>
            </main>
        );
    }
    return (
        <main className="products-page">

            {/* Page Header */}
            <section className="products-header">

                <p className="section-eyebrow">
                    THE GLOWCARE COLLECTION
                </p>

                <h1>
                    Skincare for
                    <span>every ritual.</span>
                </h1>

                <p className="products-intro">
                    Discover thoughtfully selected essentials designed to make
                    your everyday skincare routine feel a little more special.
                </p>

            </section>

            {/* Category Navigation */}
            <section className="products-content">

                <div className="products-toolbar">

                    <div className="category-filters">
                        {/* <button className="filter-button active">
                            All
                        </button>

                        <button className="filter-button">
                            Face Wash
                        </button>

                        <button className="filter-button">
                            Serums
                        </button>

                        <button className="filter-button">
                            Moisturizers
                        </button>

                        <button className="filter-button">
                            Sunscreen
                        </button> */}

                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`filter-button ${selectedCategory === category ? "active" : ""
                                    }`}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    <p className="product-count">
                        {filteredProducts.length} products
                    </p>

                </div>

                {/* Products */}
                <div className="product-grid products-page-grid">

                    {filteredProducts.map((product) => (
                        <ProductCard
                            key={product._id}
                            product={product}
                        />
                    ))}

                </div>

            </section>

        </main>
    );
}