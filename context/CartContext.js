"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get cart from MongoDB
  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const response = await fetch(
        "/api/cart"
      );

      if (!response.ok) {
        setCartItems([]);
        return;
      }

      const data = await response.json();

      if (data.success && data.cart) {
        const items = data.cart.items.map(
          (item) => ({
            id: item.product._id,
            _id: item.product._id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image,
            category: item.product.category,
            rating: item.product.rating,
            quantity: item.quantity,
          })
        );

        setCartItems(items);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error(
        "Failed to fetch cart:",
        error
      );

      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }

  // Add product to cart
  async function addToCart(
    product,
    quantity = 1
  ) {
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
            productId:
              product._id || product.id,
            quantity,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error(
          "Add to cart failed:",
          data.message
        );

        return false;
      }

      // Refresh cart from MongoDB
      await fetchCart();

      return true;

    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      return false;
    }
  }

  // Remove product from cart
  async function removeFromCart(
    productId
  ) {
    try {
      const response = await fetch(
        "/api/cart",
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

      if (!response.ok || !data.success) {
        console.error(
          "Remove from cart failed:",
          data.message
        );

        return;
      }

      await fetchCart();

    } catch (error) {
      console.error(
        "Remove cart error:",
        error
      );
    }
  }

  // Update quantity
  async function updateQuantity(
    productId,
    quantity
  ) {
    try {
      const response = await fetch(
        "/api/cart",
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            productId,
            quantity,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error(
          "Update quantity failed:",
          data.message
        );

        return;
      }

      await fetchCart();

    } catch (error) {
      console.error(
        "Update quantity error:",
        error
      );
    }
  }

  // Total number of products
  const cartCount = cartItems.reduce(
    (total, item) =>
      total + item.quantity,
    0
  );

  // Total price
  const cartTotal = cartItems.reduce(
    (total, item) =>
      total +
      item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        cartTotal,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}