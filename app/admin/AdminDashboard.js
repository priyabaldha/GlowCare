"use client";

import Link from "next/link";
import { useEffect, useState } from "react";


export default function AdminPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] =
        useState(false);

    const [editingProduct, setEditingProduct] =
        useState(null);

    const [uploadingImage, setUploadingImage] =
        useState(false);

    const [imagePreview, setImagePreview] =
        useState("");

    const [activeSection, setActiveSection] =
        useState("overview");

    const [orders, setOrders] = useState([]);

    const [ordersLoading, setOrdersLoading] =
        useState(false);

    const [selectedOrder, setSelectedOrder] =
        useState(null);

    const [updatingOrder, setUpdatingOrder] =
        useState(false);

    const [shippingData, setShippingData] =
        useState({
            courierName: "",
            trackingNumber: "",
            trackingUrl: "",
        });

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

    // =========================================
    // FETCH PRODUCTS
    // =========================================

    useEffect(() => {
        fetchProducts();
        fetchOrders();
    }, []);

    async function fetchProducts() {
        try {
            const response = await fetch(
                "/api/products"
            );

            const data =
                await response.json();

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

    // =========================================
    // FETCH ADMIN ORDERS
    // =========================================

    async function fetchOrders() {
        setOrdersLoading(true);

        try {
            const response =
                await fetch(
                    "/api/admin/orders"
                );

            const data =
                await response.json();

            if (!response.ok) {
                console.error(
                    data.message
                );

                return;
            }

            if (data.success) {
                setOrders(
                    data.orders
                );
            }
        } catch (error) {
            console.error(
                "Failed to fetch admin orders:",
                error
            );
        } finally {
            setOrdersLoading(false);
        }
    }

// =========================================
// UPDATE ORDER STATUS
// =========================================

async function updateOrderStatus(
    orderId,
    status
) {
    // =========================================
    // SHIPPING VALIDATION
    // =========================================

    if (status === "shipped") {
        if (!shippingData.courierName.trim()) {
            alert(
                "Please enter courier name."
            );

            return;
        }

        if (!shippingData.trackingNumber.trim()) {
            alert(
                "Please enter tracking number."
            );

            return;
        }
    }

    setUpdatingOrder(true);

    try {
        const response = await fetch(
            `/api/admin/orders/${orderId}`,
            {
                method: "PATCH",

                headers: {
                    "Content-Type":
                        "application/json",
                },

                body: JSON.stringify({
                    status,

                    courierName:
                        shippingData.courierName.trim(),

                    trackingNumber:
                        shippingData.trackingNumber.trim(),

                    trackingUrl:
                        shippingData.trackingUrl.trim(),
                }),
            }
        );

        const data =
            await response.json();

        console.log(
            "Update order response:",
            data
        );

        if (!response.ok) {
            alert(
                data.message ||
                "Failed to update order."
            );

            return;
        }

        if (!data.success || !data.order) {
            alert(
                data.message ||
                "Failed to update order."
            );

            return;
        }

        // =========================================
        // UPDATE ORDERS LIST
        // =========================================

        setOrders(
            (currentOrders) =>
                currentOrders.map(
                    (order) =>
                        order._id ===
                            data.order._id
                            ? data.order
                            : order
                )
        );

        // =========================================
        // UPDATE SELECTED ORDER
        // =========================================

        setSelectedOrder(
            data.order
        );

        // =========================================
        // CLEAR SHIPPING FORM
        // =========================================

        if (status === "shipped") {
            setShippingData({
                courierName: "",
                trackingNumber: "",
                trackingUrl: "",
            });
        }

        alert(
            data.message ||
            "Order updated successfully."
        );

    } catch (error) {
        console.error(
            "Update order status error:",
            error
        );

        alert(
            "Something went wrong while updating the order."
        );

    } finally {
        setUpdatingOrder(false);
    }
}

    // =========================================
    // REJECT CANCELLATION
    // =========================================

    async function rejectCancellation(
        orderId
    ) {
        setUpdatingOrder(true);

        try {
            const response =
                await fetch(
                    `/api/admin/orders/${orderId}`,
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            action:
                                "reject_cancellation",
                        }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Failed to reject cancellation."
                );

                return;
            }

            if (
                data.success
            ) {
                setOrders(
                    (currentOrders) =>
                        currentOrders.map(
                            (order) =>
                                order._id ===
                                    data.order._id
                                    ? data.order
                                    : order
                        )
                );

                setSelectedOrder(
                    data.order
                );

                alert(
                    "Cancellation request rejected."
                );
            }

        } catch (error) {
            console.error(
                "Reject cancellation error:",
                error
            );

            alert(
                "Something went wrong."
            );

        } finally {
            setUpdatingOrder(false);
        }
    }


    // =========================================
    // PROCESS REFUND
    // =========================================

    async function processRefund(
        orderId
    ) {
        const confirmed =
            window.confirm(
                "Process the demo refund for this order?"
            );

        if (!confirmed) {
            return;
        }

        setUpdatingOrder(true);

        try {
            const response =
                await fetch(
                    `/api/admin/orders/${orderId}`,
                    {
                        method: "PATCH",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            action:
                                "process_refund",
                        }),
                    }
                );

            const data =
                await response.json();

            if (!response.ok) {
                alert(
                    data.message ||
                    "Failed to process refund."
                );

                return;
            }

            if (
                data.success
            ) {
                setOrders(
                    (currentOrders) =>
                        currentOrders.map(
                            (order) =>
                                order._id ===
                                    data.order._id
                                    ? data.order
                                    : order
                        )
                );

                setSelectedOrder(
                    data.order
                );

                alert(
                    "Demo refund processed successfully."
                );
            }

        } catch (error) {
            console.error(
                "Refund error:",
                error
            );

            alert(
                "Something went wrong."
            );

        } finally {
            setUpdatingOrder(false);
        }
    }

    // =========================================
    // ADMIN LOGOUT
    // =========================================

    async function handleAdminLogout() {
        try {
            const response = await fetch(
                "/api/auth/logout",
                {
                    method: "POST",
                }
            );

            if (!response.ok) {
                const errorText =
                    await response.text();

                console.error(
                    "Admin logout error:",
                    errorText
                );

                return;
            }

            const data =
                await response.json();

            if (data.success) {
                window.location.href =
                    "/login";
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
        const {
            name,
            value,
        } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    }

    // =========================================
    // IMAGE UPLOAD
    // =========================================

    async function handleImageChange(event) {
        const file =
            event.target.files?.[0];

        if (!file) {
            return;
        }

        if (
            !file.type.startsWith(
                "image/"
            )
        ) {
            alert(
                "Please select an image file."
            );

            event.target.value = "";

            return;
        }

        if (
            file.size >
            5 * 1024 * 1024
        ) {
            alert(
                "Image must be smaller than 5MB."
            );

            event.target.value = "";

            return;
        }

        const previewUrl =
            URL.createObjectURL(file);

        setImagePreview(previewUrl);
        setUploadingImage(true);

        try {
            const uploadData =
                new FormData();

            uploadData.append(
                "file",
                file
            );

            const response =
                await fetch(
                    "/api/upload",
                    {
                        method: "POST",
                        body: uploadData,
                    }
                );

            const data =
                await response.json();

            if (!data.success) {
                alert(data.message);

                setImagePreview("");

                return;
            }

            setFormData((current) => ({
                ...current,
                image:
                    data.imageUrl,
            }));
        } catch (error) {
            console.error(
                "Image upload error:",
                error
            );

            alert(
                "Image upload failed."
            );

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
            name:
                product.name || "",
            shortName:
                product.shortName ||
                "",
            category:
                product.category ||
                "Serums",
            price:
                product.price ?? "",
            rating:
                product.rating ?? "",
            image:
                product.image || "",
            description:
                product.description ||
                "",
            stock:
                product.stock ?? "",
        });

        setImagePreview(
            product.image || ""
        );

        setShowForm(true);

        setActiveSection(
            "products"
        );

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

    // =========================================
    // DELETE PRODUCT
    // =========================================

    async function handleDeleteProduct(
        product
    ) {
        const confirmed =
            window.confirm(
                `Are you sure you want to delete "${product.name}"?`
            );

        if (!confirmed) {
            return;
        }

        try {
            const response =
                await fetch(
                    `/api/products/${product._id}`,
                    {
                        method: "DELETE",
                    }
                );

            const data =
                await response.json();

            if (!data.success) {
                alert(data.message);
                return;
            }

            setProducts((current) =>
                current.filter(
                    (item) =>
                        item._id !==
                        product._id
                )
            );

            alert(
                "Product deleted successfully!"
            );
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
            alert(
                "Please select a product image."
            );

            return;
        }

        if (uploadingImage) {
            alert(
                "Please wait for the image to finish uploading."
            );

            return;
        }

        try {
            const isEditing =
                Boolean(
                    editingProduct
                );

            const url = isEditing
                ? `/api/products/${editingProduct._id}`
                : "/api/products";

            const method = isEditing
                ? "PUT"
                : "POST";

            const response =
                await fetch(
                    url,
                    {
                        method,

                        headers: {
                            "Content-Type":
                                "application/json",
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
                    }
                );

            const data =
                await response.json();

            if (!data.success) {
                alert(data.message);
                return;
            }

            if (isEditing) {
                setProducts(
                    (current) =>
                        current.map(
                            (product) =>
                                product._id ===
                                    data.product
                                        ._id
                                    ? data.product
                                    : product
                        )
                );

                alert(
                    "Product updated successfully!"
                );
            } else {
                setProducts(
                    (current) => [
                        data.product,
                        ...current,
                    ]
                );
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
                    Loading your
                    GlowCare dashboard...
                </p>
            </main>
        );
    }

    // =========================================
    // DASHBOARD VALUES
    // =========================================

    const totalProducts =
        products.length;

    const categories =
        new Set(
            products.map(
                (product) =>
                    product.category
            )
        ).size;

    const lowStock =
        products.filter(
            (product) =>
                Number(
                    product.stock
                ) < 10
        ).length;

    const totalStock =
        products.reduce(
            (total, product) =>
                total +
                Number(
                    product.stock || 0
                ),
            0
        );

    const averageRating =
        products.length
            ? (
                products.reduce(
                    (
                        total,
                        product
                    ) =>
                        total +
                        Number(
                            product.rating ||
                            0
                        ),
                    0
                ) /
                products.length
            ).toFixed(1)
            : "0.0";

    const totalOrders =
        orders.length;

    const pendingOrders =
        orders.filter(
            (order) =>
                order.status ===
                "pending"
        ).length;

    const confirmedOrders =
        orders.filter(
            (order) =>
                order.status ===
                "confirmed"
        ).length;

    const shippedOrders =
        orders.filter(
            (order) =>
                order.status ===
                "shipped"
        ).length;

    const deliveredOrders =
        orders.filter(
            (order) =>
                order.status ===
                "delivered"
        ).length;

    const cancelledOrders =
        orders.filter(
            (order) =>
                order.status ===
                "cancelled"
        ).length;

    const totalRevenue =
        orders
            .filter(
                (order) =>
                    order.status !==
                    "cancelled"
            )
            .reduce(
                (total, order) =>
                    total +
                    Number(
                        order.totalAmount ||
                        0
                    ),
                0
            );

    // =========================================
    // SIDEBAR ITEM
    // =========================================

    function SidebarItem({
        number,
        label,
        section,
    }) {
        const active =
            activeSection ===
            section;

        return (
            <button
                type="button"
                onClick={() =>
                    setActiveSection(
                        section
                    )
                }
                style={{
                    width: "100%",
                    padding:
                        "13px 12px",
                    border: "none",
                    borderRadius:
                        "9px",
                    background:
                        active
                            ? "rgba(255,255,255,0.12)"
                            : "transparent",
                    color: active
                        ? "var(--milk)"
                        : "rgba(255,255,255,0.58)",
                    display: "flex",
                    alignItems:
                        "center",
                    gap: "14px",
                    fontFamily:
                        "inherit",
                    fontSize: "13px",
                    textAlign:
                        "left",
                    cursor:
                        "pointer",
                    transition:
                        "all 0.2s ease",
                }}
            >
                <span
                    style={{
                        width: "22px",
                        color: active
                            ? "var(--dusty-rose)"
                            : "rgba(255,255,255,0.28)",
                        fontSize: "9px",
                    }}
                >
                    {number}
                </span>

                {label}
            </button>
        );
    }

    // =========================================
    // MAIN
    // =========================================

    return (
        <main
            style={{
                minHeight:
                    "100vh",
                display: "flex",
                background:
                    "var(--warm-white)",
            }}
        >

            {/* =================================
                SIDEBAR
            ================================= */}

            <aside
                style={{
                    width: "245px",
                    minHeight:
                        "100vh",
                    background:
                        "var(--espresso-brown)",
                    color:
                        "var(--milk)",
                    padding:
                        "30px 18px",
                    display: "flex",
                    flexDirection:
                        "column",
                    justifyContent:
                        "space-between",
                    flexShrink: 0,
                    position:
                        "sticky",
                    top: 0,
                    boxSizing:
                        "border-box",
                }}
            >

                <div>

                    {/* BRAND */}

                    <div
                        style={{
                            padding:
                                "6px 12px 28px",
                            borderBottom:
                                "1px solid rgba(255,255,255,0.11)",
                        }}
                    >
                        <Link
                            href="/"
                            style={{
                                color:
                                    "var(--milk)",
                                textDecoration:
                                    "none",
                                fontSize:
                                    "26px",
                                fontWeight:
                                    "600",
                                letterSpacing:
                                    "-0.8px",
                            }}
                        >
                            GlowCare
                        </Link>

                        <span
                            style={{
                                display:
                                    "block",
                                marginTop:
                                    "6px",
                                color:
                                    "rgba(255,255,255,0.45)",
                                fontSize:
                                    "9px",
                                letterSpacing:
                                    "1.6px",
                            }}
                        >
                            ADMIN PANEL
                        </span>
                    </div>


                    {/* NAVIGATION */}

                    <nav
                        style={{
                            marginTop:
                                "28px",
                            display:
                                "flex",
                            flexDirection:
                                "column",
                            gap: "5px",
                        }}
                    >

                        <SidebarItem
                            number="01"
                            label="Overview"
                            section="overview"
                        />

                        <SidebarItem
                            number="02"
                            label="Orders"
                            section="orders"
                        />

                        <SidebarItem
                            number="03"
                            label="Products"
                            section="products"
                        />

                        <SidebarItem
                            number="04"
                            label="Users"
                            section="users"
                        />

                    </nav>

                </div>


                {/* SIDEBAR FOOTER */}

                <div
                    style={{
                        paddingTop:
                            "20px",
                        borderTop:
                            "1px solid rgba(255,255,255,0.11)",
                    }}
                >

                    <Link
                        href="/"
                        style={{
                            display:
                                "block",
                            padding:
                                "11px 12px",
                            color:
                                "rgba(255,255,255,0.58)",
                            textDecoration:
                                "none",
                            fontSize:
                                "12px",
                        }}
                    >
                        ← Back to Store
                    </Link>

                    <button
                        type="button"
                        onClick={
                            handleAdminLogout
                        }
                        style={{
                            width:
                                "100%",
                            padding:
                                "11px 12px",
                            border:
                                "none",
                            background:
                                "transparent",
                            color:
                                "rgba(255,255,255,0.58)",
                            fontFamily:
                                "inherit",
                            fontSize:
                                "12px",
                            textAlign:
                                "left",
                            cursor:
                                "pointer",
                        }}
                    >
                        Logout
                    </button>

                </div>

            </aside>


            {/* =================================
                MAIN AREA
            ================================= */}

            <div
                style={{
                    flex: 1,
                    minWidth: 0,
                }}
            >

                {/* =================================
                    TOP BAR
                ================================= */}

                <header
                    style={{
                        minHeight:
                            "74px",
                        padding:
                            "0 5%",
                        display:
                            "flex",
                        alignItems:
                            "center",
                        justifyContent:
                            "space-between",
                        borderBottom:
                            "1px solid var(--light-border)",
                        background:
                            "var(--milk)",
                    }}
                >

                    <div
                        style={{
                            color:
                                "var(--muted-text)",
                            fontSize:
                                "13px",
                        }}
                    >
                        GlowCare
                        <span
                            style={{
                                margin:
                                    "0 8px",
                                opacity:
                                    0.45,
                            }}
                        >
                            /
                        </span>
                        Admin
                    </div>


                    <div
                        style={{
                            display:
                                "flex",
                            alignItems:
                                "center",
                            gap: "18px",
                        }}
                    >

                        <div
                            style={{
                                width:
                                    "34px",
                                height:
                                    "34px",
                                borderRadius:
                                    "50%",
                                background:
                                    "var(--blush-oat)",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                color:
                                    "var(--cocoa-taupe)",
                                fontFamily:
                                    "Georgia, serif",
                                fontSize:
                                    "15px",
                            }}
                        >
                            A
                        </div>

                        <div
                            style={{
                                display:
                                    "flex",
                                flexDirection:
                                    "column",
                                gap: "2px",
                            }}
                        >
                            <span
                                style={{
                                    color:
                                        "var(--espresso-brown)",
                                    fontSize:
                                        "13px",
                                    fontWeight:
                                        "600",
                                }}
                            >
                                Admin
                            </span>

                            <span
                                style={{
                                    color:
                                        "var(--muted-text)",
                                    fontSize:
                                        "10px",
                                }}
                            >
                                Store Manager
                            </span>
                        </div>

                    </div>

                </header>


                {/* =================================
                    OVERVIEW
                ================================= */}

                {activeSection ===
                    "overview" && (
                        <div
                            style={{
                                padding:
                                    "50px 5% 90px",
                            }}
                        >

                            {/* Welcome */}

                            <div
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "flex-end",
                                    justifyContent:
                                        "space-between",
                                    gap:
                                        "30px",
                                    marginBottom:
                                        "42px",
                                }}
                            >

                                <div>

                                    <p className="section-eyebrow">
                                        GLOWCARE
                                        ADMIN
                                    </p>

                                    <h1
                                        style={{
                                            margin:
                                                "8px 0 0",
                                            color:
                                                "var(--espresso-brown)",
                                            fontSize:
                                                "clamp(42px, 5vw, 68px)",
                                            lineHeight:
                                                "0.95",
                                            letterSpacing:
                                                "-3px",
                                            fontWeight:
                                                "500",
                                        }}
                                    >
                                        Good morning,
                                        <span
                                            style={{
                                                display:
                                                    "block",
                                                color:
                                                    "var(--dusty-rose)",
                                                fontFamily:
                                                    "Georgia, serif",
                                                fontStyle:
                                                    "italic",
                                                fontWeight:
                                                    "400",
                                            }}
                                        >
                                            Admin.
                                        </span>
                                    </h1>

                                    <p
                                        style={{
                                            marginTop:
                                                "18px",
                                            color:
                                                "var(--muted-text)",
                                            fontSize:
                                                "13px",
                                        }}
                                    >
                                        Here's what's
                                        happening with
                                        your GlowCare
                                        store.
                                    </p>

                                </div>


                                <button
                                    className="admin-add-button"
                                    type="button"
                                    onClick={() => {
                                        setActiveSection(
                                            "products"
                                        );

                                        openAddForm();
                                    }}
                                >
                                    + Add Product
                                </button>

                            </div>


                            {/* =================================
                            STAT CARDS
                        ================================= */}

                            <section
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "repeat(4, minmax(0, 1fr))",
                                    gap: "14px",
                                    marginBottom:
                                        "35px",
                                }}
                            >

                                {/* Products */}

                                <div className="admin-stat-card">

                                    <span>
                                        Products
                                    </span>

                                    <strong>
                                        {
                                            totalProducts
                                        }
                                    </strong>

                                    <p
                                        style={{
                                            marginTop:
                                                "10px",
                                            color:
                                                "var(--muted-text)",
                                            fontSize:
                                                "10px",
                                        }}
                                    >
                                        In your
                                        catalog
                                    </p>

                                </div>


                                {/* Stock */}

                                <div className="admin-stat-card">

                                    <span>
                                        Total Stock
                                    </span>

                                    <strong>
                                        {
                                            totalStock
                                        }
                                    </strong>

                                    <p
                                        style={{
                                            marginTop:
                                                "10px",
                                            color:
                                                "var(--muted-text)",
                                            fontSize:
                                                "10px",
                                        }}
                                    >
                                        Units available
                                    </p>

                                </div>


                                {/* Categories */}

                                <div className="admin-stat-card">

                                    <span>
                                        Categories
                                    </span>

                                    <strong>
                                        {
                                            categories
                                        }
                                    </strong>

                                    <p
                                        style={{
                                            marginTop:
                                                "10px",
                                            color:
                                                "var(--muted-text)",
                                            fontSize:
                                                "10px",
                                        }}
                                    >
                                        Product groups
                                    </p>

                                </div>


                                {/* Rating */}

                                <div className="admin-stat-card">

                                    <span>
                                        Avg. Rating
                                    </span>

                                    <strong>
                                        {
                                            averageRating
                                        }
                                    </strong>

                                    <p
                                        style={{
                                            marginTop:
                                                "10px",
                                            color:
                                                "var(--muted-text)",
                                            fontSize:
                                                "10px",
                                        }}
                                    >
                                        ★ Product rating
                                    </p>

                                </div>

                            </section>


                            {/* =================================
                            ANALYTICS GRID
                        ================================= */}

                            <section
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "minmax(0, 1.7fr) minmax(280px, 0.8fr)",
                                    gap: "16px",
                                    marginBottom:
                                        "35px",
                                }}
                            >

                                {/* SALES OVERVIEW */}

                                <div
                                    style={{
                                        background:
                                            "var(--milk)",
                                        border:
                                            "1px solid var(--light-border)",
                                        borderRadius:
                                            "var(--radius-xl)",
                                        padding:
                                            "28px",
                                        minHeight:
                                            "320px",
                                    }}
                                >

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "flex-start",
                                            marginBottom:
                                                "28px",
                                        }}
                                    >

                                        <div>

                                            <p className="section-eyebrow">
                                                PERFORMANCE
                                            </p>

                                            <h2
                                                style={{
                                                    marginTop:
                                                        "7px",
                                                    color:
                                                        "var(--espresso-brown)",
                                                    fontFamily:
                                                        "Georgia, serif",
                                                    fontSize:
                                                        "28px",
                                                    fontWeight:
                                                        "400",
                                                }}
                                            >
                                                Sales
                                                overview
                                            </h2>

                                        </div>

                                        <span
                                            style={{
                                                padding:
                                                    "7px 11px",
                                                border:
                                                    "1px solid var(--light-border)",
                                                borderRadius:
                                                    "var(--radius-pill)",
                                                color:
                                                    "var(--muted-text)",
                                                fontSize:
                                                    "10px",
                                            }}
                                        >
                                            Last 7 months
                                        </span>

                                    </div>


                                    {/* CHART */}

                                    <div
                                        style={{
                                            height:
                                                "195px",
                                            display:
                                                "flex",
                                            alignItems:
                                                "flex-end",
                                            gap:
                                                "clamp(8px, 2vw, 22px)",
                                            padding:
                                                "0 5px",
                                            borderBottom:
                                                "1px solid var(--light-border)",
                                        }}
                                    >

                                        {[
                                            34,
                                            48,
                                            42,
                                            66,
                                            55,
                                            78,
                                            92,
                                        ].map(
                                            (
                                                value,
                                                index
                                            ) => (
                                                <div
                                                    key={
                                                        index
                                                    }
                                                    style={{
                                                        flex:
                                                            1,
                                                        height:
                                                            "100%",
                                                        display:
                                                            "flex",
                                                        flexDirection:
                                                            "column",
                                                        justifyContent:
                                                            "flex-end",
                                                        alignItems:
                                                            "center",
                                                        gap:
                                                            "8px",
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            width:
                                                                "min(34px, 75%)",
                                                            height: `${value}%`,
                                                            background:
                                                                index ===
                                                                    6
                                                                    ? "var(--espresso-brown)"
                                                                    : "var(--dusty-rose)",
                                                            borderRadius:
                                                                "6px 6px 0 0",
                                                            opacity:
                                                                index ===
                                                                    6
                                                                    ? 1
                                                                    : 0.72,
                                                        }}
                                                    />

                                                </div>
                                            )
                                        )}

                                    </div>


                                    {/* MONTHS */}

                                    <div
                                        style={{
                                            display:
                                                "grid",
                                            gridTemplateColumns:
                                                "repeat(7, 1fr)",
                                            gap:
                                                "8px",
                                            marginTop:
                                                "10px",
                                        }}
                                    >

                                        {[
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                        ].map(
                                            (
                                                month
                                            ) => (
                                                <span
                                                    key={
                                                        month
                                                    }
                                                    style={{
                                                        textAlign:
                                                            "center",
                                                        color:
                                                            "var(--muted-text)",
                                                        fontSize:
                                                            "9px",
                                                    }}
                                                >
                                                    {
                                                        month
                                                    }
                                                </span>
                                            )
                                        )}

                                    </div>

                                </div>


                                {/* ORDER STATUS */}

                                <div
                                    style={{
                                        background:
                                            "var(--milk)",
                                        border:
                                            "1px solid var(--light-border)",
                                        borderRadius:
                                            "var(--radius-xl)",
                                        padding:
                                            "28px",
                                        minHeight:
                                            "320px",
                                    }}
                                >

                                    <p className="section-eyebrow">
                                        ORDERS
                                    </p>

                                    <h2
                                        style={{
                                            marginTop:
                                                "7px",
                                            color:
                                                "var(--espresso-brown)",
                                            fontFamily:
                                                "Georgia, serif",
                                            fontSize:
                                                "28px",
                                            fontWeight:
                                                "400",
                                        }}
                                    >
                                        Order status
                                    </h2>


                                    {/* DONUT */}

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            margin:
                                                "28px 0",
                                        }}
                                    >

                                        <div
                                            style={{
                                                width:
                                                    "135px",
                                                height:
                                                    "135px",
                                                borderRadius:
                                                    "50%",
                                                background:
                                                    "conic-gradient(var(--dusty-rose) 0 42%, var(--cocoa-taupe) 42% 70%, var(--blush-oat) 70% 100%)",
                                                display:
                                                    "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                            }}
                                        >

                                            <div
                                                style={{
                                                    width:
                                                        "78px",
                                                    height:
                                                        "78px",
                                                    borderRadius:
                                                        "50%",
                                                    background:
                                                        "var(--milk)",
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    flexDirection:
                                                        "column",
                                                }}
                                            >

                                                <strong
                                                    style={{
                                                        color:
                                                            "var(--espresso-brown)",
                                                        fontFamily:
                                                            "Georgia, serif",
                                                        fontSize:
                                                            "21px",
                                                        fontWeight:
                                                            "400",
                                                    }}
                                                >
                                                    —
                                                </strong>

                                                <span
                                                    style={{
                                                        color:
                                                            "var(--muted-text)",
                                                        fontSize:
                                                            "8px",
                                                    }}
                                                >
                                                    orders
                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    {/* LEGEND */}

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            flexDirection:
                                                "column",
                                            gap:
                                                "10px",
                                        }}
                                    >

                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "center",
                                                color:
                                                    "var(--muted-text)",
                                                fontSize:
                                                    "11px",
                                            }}
                                        >

                                            <span>
                                                <i
                                                    style={{
                                                        display:
                                                            "inline-block",
                                                        width:
                                                            "8px",
                                                        height:
                                                            "8px",
                                                        borderRadius:
                                                            "50%",
                                                        background:
                                                            "var(--dusty-rose)",
                                                        marginRight:
                                                            "8px",
                                                    }}
                                                />
                                                Pending
                                            </span>

                                            <span>
                                                —
                                            </span>

                                        </div>


                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "center",
                                                color:
                                                    "var(--muted-text)",
                                                fontSize:
                                                    "11px",
                                            }}
                                        >

                                            <span>
                                                <i
                                                    style={{
                                                        display:
                                                            "inline-block",
                                                        width:
                                                            "8px",
                                                        height:
                                                            "8px",
                                                        borderRadius:
                                                            "50%",
                                                        background:
                                                            "var(--cocoa-taupe)",
                                                        marginRight:
                                                            "8px",
                                                    }}
                                                />
                                                Processing
                                            </span>

                                            <span>
                                                —
                                            </span>

                                        </div>


                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "center",
                                                color:
                                                    "var(--muted-text)",
                                                fontSize:
                                                    "11px",
                                            }}
                                        >

                                            <span>
                                                <i
                                                    style={{
                                                        display:
                                                            "inline-block",
                                                        width:
                                                            "8px",
                                                        height:
                                                            "8px",
                                                        borderRadius:
                                                            "50%",
                                                        background:
                                                            "var(--blush-oat)",
                                                        marginRight:
                                                            "8px",
                                                    }}
                                                />
                                                Delivered
                                            </span>

                                            <span>
                                                —
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            </section>


                            {/* =================================
                            LOWER DASHBOARD
                        ================================= */}

                            <section
                                style={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        "minmax(0, 1.5fr) minmax(280px, 0.8fr)",
                                    gap: "16px",
                                }}
                            >

                                {/* RECENT PRODUCTS */}

                                <div
                                    style={{
                                        background:
                                            "var(--milk)",
                                        border:
                                            "1px solid var(--light-border)",
                                        borderRadius:
                                            "var(--radius-xl)",
                                        padding:
                                            "28px",
                                    }}
                                >

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            justifyContent:
                                                "space-between",
                                            alignItems:
                                                "flex-end",
                                            marginBottom:
                                                "22px",
                                        }}
                                    >

                                        <div>

                                            <p className="section-eyebrow">
                                                CATALOG
                                            </p>

                                            <h2
                                                style={{
                                                    marginTop:
                                                        "7px",
                                                    color:
                                                        "var(--espresso-brown)",
                                                    fontFamily:
                                                        "Georgia, serif",
                                                    fontSize:
                                                        "28px",
                                                    fontWeight:
                                                        "400",
                                                }}
                                            >
                                                Recent
                                                products
                                            </h2>

                                        </div>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveSection(
                                                    "products"
                                                )
                                            }
                                            style={{
                                                border:
                                                    "none",
                                                background:
                                                    "transparent",
                                                color:
                                                    "var(--cocoa-taupe)",
                                                fontSize:
                                                    "11px",
                                                cursor:
                                                    "pointer",
                                            }}
                                        >
                                            View all →
                                        </button>

                                    </div>


                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            flexDirection:
                                                "column",
                                            gap:
                                                "9px",
                                        }}
                                    >

                                        {products
                                            .slice(
                                                0,
                                                4
                                            )
                                            .map(
                                                (
                                                    product
                                                ) => (
                                                    <div
                                                        key={
                                                            product._id
                                                        }
                                                        style={{
                                                            display:
                                                                "grid",
                                                            gridTemplateColumns:
                                                                "48px 1fr auto",
                                                            alignItems:
                                                                "center",
                                                            gap:
                                                                "13px",
                                                            padding:
                                                                "10px",
                                                            border:
                                                                "1px solid var(--light-border)",
                                                            borderRadius:
                                                                "var(--radius-lg)",
                                                        }}
                                                    >

                                                        <div
                                                            style={{
                                                                width:
                                                                    "48px",
                                                                height:
                                                                    "48px",
                                                                borderRadius:
                                                                    "9px",
                                                                background:
                                                                    "var(--blush-oat)",
                                                                overflow:
                                                                    "hidden",
                                                            }}
                                                        >

                                                            <img
                                                                src={
                                                                    product.image
                                                                }
                                                                alt={
                                                                    product.name
                                                                }
                                                                style={{
                                                                    width:
                                                                        "100%",
                                                                    height:
                                                                        "100%",
                                                                    objectFit:
                                                                        "contain",
                                                                    padding:
                                                                        "5px",
                                                                }}
                                                            />

                                                        </div>


                                                        <div>

                                                            <p
                                                                style={{
                                                                    margin:
                                                                        "0 0 4px",
                                                                    color:
                                                                        "var(--dusty-rose)",
                                                                    fontSize:
                                                                        "8px",
                                                                    fontWeight:
                                                                        "600",
                                                                    letterSpacing:
                                                                        "0.8px",
                                                                    textTransform:
                                                                        "uppercase",
                                                                }}
                                                            >
                                                                {
                                                                    product.category
                                                                }
                                                            </p>

                                                            <strong
                                                                style={{
                                                                    color:
                                                                        "var(--espresso-brown)",
                                                                    fontFamily:
                                                                        "Georgia, serif",
                                                                    fontSize:
                                                                        "14px",
                                                                    fontWeight:
                                                                        "400",
                                                                }}
                                                            >
                                                                {
                                                                    product.name
                                                                }
                                                            </strong>

                                                        </div>


                                                        <span
                                                            style={{
                                                                color:
                                                                    "var(--espresso-brown)",
                                                                fontSize:
                                                                    "12px",
                                                                fontWeight:
                                                                    "600",
                                                            }}
                                                        >
                                                            ₹
                                                            {
                                                                product.price
                                                            }
                                                        </span>

                                                    </div>
                                                )
                                            )}

                                        {products.length ===
                                            0 && (
                                                <p
                                                    style={{
                                                        color:
                                                            "var(--muted-text)",
                                                        fontSize:
                                                            "12px",
                                                        padding:
                                                            "20px 0",
                                                    }}
                                                >
                                                    No products
                                                    added yet.
                                                </p>
                                            )}

                                    </div>

                                </div>


                                {/* INVENTORY HEALTH */}

                                <div
                                    style={{
                                        background:
                                            "var(--blush-oat)",
                                        border:
                                            "1px solid var(--light-border)",
                                        borderRadius:
                                            "var(--radius-xl)",
                                        padding:
                                            "28px",
                                    }}
                                >

                                    <p className="section-eyebrow">
                                        INVENTORY
                                    </p>

                                    <h2
                                        style={{
                                            marginTop:
                                                "7px",
                                            color:
                                                "var(--espresso-brown)",
                                            fontFamily:
                                                "Georgia, serif",
                                            fontSize:
                                                "28px",
                                            fontWeight:
                                                "400",
                                        }}
                                    >
                                        Stock health
                                    </h2>

                                    <div
                                        style={{
                                            marginTop:
                                                "28px",
                                        }}
                                    >

                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "space-between",
                                                marginBottom:
                                                    "8px",
                                            }}
                                        >

                                            <span
                                                style={{
                                                    color:
                                                        "var(--muted-text)",
                                                    fontSize:
                                                        "11px",
                                                }}
                                            >
                                                Healthy
                                                inventory
                                            </span>

                                            <strong
                                                style={{
                                                    color:
                                                        "var(--espresso-brown)",
                                                    fontSize:
                                                        "12px",
                                                }}
                                            >
                                                {Math.max(
                                                    0,
                                                    totalProducts -
                                                    lowStock
                                                )}
                                            </strong>

                                        </div>


                                        <div
                                            style={{
                                                height:
                                                    "7px",
                                                background:
                                                    "var(--milk)",
                                                borderRadius:
                                                    "10px",
                                                overflow:
                                                    "hidden",
                                            }}
                                        >

                                            <div
                                                style={{
                                                    width:
                                                        totalProducts
                                                            ? `${Math.max(
                                                                0,
                                                                ((totalProducts -
                                                                    lowStock) /
                                                                    totalProducts) *
                                                                100
                                                            )}%`
                                                            : "0%",
                                                    height:
                                                        "100%",
                                                    background:
                                                        "var(--cocoa-taupe)",
                                                    borderRadius:
                                                        "10px",
                                                }}
                                            />

                                        </div>

                                    </div>


                                    <div
                                        style={{
                                            marginTop:
                                                "25px",
                                            paddingTop:
                                                "20px",
                                            borderTop:
                                                "1px solid rgba(100,80,70,0.12)",
                                        }}
                                    >

                                        <span
                                            style={{
                                                display:
                                                    "block",
                                                color:
                                                    "var(--muted-text)",
                                                fontSize:
                                                    "10px",
                                                marginBottom:
                                                    "5px",
                                            }}
                                        >
                                            LOW STOCK
                                        </span>

                                        <strong
                                            style={{
                                                color:
                                                    "var(--espresso-brown)",
                                                fontFamily:
                                                    "Georgia, serif",
                                                fontSize:
                                                    "34px",
                                                fontWeight:
                                                    "400",
                                            }}
                                        >
                                            {
                                                lowStock
                                            }
                                        </strong>

                                        <p
                                            style={{
                                                marginTop:
                                                    "5px",
                                                color:
                                                    "var(--muted-text)",
                                                fontSize:
                                                    "10px",
                                            }}
                                        >
                                            products need
                                            attention
                                        </p>

                                    </div>

                                </div>

                            </section>

                        </div>
                    )}


                {/* =================================
                    ORDERS
                ================================= */}

                {activeSection ===
                    "orders" && (
                        <div
                            style={{
                                padding:
                                    "50px 5% 90px",
                            }}
                        >

                            {/* =================================
            ORDERS HEADER
        ================================= */}

                            <div
                                style={{
                                    display: "flex",
                                    alignItems:
                                        "flex-end",
                                    justifyContent:
                                        "space-between",
                                    gap: "30px",
                                    marginBottom:
                                        "40px",
                                }}
                            >

                                <div>

                                    <p className="section-eyebrow">
                                        GLOWCARE ADMIN
                                    </p>

                                    <h1
                                        style={{
                                            margin:
                                                "8px 0 0",
                                            color:
                                                "var(--espresso-brown)",
                                            fontSize:
                                                "clamp(42px, 5vw, 64px)",
                                            lineHeight:
                                                "0.95",
                                            letterSpacing:
                                                "-3px",
                                            fontWeight:
                                                "500",
                                        }}
                                    >
                                        Order
                                        <span
                                            style={{
                                                display:
                                                    "block",
                                                color:
                                                    "var(--dusty-rose)",
                                                fontFamily:
                                                    "Georgia, serif",
                                                fontStyle:
                                                    "italic",
                                                fontWeight:
                                                    "400",
                                            }}
                                        >
                                            management.
                                        </span>
                                    </h1>

                                </div>

                                <div
                                    style={{
                                        color:
                                            "var(--muted-text)",
                                        fontSize:
                                            "12px",
                                    }}
                                >
                                    {totalOrders} total orders
                                </div>

                            </div>


                            {/* =================================
            ORDER STATS
        ================================= */}

                            <section
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(4, minmax(0, 1fr))",
                                    gap: "14px",
                                    marginBottom:
                                        "30px",
                                }}
                            >

                                <div className="admin-stat-card">
                                    <span>
                                        Total Orders
                                    </span>

                                    <strong>
                                        {totalOrders}
                                    </strong>
                                </div>


                                <div className="admin-stat-card">
                                    <span>
                                        Pending
                                    </span>

                                    <strong>
                                        {pendingOrders}
                                    </strong>
                                </div>


                                <div className="admin-stat-card">
                                    <span>
                                        Shipped
                                    </span>

                                    <strong>
                                        {shippedOrders}
                                    </strong>
                                </div>


                                <div className="admin-stat-card">
                                    <span>
                                        Revenue
                                    </span>

                                    <strong
                                        style={{
                                            fontSize:
                                                "30px",
                                        }}
                                    >
                                        ₹
                                        {totalRevenue.toLocaleString(
                                            "en-IN"
                                        )}
                                    </strong>
                                </div>

                            </section>


                            {/* =================================
            ORDER TABLE
        ================================= */}

                            <section className="admin-products">

                                <div
                                    className="admin-section-heading"
                                >

                                    <div>

                                        <p className="section-eyebrow">
                                            CUSTOMER ORDERS
                                        </p>

                                        <h2>
                                            Recent orders
                                        </h2>

                                    </div>

                                    <span>
                                        {orders.length} orders
                                    </span>

                                </div>


                                {ordersLoading ? (

                                    <div
                                        className="admin-product-form"
                                        style={{
                                            textAlign:
                                                "center",
                                            marginTop:
                                                "20px",
                                        }}
                                    >
                                        <p className="admin-loading">
                                            Loading orders...
                                        </p>
                                    </div>

                                ) : orders.length === 0 ? (

                                    <div
                                        className="admin-product-form"
                                        style={{
                                            textAlign:
                                                "center",
                                            marginTop:
                                                "20px",
                                        }}
                                    >

                                        <p className="section-eyebrow">
                                            NO ORDERS
                                        </p>

                                        <h2
                                            style={{
                                                marginTop:
                                                    "10px",
                                                color:
                                                    "var(--espresso-brown)",
                                                fontFamily:
                                                    "Georgia, serif",
                                                fontWeight:
                                                    "400",
                                            }}
                                        >
                                            Your store is
                                            waiting for its
                                            first order.
                                        </h2>

                                    </div>

                                ) : (

                                    <div
                                        style={{
                                            display:
                                                "flex",
                                            flexDirection:
                                                "column",
                                            gap: "10px",
                                        }}
                                    >

                                        {orders.map(
                                            (order) => {

                                                const customerName =
                                                    order
                                                        .shippingAddress
                                                        ?.name ||
                                                    order.user
                                                        ?.name ||
                                                    "Customer";

                                                const date =
                                                    new Date(
                                                        order.createdAt
                                                    ).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month:
                                                                "short",
                                                            year:
                                                                "numeric",
                                                        }
                                                    );

                                                return (
                                                    <div
                                                        key={
                                                            order._id
                                                        }
                                                        style={{
                                                            background:
                                                                "var(--milk)",
                                                            border:
                                                                "1px solid var(--light-border)",
                                                            borderRadius:
                                                                "var(--radius-lg)",
                                                            padding:
                                                                "16px 20px",
                                                            display:
                                                                "grid",
                                                            gridTemplateColumns:
                                                                "1.3fr 1.2fr 110px 120px 150px 80px",
                                                            alignItems:
                                                                "center",
                                                            gap:
                                                                "18px",
                                                        }}
                                                    >

                                                        {/* ORDER */}

                                                        <div>

                                                            <span
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    color:
                                                                        "var(--muted-text)",
                                                                    fontSize:
                                                                        "9px",
                                                                    letterSpacing:
                                                                        "0.8px",
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                            >
                                                                ORDER
                                                            </span>

                                                            <strong
                                                                style={{
                                                                    color:
                                                                        "var(--espresso-brown)",
                                                                    fontSize:
                                                                        "12px",
                                                                }}
                                                            >
                                                                #
                                                                {order._id
                                                                    .toString()
                                                                    .slice(
                                                                        -8
                                                                    )
                                                                    .toUpperCase()}
                                                            </strong>

                                                        </div>


                                                        {/* CUSTOMER */}

                                                        <div>

                                                            <span
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    color:
                                                                        "var(--muted-text)",
                                                                    fontSize:
                                                                        "9px",
                                                                    letterSpacing:
                                                                        "0.8px",
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                            >
                                                                CUSTOMER
                                                            </span>

                                                            <strong
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    color:
                                                                        "var(--espresso-brown)",
                                                                    fontFamily:
                                                                        "Georgia, serif",
                                                                    fontWeight:
                                                                        "400",
                                                                    fontSize:
                                                                        "15px",
                                                                }}
                                                            >
                                                                {
                                                                    customerName
                                                                }
                                                            </strong>

                                                            <span
                                                                style={{
                                                                    color:
                                                                        "var(--muted-text)",
                                                                    fontSize:
                                                                        "9px",
                                                                }}
                                                            >
                                                                {
                                                                    order
                                                                        .user
                                                                        ?.email
                                                                }
                                                            </span>

                                                        </div>


                                                        {/* DATE */}

                                                        <div>

                                                            <span
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    color:
                                                                        "var(--muted-text)",
                                                                    fontSize:
                                                                        "9px",
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                            >
                                                                DATE
                                                            </span>

                                                            <span
                                                                style={{
                                                                    color:
                                                                        "var(--cocoa-taupe)",
                                                                    fontSize:
                                                                        "11px",
                                                                }}
                                                            >
                                                                {date}
                                                            </span>

                                                        </div>


                                                        {/* TOTAL */}

                                                        <div>

                                                            <span
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    color:
                                                                        "var(--muted-text)",
                                                                    fontSize:
                                                                        "9px",
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                            >
                                                                TOTAL
                                                            </span>

                                                            <strong
                                                                style={{
                                                                    color:
                                                                        "var(--espresso-brown)",
                                                                    fontSize:
                                                                        "13px",
                                                                }}
                                                            >
                                                                ₹
                                                                {Number(
                                                                    order.totalAmount
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )}
                                                            </strong>

                                                        </div>


                                                        {/* STATUS */}

                                                        <div>

                                                            <span
                                                                style={{
                                                                    display:
                                                                        "block",
                                                                    color:
                                                                        "var(--muted-text)",
                                                                    fontSize:
                                                                        "9px",
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                            >
                                                                STATUS
                                                            </span>

                                                            <span
                                                                style={{
                                                                    display: "inline-block",
                                                                    padding:
                                                                        "7px 10px",
                                                                    border:
                                                                        "1px solid var(--light-border)",
                                                                    borderRadius:
                                                                        "var(--radius-pill)",
                                                                    background:
                                                                        "var(--blush-oat)",
                                                                    color:
                                                                        "var(--cocoa-taupe)",
                                                                    fontSize: "10px",
                                                                    textTransform:
                                                                        "capitalize",
                                                                }}
                                                            >
                                                                {order.status.replaceAll(
                                                                    "_",
                                                                    " "
                                                                )}
                                                            </span>

                                                        </div>


                                                        {/* VIEW */}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedOrder(
                                                                    order
                                                                )
                                                            }
                                                            style={{
                                                                padding:
                                                                    "9px 12px",
                                                                border:
                                                                    "1px solid var(--light-border)",
                                                                borderRadius:
                                                                    "var(--radius-pill)",
                                                                background:
                                                                    "transparent",
                                                                color:
                                                                    "var(--cocoa-taupe)",
                                                                fontFamily:
                                                                    "inherit",
                                                                fontSize:
                                                                    "10px",
                                                                fontWeight:
                                                                    "600",
                                                                cursor:
                                                                    "pointer",
                                                            }}
                                                        >
                                                            View
                                                        </button>

                                                    </div>
                                                );
                                            }
                                        )}

                                    </div>

                                )}

                            </section>


                            {/* =================================
            ORDER DETAILS MODAL
        ================================= */}

                            {selectedOrder && (
                                <div
                                    onClick={() =>
                                        setSelectedOrder(
                                            null
                                        )
                                    }
                                    style={{
                                        position:
                                            "fixed",
                                        inset: 0,
                                        background:
                                            "rgba(50, 35, 30, 0.35)",
                                        display:
                                            "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        padding:
                                            "30px",
                                        zIndex: 100,
                                    }}
                                >

                                    <div
                                        onClick={(event) =>
                                            event.stopPropagation()
                                        }
                                        style={{
                                            width:
                                                "min(760px, 100%)",
                                            maxHeight:
                                                "90vh",
                                            overflowY:
                                                "auto",
                                            background:
                                                "var(--milk)",
                                            borderRadius:
                                                "var(--radius-xl)",
                                            padding:
                                                "32px",
                                            boxShadow:
                                                "0 25px 70px rgba(50,35,30,0.18)",
                                        }}
                                    >

                                        {/* MODAL HEADER */}

                                        <div
                                            style={{
                                                display:
                                                    "flex",
                                                justifyContent:
                                                    "space-between",
                                                alignItems:
                                                    "flex-start",
                                                gap: "20px",
                                                marginBottom:
                                                    "28px",
                                            }}
                                        >

                                            <div>

                                                <p className="section-eyebrow">
                                                    ORDER DETAILS
                                                </p>

                                                <h2
                                                    style={{
                                                        marginTop:
                                                            "7px",
                                                        color:
                                                            "var(--espresso-brown)",
                                                        fontFamily:
                                                            "Georgia, serif",
                                                        fontSize:
                                                            "32px",
                                                        fontWeight:
                                                            "400",
                                                    }}
                                                >
                                                    #
                                                    {selectedOrder._id
                                                        .toString()
                                                        .slice(
                                                            -8
                                                        )
                                                        .toUpperCase()}
                                                </h2>

                                            </div>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setSelectedOrder(
                                                        null
                                                    )
                                                }
                                                style={{
                                                    width:
                                                        "32px",
                                                    height:
                                                        "32px",
                                                    border:
                                                        "1px solid var(--light-border)",
                                                    borderRadius:
                                                        "50%",
                                                    background:
                                                        "transparent",
                                                    color:
                                                        "var(--cocoa-taupe)",
                                                    cursor:
                                                        "pointer",
                                                    fontSize:
                                                        "16px",
                                                }}
                                            >
                                                ×
                                            </button>

                                        </div>


                                        {/* CUSTOMER */}

                                        <div
                                            className="admin-stat-card"
                                            style={{
                                                marginBottom:
                                                    "12px",
                                            }}
                                        >

                                            <span>
                                                Customer
                                            </span>

                                            <strong
                                                style={{
                                                    fontSize:
                                                        "22px",
                                                }}
                                            >
                                                {
                                                    selectedOrder
                                                        .shippingAddress
                                                        ?.name
                                                }
                                            </strong>

                                            <p
                                                style={{
                                                    marginTop:
                                                        "7px",
                                                    color:
                                                        "var(--muted-text)",
                                                    fontSize:
                                                        "11px",
                                                }}
                                            >
                                                {
                                                    selectedOrder
                                                        .user
                                                        ?.email
                                                }
                                            </p>

                                        </div>


                                        {/* ORDER ITEMS */}

                                        <div
                                            style={{
                                                marginTop:
                                                    "18px",
                                                padding:
                                                    "22px",
                                                border:
                                                    "1px solid var(--light-border)",
                                                borderRadius:
                                                    "var(--radius-lg)",
                                            }}
                                        >

                                            <p className="section-eyebrow">
                                                ITEMS
                                            </p>

                                            <div
                                                style={{
                                                    marginTop:
                                                        "15px",
                                                    display:
                                                        "flex",
                                                    flexDirection:
                                                        "column",
                                                    gap:
                                                        "12px",
                                                }}
                                            >

                                                {selectedOrder.items.map(
                                                    (
                                                        item,
                                                        index
                                                    ) => (
                                                        <div
                                                            key={
                                                                index
                                                            }
                                                            style={{
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "space-between",
                                                                gap:
                                                                    "15px",
                                                                paddingBottom:
                                                                    "12px",
                                                                borderBottom:
                                                                    "1px solid var(--light-border)",
                                                            }}
                                                        >

                                                            <div>

                                                                <strong
                                                                    style={{
                                                                        color:
                                                                            "var(--espresso-brown)",
                                                                        fontFamily:
                                                                            "Georgia, serif",
                                                                        fontSize:
                                                                            "14px",
                                                                        fontWeight:
                                                                            "400",
                                                                    }}
                                                                >
                                                                    {
                                                                        item
                                                                            .product
                                                                            ?.name
                                                                    }
                                                                </strong>

                                                                <span
                                                                    style={{
                                                                        display:
                                                                            "block",
                                                                        marginTop:
                                                                            "4px",
                                                                        color:
                                                                            "var(--muted-text)",
                                                                        fontSize:
                                                                            "10px",
                                                                    }}
                                                                >
                                                                    Quantity:
                                                                    {
                                                                        " "
                                                                    }
                                                                    {
                                                                        item.quantity
                                                                    }
                                                                </span>

                                                            </div>


                                                            <strong
                                                                style={{
                                                                    color:
                                                                        "var(--espresso-brown)",
                                                                    fontSize:
                                                                        "12px",
                                                                }}
                                                            >
                                                                ₹
                                                                {(
                                                                    item.price *
                                                                    item.quantity
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )}
                                                            </strong>

                                                        </div>
                                                    )
                                                )}

                                            </div>


                                            <div
                                                style={{
                                                    display:
                                                        "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    paddingTop:
                                                        "18px",
                                                }}
                                            >

                                                <span
                                                    style={{
                                                        color:
                                                            "var(--muted-text)",
                                                        fontSize:
                                                            "12px",
                                                    }}
                                                >
                                                    Order Total
                                                </span>

                                                <strong
                                                    style={{
                                                        color:
                                                            "var(--espresso-brown)",
                                                        fontFamily:
                                                            "Georgia, serif",
                                                        fontSize:
                                                            "20px",
                                                        fontWeight:
                                                            "400",
                                                    }}
                                                >
                                                    ₹
                                                    {Number(
                                                        selectedOrder.totalAmount
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* PAYMENT + STATUS */}
{/* =========================================
    PAYMENT
========================================= */}

<div
    style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "12px",
        marginTop: "12px",
    }}
