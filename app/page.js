"use client";

import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch("/api/products");
        const data = await response.json();

        if (data.success) {
          setProducts(data.products);
        }
      } catch (error) {
        console.error(
          "Failed to fetch products:",
          error
        );
      }
    }

    fetchProducts();
  }, []);

  return (
    <main className="home-page">

      {/* Hero Section */}
      <section className="hero">

        {/* Left Content */}
        <div className="hero-content">

          <p className="hero-eyebrow">
            EVERYDAY SKINCARE · SIMPLY BETTER
          </p>

          <h1>
            Skincare
            <span>that feels</span>
            like you.
          </h1>

          <p className="hero-description">
            Thoughtfully chosen skincare for your everyday ritual,
            made to nourish your skin and bring out your natural glow.
          </p>

          <div className="hero-actions">

            <a
              href="/products"
              className="primary-button"
            >
              Shop Collection
              <span>→</span>
            </a>

            <a
              href="#categories"
              className="secondary-link"
            >
              Explore skincare
            </a>

          </div>

        </div>

        {/* Right Visual */}
        <div className="hero-visual">

          <div className="hero-circle"></div>

          <div className="product-display">

            <div className="product-shadow"></div>

            <img
              src="/images/hero/daily-serum.png"
              alt="GlowCare Daily Serum"
              className="hero-product-image"
            />

          </div>

          <div className="floating-note">

            <span className="note-dot"></span>

            Gentle · Simple · Effective

          </div>

        </div>

        {/* Small Hero Indicator */}
        <div className="hero-indicator">

          <span>01</span>

          <div className="indicator-line"></div>

          <span>03</span>

        </div>

      </section>

      {/* Intro Strip */}
      <section className="intro-strip">

        <p>
          Skincare made for real routines,
          real skin and everyday glow.
        </p>

      </section>

      {/* Categories Section */}
      <section
        className="categories-section"
        id="categories"
      >

        <div className="section-heading">

          <p className="section-eyebrow">
            EXPLORE OUR COLLECTION
          </p>

          <h2>
            Find your
            <span>skin essentials.</span>
          </h2>

          <p className="section-description">
            Simple, thoughtful skincare for every
            step of your daily routine.
          </p>

        </div>

    <div className="category-grid">

  {/* Face Wash */}
  <a
    href="/products?category=face-wash"
    className="category-card category-face"
  >
    <img
      src="/images/categories/face-wash.jpeg"
      alt="Face Wash"
      className="category-image"
    />

    <div className="category-overlay"></div>

    <div className="category-number">
      01
    </div>

    <div className="category-content">
      <p>Cleanse</p>

      <h3>Face Wash</h3>

      <span>Explore →</span>
    </div>
  </a>


  {/* Serums */}
  <a
    href="/products?category=serums"
    className="category-card category-serum"
  >
    <img
      src="/images/categories/serums.jpeg"
      alt="Serums"
      className="category-image"
    />

    <div className="category-overlay"></div>

    <div className="category-number">
      02
    </div>

    <div className="category-content">
      <p>Treat</p>

      <h3>Serums</h3>

      <span>Explore →</span>
    </div>
  </a>


  {/* Moisturizers */}
  <a
    href="/products?category=moisturizers"
    className="category-card category-moisturizer"
  >
    <img
      src="/images/categories/moisturizers.jpeg"
      alt="Moisturizers"
      className="category-image"
    />

    <div className="category-overlay"></div>

    <div className="category-number">
      03
    </div>

    <div className="category-content">
      <p>Hydrate</p>

      <h3>Moisturizers</h3>

      <span>Explore →</span>
    </div>
  </a>


  {/* Sunscreen */}
  <a
    href="/products?category=sunscreen"
    className="category-card category-sunscreen"
  >
    <img
      src="/images/categories/sunscreen.jpeg"
      alt="Sunscreen"
      className="category-image"
    />

    <div className="category-overlay"></div>

    <div className="category-number">
      04
    </div>

    <div className="category-content">
      <p>Protect</p>

      <h3>Sunscreen</h3>

      <span>Explore →</span>
    </div>
  </a>


  {/* Toners */}
  <a
    href="/products?category=toners"
    className="category-card category-toner"
  >
    <img
      src="/images/categories/toners.jpeg"
      alt="Toners"
      className="category-image"
    />

    <div className="category-overlay"></div>

    <div className="category-number">
      05
    </div>

    <div className="category-content">
      <p>Balance</p>

      <h3>Toners</h3>

      <span>Explore →</span>
    </div>
  </a>


  {/* Lip Care */}
  <a
    href="/products?category=lip-care"
    className="category-card category-lip"
  >
    <img
      src="/images/categories/lip-care.jpeg"
      alt="Lip Care"
      className="category-image"
    />

    <div className="category-overlay"></div>

    <div className="category-number">
      06
    </div>

    <div className="category-content">
      <p>Nourish</p>

      <h3>Lip Care</h3>

      <span>Explore →</span>
    </div>
  </a>

</div>

      </section>

            {/* GlowCare Ritual */}
      <section className="ritual-section">

        <div className="ritual-heading">

          <p className="section-eyebrow">
            THE GLOWCARE RITUAL
          </p>

          <h2>
            A simple routine,
            <span>made for you.</span>
          </h2>

          <p className="ritual-description">
            Three simple steps to keep your everyday
            skincare routine thoughtful and effortless.
          </p>

        </div>


        <div className="ritual-grid">

          {/* Step 01 */}
          <div className="ritual-card">

            <div className="ritual-number">
              01
            </div>

            <div className="ritual-line"></div>

            <p className="ritual-step">
              CLEANSE
            </p>

            <h3>
              Start fresh.
            </h3>

            <p className="ritual-text">
              Gently cleanse away daily buildup
              and prepare your skin for the steps ahead.
            </p>

            <a
              href="/products?category=face-wash"
              className="ritual-link"
            >
              Face Wash
              <span>→</span>
            </a>

          </div>


          {/* Step 02 */}
          <div className="ritual-card">

            <div className="ritual-number">
              02
            </div>

            <div className="ritual-line"></div>

            <p className="ritual-step">
              TREAT
            </p>

            <h3>
              Give it care.
            </h3>

            <p className="ritual-text">
              Choose targeted skincare that fits
              what your skin needs every day.
            </p>

            <a
              href="/products?category=serums"
              className="ritual-link"
            >
              Serums
              <span>→</span>
            </a>

          </div>


          {/* Step 03 */}
          <div className="ritual-card">

            <div className="ritual-number">
              03
            </div>

            <div className="ritual-line"></div>

            <p className="ritual-step">
              HYDRATE
            </p>

            <h3>
              Lock in the glow.
            </h3>

            <p className="ritual-text">
              Finish with comfortable hydration
              to keep your skin feeling soft and cared for.
            </p>

            <a
              href="/products?category=moisturizers"
              className="ritual-link"
            >
              Moisturizers
              <span>→</span>
            </a>

          </div>

        </div>

      </section>

      {/* Featured Products */}
      <section className="featured-section">

        <div className="featured-heading">

          <div>

            <p className="section-eyebrow">
              OUR EDIT
            </p>

            <h2>
              Everyday
              <span>essentials.</span>
            </h2>

          </div>

          <a
            href="/products"
            className="view-all-link"
          >
            View all products →
          </a>

        </div>

        <div className="product-grid">

          {products.map((product) => (
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