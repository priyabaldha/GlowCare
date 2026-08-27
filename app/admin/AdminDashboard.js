"use client";

import { useEffect, useState } from "react";

export default function AdminPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        shortName: "",
        category: "Serums",
        price: "",
        rating: "",
        image: "",
        description: "",
        stock: "",
    });

    useEffect(() => {
        fetchProducts();
    }, []);

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
        } finally {
            setLoading(false);
        }
    }

    async function handleAdminLogout() {
        try {
            const response = await fetch(
                "/api/admin/logout",
                {
                    method: "POST",
                }
            );

            const data = await response.json();

            if (data.success) {
                window.location.href =
                    "/admin/login";
            }

        } catch (error) {
            console.error(
                "Admin logout error:",
                error
            );
        }
    }

    // =========================================
    // FORM INPUT
    // =========================================

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    // =========================================
    // IMAGE UPLOAD
    // =========================================

    async function handleImageChange(event) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            event.target.value = "";
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("Image must be smaller than 5MB.");
            event.target.value = "";
            return;
        }

        const previewUrl = URL.createObjectURL(file);

        setImagePreview(previewUrl);
        setUploadingImage(true);

        try {
            const uploadData = new FormData();

            uploadData.append("file", file);

            const response = await fetch(
                "/api/upload",
                {
                    method: "POST",
                    body: uploadData,
                }
            );

            const data = await response.json();

            if (!data.success) {
                alert(data.message);
                setImagePreview("");
                return;
            }

            setFormData((current) => ({
                ...current,
                image: data.imageUrl,
            }));

        } catch (error) {
            console.error(
                "Image upload error:",
                error
            );

            alert("Image upload failed.");

            setImagePreview("");

        } finally {
            setUploadingImage(false);
        }
    }

    // =========================================
    // OPEN ADD FORM
    // =========================================

    function openAddForm() {
        setEditingProduct(null);

        setFormData({
            name: "",
            shortName: "",
            category: "Serums",
            price: "",
            rating: "",
            image: "",
            description: "",
            stock: "",
        });

        setImagePreview("");

        setShowForm(true);
    }

    // =========================================
    // OPEN EDIT FORM
    // =========================================

    function openEditForm(product) {
        setEditingProduct(product);

        setFormData({
            name: product.name || "",
            shortName: product.shortName || "",
            category: product.category || "Serums",
            price: product.price ?? "",
            rating: product.rating ?? "",
            image: product.image || "",
            description: product.description || "",
            stock: product.stock ?? "",
        });

        setImagePreview(product.image || "");

        setShowForm(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    // =========================================
    // RESET FORM
    // =========================================

    function resetForm() {
        setEditingProduct(null);

        setFormData({
            name: "",
            shortName: "",
            category: "Serums",
            price: "",
            rating: "",
            image: "",
            description: "",
            stock: "",
        });

        setImagePreview("");

        setShowForm(false);
    }

    async function handleDeleteProduct(product) {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${product.name}"?`
        );

        if (!confirmed) {
            return;
        }

        try {
            const response = await fetch(
                `/api/products/${product._id}`,
                {
                    method: "DELETE",
                }
            );

            const data = await response.json();

            if (!data.success) {
                alert(data.message);
                return;
            }

            setProducts((current) =>
                current.filter(
                    (item) => item._id !== product._id
                )
            );

            alert("Product deleted successfully!");

        } catch (error) {
            console.error(
                "Delete product error:",
                error
            );

            alert(
                "Something went wrong while deleting the product."
            );
        }
    }

    // =========================================
    // CREATE / UPDATE PRODUCT
    // =========================================

    async function handleSubmit(event) {
        event.preventDefault();

        if (!formData.image) {
            alert("Please select a product image.");
            return;
        }

        if (uploadingImage) {
            alert(
                "Please wait for the image to finish uploading."
            );
            return;
        }

        try {
            const isEditing = Boolean(
                editingProduct
            );

            const url = isEditing
                ? `/api/products/${editingProduct._id}`
                : "/api/products";

            const method = isEditing
                ? "PUT"
                : "POST";

            const response = await fetch(url, {
                method,

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    ...formData,

                    price: Number(
                        formData.price
                    ),

                    rating: Number(
                        formData.rating
                    ),

                    stock: Number(
                        formData.stock
                    ),
                }),
            });

            const data = await response.json();

            if (!data.success) {
                alert(data.message);
                return;
            }

            if (isEditing) {
                // Replace updated product
                setProducts((current) =>
                    current.map((product) =>
                        product._id ===
                            data.product._id
                            ? data.product
                            : product
                    )
                );

                alert(
                    "Product updated successfully!"
                );
            } else {
                // Add new product
                setProducts((current) => [
                    data.product,
                    ...current,
                ]);
            }

            resetForm();

        } catch (error) {
            console.error(
                "Save product error:",
                error
            );

            alert(
                "Something went wrong while saving the product."
            );
        }
    }

    // =========================================
    // LOADING
    // =========================================

    if (loading) {
        return (
            <main className="admin-page">
                <p className="admin-loading">
                    Loading your GlowCare dashboard...
                </p>
            </main>
        );
    }

    return (
        <main className="admin-page">

            {/* =================================
                HEADER
            ================================= */}

            <section className="admin-header">

                <div>

                    <p className="section-eyebrow">
                        GLOWCARE ADMIN
                    </p>

                    <h1>
                        Product
                        <span>studio.</span>
                    </h1>

                </div>
                

                <button
                    className="admin-add-button"
                    onClick={
                        showForm
                            ? resetForm
                            : openAddForm
                    }
                >
                    {showForm
                        ? "Close Form"
                        : "+ Add Product"}
                </button>

            </section>

            {/* =================================
                PRODUCT FORM
            ================================= */}

            {showForm && (
                <section className="admin-product-form">

                    <div className="admin-form-heading">

                        <div>

                            <p className="section-eyebrow">
                                {editingProduct
                                    ? "EDIT PRODUCT"
                                    : "NEW PRODUCT"}
                            </p>

                            <h2>
                                {editingProduct
                                    ? "Update your product"
                                    : "Add to your collection"}
                            </h2>

                        </div>

                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="admin-form-grid">

                            {/* Product Name */}

                            <div className="admin-field">

                                <label>
                                    Product Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. Rose Glow Serum"
                                    required
                                />

                            </div>

                            {/* Short Name */}

                            <div className="admin-field">

                                <label>
                                    Short Name
                                </label>

                                <input
                                    type="text"
                                    name="shortName"
                                    value={
                                        formData.shortName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. SERUM"
                                    required
                                />

                            </div>

                            {/* Category */}

                            <div className="admin-field">

                                <label>
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={
                                        formData.category
                                    }
                                    onChange={
                                        handleChange
                                    }
                                >

                                    <option value="Face Wash">
                                        Face Wash
                                    </option>

                                    <option value="Serums">
                                        Serums
                                    </option>

                                    <option value="Moisturizers">
                                        Moisturizers
                                    </option>

                                    <option value="Sunscreen">
                                        Sunscreen
                                    </option>

                                </select>

                            </div>

                            {/* Price */}

                            <div className="admin-field">

                                <label>
                                    Price
                                </label>

                                <input
                                    type="number"
                                    name="price"
                                    value={
                                        formData.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="699"
                                    min="0"
                                    required
                                />

                            </div>

                            {/* Rating */}

                            <div className="admin-field">

                                <label>
                                    Rating
                                </label>

                                <input
                                    type="number"
                                    name="rating"
                                    value={
                                        formData.rating
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="4.8"
                                    min="0"
                                    max="5"
                                    step="0.1"
                                    required
                                />

                            </div>

                            {/* Stock */}

                            <div className="admin-field">

                                <label>
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    name="stock"
                                    value={
                                        formData.stock
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="25"
                                    min="0"
                                    required
                                />

                            </div>

                            {/* Product Image */}

                            <div className="admin-field admin-field-full">

                                <label>
                                    Product Image
                                </label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={
                                        handleImageChange
                                    }
                                    required={!editingProduct}
                                />

                                {imagePreview && (
                                    <div className="admin-image-preview">

                                        <img
                                            src={
                                                imagePreview
                                            }
                                            alt="Product preview"
                                        />

                                    </div>
                                )}

                                {uploadingImage && (
                                    <p className="image-upload-status">
                                        Uploading image...
                                    </p>
                                )}

                                {!uploadingImage &&
                                    formData.image && (
                                        <p className="image-upload-status success">
                                            Image ready ✓
                                        </p>
                                    )}

                                {editingProduct && (
                                    <p className="admin-image-help">
                                        Leave the image empty to keep
                                        the current image.
                                    </p>
                                )}

                            </div>

                            {/* Description */}

                            <div className="admin-field admin-field-full">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={
                                        formData.description
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Describe this skincare product..."
                                    rows="4"
                                    required
                                />

                            </div>

                        </div>

                        <div className="admin-form-actions">

                            <button
                                type="button"
                                className="admin-cancel-button"
                                onClick={resetForm}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="admin-submit-button"
                                disabled={
                                    uploadingImage
                                }
                            >

                                {uploadingImage
                                    ? "Uploading image..."
                                    : editingProduct
                                        ? "Save Changes"
                                        : "Create Product"}

                                <span>
                                    →
                                </span>

                            </button>

                        </div>

                    </form>

                </section>
            )}

            {/* =================================
                STATS
            ================================= */}

            <section className="admin-stats">

                <div className="admin-stat-card">

                    <span>
                        Total Products
                    </span>

                    <strong>
                        {products.length}
                    </strong>

                </div>

                <div className="admin-stat-card">

                    <span>
                        Categories
                    </span>

                    <strong>
                        {
                            new Set(
                                products.map(
                                    (product) =>
                                        product.category
                                )
                            ).size
                        }
                    </strong>

                </div>

                <div className="admin-stat-card">

                    <span>
                        Low Stock
                    </span>

                    <strong>
                        {
                            products.filter(
                                (product) =>
                                    product.stock < 10
                            ).length
                        }
                    </strong>

                </div>

            </section>

            {/* =================================
                PRODUCT LIST
            ================================= */}

            <section className="admin-products">

                <div className="admin-section-heading">

                    <div>

                        <p className="section-eyebrow">
                            PRODUCT CATALOG
                        </p>

                        <h2>
                            All products
                        </h2>

                    </div>

                    <span>
                        {products.length} items
                    </span>

                </div>

                <div className="admin-product-list">

                    {products.map((product) => (
                        <article
                            className="admin-product-row"
                            key={product._id}
                        >

                            <div className="admin-product-info">

                                <div className="admin-product-image">

                                    <img
                                        src={
                                            product.image
                                        }
                                        alt={
                                            product.name
                                        }
                                    />

                                </div>

                                <div>

                                    <p>
                                        {
                                            product.category
                                        }
                                    </p>

                                    <h3>
                                        {
                                            product.name
                                        }
                                    </h3>

                                </div>

                            </div>

                            <div className="admin-product-price">
                                ₹{product.price}
                            </div>

                            <div className="admin-product-stock">

                                <span>
                                    Stock
                                </span>

                                <strong>
                                    {
                                        product.stock
                                    }
                                </strong>

                            </div>

                            <div className="admin-product-actions">

                                <button
                                    onClick={() =>
                                        openEditForm(
                                            product
                                        )
                                    }
                                >
                                    Edit
                                </button>

                                <button
                                    className="delete-action"
                                    onClick={() =>
                                        handleDeleteProduct(product)
                                    }
                                >
                                    Delete
                                </button>

                            </div>

                        </article>
                    ))}

                </div>

            </section>

        </main>
    );
}