>
    {/* PAYMENT */}

    <div className="admin-stat-card">
        <span>Payment</span>

        <strong
            style={{
                fontSize: "20px",
                textTransform: "uppercase",
            }}
        >
            {selectedOrder.paymentMethod}
        </strong>

        <p
            style={{
                marginTop: "5px",
                color: "var(--muted-text)",
                fontSize: "10px",
                textTransform: "capitalize",
            }}
        >
            Payment status:{" "}
            {selectedOrder.paymentStatus}
        </p>
    </div>


    {/* ORDER STATUS */}

    <div className="admin-stat-card">
        <span>Order Status</span>

        <div
            style={{
                marginTop: "10px",
                padding: "10px 12px",
                borderRadius: "999px",
                background: "var(--blush-oat)",
                color: "var(--cocoa-taupe)",
                fontSize: "11px",
                textTransform: "capitalize",
            }}
        >
            {selectedOrder.status.replaceAll("_", " ")}
        </div>
    </div>
</div>


{/* =========================================
    ORDER ACTION
========================================= */}

<div
    style={{
        marginTop: "18px",
        padding: "22px",
        border: "1px solid var(--light-border)",
        borderRadius: "var(--radius-lg)",
        background: "var(--milk)",
    }}
>
    <p className="section-eyebrow">
        ORDER ACTION
    </p>


    {/* =====================================
        PENDING
    ===================================== */}

    {selectedOrder.status === "pending" && (
        <div style={{ marginTop: "14px" }}>
            <p
                style={{
                    fontSize: "12px",
                    color: "var(--muted-text)",
                    marginBottom: "14px",
                }}
            >
                This order is waiting for confirmation.
            </p>

            <button
                type="button"
                disabled={updatingOrder}
                onClick={() =>
                    updateOrderStatus(
                        selectedOrder._id,
                        "confirmed"
                    )
                }
                className="admin-submit-button"
            >
                {updatingOrder
                    ? "Confirming..."
                    : "Confirm Order"}
            </button>
        </div>
    )}


    {/* =====================================
        CONFIRMED
    ===================================== */}

    {selectedOrder.status === "confirmed" && (
        <div style={{ marginTop: "14px" }}>
            <p
                style={{
                    fontSize: "12px",
                    color: "var(--muted-text)",
                    marginBottom: "16px",
                }}
            >
                The order is confirmed and ready to be
                shipped.
            </p>

            <div
                style={{
                    padding: "18px",
                    background: "var(--blush-oat)",
                    borderRadius: "var(--radius-lg)",
                }}
            >
                <p className="section-eyebrow">
                    SHIPPING DETAILS
                </p>


                {/* COURIER */}

                <input
                    type="text"
                    placeholder="Courier name"
                    value={shippingData.courierName}
                    onChange={(event) =>
                        setShippingData((current) => ({
                            ...current,
                            courierName:
                                event.target.value,
                        }))
                    }
                    style={{
                        width: "100%",
                        marginTop: "12px",
                        padding: "11px 13px",
                        border:
                            "1px solid var(--light-border)",
                        borderRadius: "10px",
                        background: "var(--milk)",
                        color:
                            "var(--espresso-brown)",
                        fontFamily: "inherit",
                        fontSize: "11px",
                        outline: "none",
                        boxSizing: "border-box",
                    }}
                />


                {/* TRACKING NUMBER */}

                <input
                    type="text"
                    placeholder="Tracking number"
                    value={shippingData.trackingNumber}
                    onChange={(event) =>
                        setShippingData((current) => ({
                            ...current,
                            trackingNumber:
                                event.target.value,
                        }))
                    }
                    style={{
                        width: "100%",
                        marginTop: "10px",
                        padding: "11px 13px",
                        border:
                            "1px solid var(--light-border)",
                        borderRadius: "10px",
                        background: "var(--milk)",
                        color:
                            "var(--espresso-brown)",
                        fontFamily: "inherit",
                        fontSize: "11px",
                        outline: "none",
                        boxSizing: "border-box",
                    }}
                />


                {/* TRACKING URL */}

                <input
                    type="text"
                    placeholder="Tracking URL (optional)"
                    value={shippingData.trackingUrl}
                    onChange={(event) =>
                        setShippingData((current) => ({
                            ...current,
                            trackingUrl:
                                event.target.value,
                        }))
                    }
                    style={{
                        width: "100%",
                        marginTop: "10px",
                        padding: "11px 13px",
                        border:
                            "1px solid var(--light-border)",
                        borderRadius: "10px",
                        background: "var(--milk)",
                        color:
                            "var(--espresso-brown)",
                        fontFamily: "inherit",
                        fontSize: "11px",
                        outline: "none",
                        boxSizing: "border-box",
                    }}
                />


                {/* SHIP */}

                <button
                    type="button"
                    disabled={
                        updatingOrder ||
                        !shippingData.courierName.trim() ||
                        !shippingData.trackingNumber.trim()
                    }
                    onClick={() =>
                        updateOrderStatus(
                            selectedOrder._id,
                            "shipped"
                        )
                    }
                    className="admin-submit-button"
                    style={{
                        marginTop: "14px",
                        opacity:
                            !shippingData.courierName.trim() ||
                            !shippingData.trackingNumber.trim()
                                ? 0.5
                                : 1,
                    }}
                >
                    {updatingOrder
                        ? "Shipping..."
                        : "Mark as Shipped"}
                </button>
            </div>
        </div>
    )}


    {/* =====================================
        SHIPPED
    ===================================== */}

    {selectedOrder.status === "shipped" && (
        <div style={{ marginTop: "14px" }}>
            <p
                style={{
                    fontSize: "12px",
                    color: "var(--muted-text)",
                    marginBottom: "14px",
                }}
            >
                This order has been shipped.
            </p>

            {selectedOrder.courierName && (
                <p
                    style={{
                        fontSize: "11px",
                        marginBottom: "6px",
                    }}
                >
                    <strong>Courier:</strong>{" "}
                    {selectedOrder.courierName}
                </p>
            )}

            {selectedOrder.trackingNumber && (
                <p
                    style={{
                        fontSize: "11px",
                        marginBottom: "6px",
                    }}
                >
                    <strong>Tracking:</strong>{" "}
                    {selectedOrder.trackingNumber}
                </p>
            )}

            {selectedOrder.trackingUrl && (
                <a
                    href={selectedOrder.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        display: "inline-block",
                        marginTop: "5px",
                        fontSize: "11px",
                        color: "var(--dusty-rose)",
                    }}
                >
                    Open Tracking →
                </a>
            )}

            <button
                type="button"
                disabled={updatingOrder}
                onClick={() =>
                    updateOrderStatus(
                        selectedOrder._id,
                        "delivered"
                    )
                }
                className="admin-submit-button"
                style={{
                    marginTop: "18px",
                }}
            >
                {updatingOrder
                    ? "Updating..."
                    : "Mark as Delivered"}
            </button>
        </div>
    )}


    {/* =====================================
        DELIVERED
    ===================================== */}

    {selectedOrder.status === "delivered" && (
        <div
            style={{
                marginTop: "14px",
                padding: "16px",
                borderRadius: "var(--radius-lg)",
                background: "var(--blush-oat)",
            }}
        >
            <strong
                style={{
                    color: "var(--espresso-brown)",
                    fontSize: "13px",
                }}
            >
                ✓ Order Delivered
            </strong>

            <p
                style={{
                    marginTop: "6px",
                    fontSize: "11px",
                    color: "var(--muted-text)",
                }}
            >
                This order is complete and can no longer
                be changed.
            </p>
        </div>
    )}


    {/* =====================================
        CANCELLED
    ===================================== */}

    {selectedOrder.status === "cancelled" && (
        <div
            style={{
                marginTop: "14px",
                padding: "16px",
                borderRadius: "var(--radius-lg)",
                background: "#fff4e5",
            }}
        >
            <strong
                style={{
                    color: "#9b5555",
                    fontSize: "13px",
                }}
            >
                Order Cancelled
            </strong>

            <p
                style={{
                    marginTop: "6px",
                    fontSize: "11px",
                    color: "var(--muted-text)",
                }}
            >
                This order can no longer be changed.
            </p>
        </div>
    )}


    {/* =====================================
        CANCELLATION REQUEST
    ===================================== */}

    {selectedOrder.status ===
        "cancellation_requested" && (
        <div
            style={{
                marginTop: "14px",
                padding: "20px",
                borderRadius: "var(--radius-lg)",
                background: "#fff4e5",
                border: "1px solid #ead8bd",
            }}
        >
            <p className="section-eyebrow">
                CANCELLATION REQUEST
            </p>

            <h3
                style={{
                    marginTop: "8px",
                    fontFamily: "Georgia, serif",
                    fontWeight: "400",
                    color: "var(--espresso-brown)",
                }}
            >
                Customer requested cancellation
            </h3>

            {selectedOrder.cancellationReason && (
                <p
                    style={{
                        marginTop: "8px",
                        fontSize: "11px",
                        color: "var(--muted-text)",
                    }}
                >
                    Reason:{" "}
                    {selectedOrder.cancellationReason}
                </p>
            )}

            <div
                style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "16px",
                    flexWrap: "wrap",
                }}
            >
                <button
                    type="button"
                    disabled={updatingOrder}
                    onClick={() =>
                        updateOrderStatus(
                            selectedOrder._id,
                            "cancelled"
                        )
                    }
                    style={{
                        padding: "10px 16px",
                        border: "none",
                        borderRadius: "999px",
                        background: "#9b5555",
                        color: "white",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: "11px",
                        fontWeight: "600",
                    }}
                >
                    {updatingOrder
                        ? "Cancelling..."
                        : "Approve Cancellation"}
                </button>

                <button
                    type="button"
                    disabled={updatingOrder}
                    onClick={() =>
                        rejectCancellation(
                            selectedOrder._id
                        )
                    }
                    style={{
                        padding: "10px 16px",
                        border:
                            "1px solid var(--light-border)",
                        borderRadius: "999px",
                        background: "transparent",
                        color: "var(--cocoa-taupe)",
                        cursor: "pointer",
                        fontFamily: "inherit",
                        fontSize: "11px",
                        fontWeight: "600",
                    }}
                >
                    {updatingOrder
                        ? "Please wait..."
                        : "Reject Cancellation"}
                </button>
            </div>
        </div>
    )}


    {/* =====================================
        REFUND
    ===================================== */}

    {selectedOrder.status === "cancelled" &&
        selectedOrder.paymentStatus === "paid" &&
        selectedOrder.refundStatus !== "processed" && (
            <div
                style={{
                    marginTop: "18px",
                    padding: "18px",
                    borderRadius: "var(--radius-lg)",
                    background: "var(--blush-oat)",
                }}
            >
                <p className="section-eyebrow">
                    REFUND
                </p>

                <p
                    style={{
                        marginTop: "8px",
                        fontSize: "12px",
                        color: "var(--espresso-brown)",
                    }}
                >
                    This customer paid ₹
                    {Number(
                        selectedOrder.totalAmount
                    ).toLocaleString("en-IN")}
                    .
                </p>

                <p
                    style={{
                        marginTop: "5px",
                        fontSize: "10px",
                        color: "var(--muted-text)",
                    }}
                >
                    This is a demo refund. No real money
                    will be transferred.
                </p>

                <button
                    type="button"
                    disabled={updatingOrder}
                    onClick={() =>
                        processRefund(
                            selectedOrder._id
                        )
                    }
                    className="admin-submit-button"
                    style={{
                        marginTop: "14px",
                    }}
                >
                    {updatingOrder
                        ? "Processing Refund..."
                        : `Process Refund ₹${Number(
                              selectedOrder.totalAmount
                          ).toLocaleString("en-IN")}`}
                </button>
            </div>
        )}


    {/* =====================================
        REFUND PROCESSED
    ===================================== */}

    {selectedOrder.refundStatus === "processed" && (
        <div
            style={{
                marginTop: "18px",
                padding: "18px",
                borderRadius: "var(--radius-lg)",
                background: "var(--blush-oat)",
            }}
        >
            <p className="section-eyebrow">
                REFUND PROCESSED
            </p>

            <p
                style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    color: "var(--espresso-brown)",
                }}
            >
                ₹
                {Number(
                    selectedOrder.refundAmount
                ).toLocaleString("en-IN")}{" "}
                refunded successfully.
            </p>

            {selectedOrder.refundId && (
                <p
                    style={{
                        marginTop: "5px",
                        fontSize: "10px",
                        color: "var(--muted-text)",
                    }}
                >
                    Refund ID:{" "}
                    {selectedOrder.refundId}
                </p>
            )}
        </div>
    )}

