import React, { useEffect, useState } from "react";
import "./Cart.scss";
import { Product } from "../../utils/interface/types";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Cart = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [shipping, setShipping] = useState<number>(5); // Default shipping cost
  const [discountCode, setDiscountCode] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("User") || "{}"); // Get the user data from localStorage

  useEffect(() => {
    if (user?.id) {
      fetchCartItems(user.id); // Fetch the cart items from the backend
    }
  }, []);

  // Fetch cart items from the backend
  const fetchCartItems = async (userId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/auth/${userId}/cart`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      setCart(response.data); // Assuming response contains the cart array
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };
  const handleRemoveFromCart = async (productId: string) => {
    if (!user?.id) {
      alert("Please log in to remove items from your cart");
      return;
    }

    setIsLoading(true); // Set loading to true when the request starts

    try {
      const response = await axios.delete(
        `http://localhost:3000/auth/${user.id}/cart`,
        {
          data: { productId },
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.status === 200) {
        setCart((prevCart) =>
          prevCart.filter((item) => item.productId._id !== productId)
        );
        alert("Item removed from cart");
      } else {
        console.error("Failed to remove item from cart:", response.data);
        alert("Failed to remove item from cart");
      }
    } catch (error) {
      console.error("Error removing item from cart:", error);
      alert("Error removing item from cart");
    } finally {
      setIsLoading(false); // Set loading to false once the operation is complete
    }
  };

  const handleQuantityChange = async (productId: string, delta: number) => {
    const updatedCart = cart.map((cartItem) =>
      cartItem.productId._id === productId
        ? { ...cartItem, quantity: Math.max(cartItem.quantity + delta, 1) } // Prevent negative quantity
        : cartItem
    );

    setCart(updatedCart);

    // Update quantity on the backend as well
    try {
      await axios.patch(
        `http://localhost:3000/auth/${user?.id}/cart/${productId}`,
        {
          quantity: updatedCart.find((item) => item.productId._id === productId)
            ?.quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
    } catch (error) {
      console.error("Error updating quantity:", error);
      alert("Failed to update item quantity");
    }
  };

  const calculateTotalPrice = () => {
    const subtotal = cart.reduce((total, cartItem) => {
      // Ensure cart item and its properties are valid
      if (
        !cartItem ||
        typeof cartItem.productId.currentPrice !== "number" ||
        typeof cartItem.quantity !== "number"
      ) {
        console.error("Invalid product data", cartItem);
        return total;
      }

      const price = cartItem.productId.currentPrice || 0;
      const quantity = cartItem.quantity || 0;

      console.log("Total so far:", total + price * quantity);

      return total + price * quantity;
    }, 0);

    return subtotal + shipping - discount;
  };

  const applyDiscountCode = () => {
    if (discountCode === "SAVE10") {
      setDiscount(10);
    } else {
      setDiscount(0);
      alert("Invalid discount code.");
    }
  };
  console.log(cart, "ggg");

  const handleCheckout = () => {
    navigate("/shipping");
  };

  return (
    <div className="cart-container">
      <div className="cart-products">
        <h2>Shopping Cart</h2>
        {cart?.length === 0 ? (
          <p>Your cart is empty. Add some products to your cart!</p>
        ) : (
          <>
            {cart?.map((cartItem) => (
              <div className="cart-item" key={cartItem.productId._id}>
                <img
                  src={cartItem.productId.images[0]?.url} // Access the first image
                  alt={cartItem.productId.name}
                  className="cart-item__image"
                />
                <div className="cart-item__info">
                  <h3>{cartItem.productId.name}</h3>
                  <p>{cartItem.productId.description}</p>
                  <div className="cart-item__quantity">
                    <button
                      onClick={() =>
                        handleQuantityChange(cartItem.productId._id, -1)
                      }
                      disabled={cartItem.quantity <= 1} // Disable minus if quantity is 1
                    >
                      -
                    </button>
                    <span>{cartItem.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(cartItem.productId._id, 1)
                      }
                    >
                      +
                    </button>
                  </div>
                  <span className="cart-item__price">
                    ₹{cartItem.productId.currentPrice * cartItem.quantity}
                  </span>
                </div>
                {isLoading ? (
                  <div>Loading...</div> // Replace this with a spinner if preferred
                ) : (
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromCart(cartItem.productId._id)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <Link to="/" className="back-to-shop">
              ← Back to shop
            </Link>
          </>
        )}
      </div>
      <div className="cart-summary">
        <h2>Summary</h2>
        <div className="summary-item">
          <span>ITEMS {cart?.length}</span>
          <span>
            ₹
            {cart.reduce(
              (total, cartItem) =>
                total + cartItem.productId.currentPrice * cartItem.quantity,
              0
            )}
          </span>
        </div>
        <div className="summary-item">
          <span>SHIPPING</span>
          <select
            value={shipping}
            onChange={(e) => setShipping(Number(e.target.value))}
          >
            <option value="5">Standard-Delivery - ₹5.00</option>
            <option value="10">Express-Delivery - ₹10.00</option>
          </select>
        </div>
        <div className="summary-item">
          <span>GIVE CODE</span>
          <div className="discount-code">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Enter your code"
            />
            <button onClick={applyDiscountCode}>→</button>
          </div>
        </div>
        <div className="summary-item total">
          <span>TOTAL PRICE</span>
          <span>₹{calculateTotalPrice()}</span>
        </div>
        <button className="checkout-btn" onClick={handleCheckout}>
          CHECKOUT
        </button>
      </div>
    </div>
  );
};

export default Cart;