</div>
                                        {/* CLOSE */}

                                        <button
                                            type="button"
                                            className="admin-submit-button"
                                            onClick={() =>
                                                setSelectedOrder(
                                                    null
                                                )
                                            }
                                            style={{
                                                marginTop:
                                                    "22px",
                                            }}
                                        >
                                            Close
                                            <span>
                                                ×
                                            </span>
                                        </button>

                                    </div>

                                </div>
                            )}

                        </div>
                    )}


                {/* =================================
                    USERS
                ================================= */}

                {activeSection ===
                    "users" && (
                        <div
                            style={{
                                padding:
                                    "50px 5% 90px",
                            }}
                        >

                            <div className="admin-header">

                                <div>

                                    <p className="section-eyebrow">
                                        GLOWCARE
                                        ADMIN
                                    </p>

                                    <h1>
                                        Customer
                                        <span>
                                            accounts.
                                        </span>
                                    </h1>

                                </div>

                            </div>


                            <section
                                className="admin-product-form"
                                style={{
                                    marginTop:
                                        "45px",
                                    textAlign:
                                        "center",
                                }}
                            >

                                <p className="section-eyebrow">
                                    COMING NEXT
                                </p>

                                <h2
                                    style={{
                                        marginTop:
                                            "8px",
                                        color:
                                            "var(--espresso-brown)",
                                        fontFamily:
                                            "Georgia, serif",
                                        fontSize:
                                            "32px",
                                        fontWeight:
                                            "400",
                                    }}
                                >
                                    Customer
                                    management
                                </h2>

                                <p
                                    style={{
                                        marginTop:
                                            "12px",
                                        color:
                                            "var(--muted-text)",
                                        fontSize:
                                            "13px",
                                    }}
                                >
                                    We'll connect your
                                    registered users
                                    here after order
                                    management.
                                </p>

                            </section>

                        </div>
                    )}


                {/* =================================
                    PRODUCTS
                ================================= */}

                {activeSection ===
                    "products" && (
                        <div
                            style={{
                                padding:
                                    "50px 5% 90px",
                            }}
                        >

                            {/* HEADER */}

                            <section className="admin-header">

                                <div>

                                    <p className="section-eyebrow">
                                        GLOWCARE
                                        ADMIN
                                    </p>

                                    <h1>
                                        Product
                                        <span>
                                            studio.
                                        </span>
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


                            {/* PRODUCT FORM */}

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


                                    <form
                                        onSubmit={
                                            handleSubmit
                                        }
                                    >

                                        <div className="admin-form-grid">

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
                                                    required={
                                                        !editingProduct
                                                    }
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
                                                        Uploading
                                                        image...
                                                    </p>
                                                )}

                                                {!uploadingImage &&
                                                    formData.image && (
                                                        <p className="image-upload-status success">
                                                            Image
                                                            ready ✓
                                                        </p>
                                                    )}

                                                {editingProduct && (
                                                    <p className="admin-image-help">
                                                        Leave the
                                                        image
                                                        empty to
                                                        keep the
                                                        current
                                                        image.
                                                    </p>
                                                )}

                                            </div>


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
                                                onClick={
                                                    resetForm
                                                }
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


                            {/* STATS */}

                            <section className="admin-stats">

                                <div className="admin-stat-card">

                                    <span>
                                        Total Products
                                    </span>

                                    <strong>
                                        {
                                            products.length
                                        }
                                    </strong>

                                </div>


                                <div className="admin-stat-card">

                                    <span>
                                        Categories
                                    </span>

                                    <strong>
                                        {
                                            categories
                                        }
                                    </strong>

                                </div>


                                <div className="admin-stat-card">

                                    <span>
                                        Low Stock
                                    </span>

                                    <strong>
                                        {
                                            lowStock
                                        }
                                    </strong>

                                </div>

                            </section>


                            {/* PRODUCT LIST */}

                            <section className="admin-products">

                                <div className="admin-section-heading">

                                    <div>

                                        <p className="section-eyebrow">
                                            PRODUCT
                                            CATALOG
                                        </p>

                                        <h2>
                                            All products
                                        </h2>

                                    </div>

                                    <span>
                                        {
                                            products.length
                                        }{" "}
                                        items
                                    </span>

                                </div>


                                <div className="admin-product-list">

                                    {products.map(
                                        (
                                            product
                                        ) => (
                                            <article
                                                className="admin-product-row"
                                                key={
                                                    product._id
                                                }
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
                                                    ₹
                                                    {
                                                        product.price
                                                    }
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
                                                            handleDeleteProduct(
                                                                product
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </article>
                                        )
                                    )}


                                    {products.length ===
                                        0 && (
                                            <p
                                                style={{
                                                    padding:
                                                        "40px",
                                                    textAlign:
                                                        "center",
                                                    color:
                                                        "var(--muted-text)",
                                                    fontSize:
                                                        "13px",
                                                }}
                                            >
                                                No products
                                                found.
                                            </p>
                                        )}

                                </div>

                            </section>

                        </div>
                    )}

            </div>

        </main>
    );
}