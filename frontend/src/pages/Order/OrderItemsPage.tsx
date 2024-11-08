import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderItems.scss';
interface Product {
  _id: string;
  name: string;
  description: string;
  currentPrice: number;
  quantity: number;
  images: { url: string }[];
}

const OrderItemsPage = () => {
  const [orderItems, setOrderItems] = useState<Product[]>([]);
  const [shipping, setShipping] = useState<number>(5); 
  const navigate = useNavigate();

  // Load the cart from localStorage
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setOrderItems(storedCart);
  }, []);

  // Calculate the total price
  const calculateTotal = () => {
    const subtotal = orderItems.reduce((total, item) => total + item.currentPrice * item.quantity, 0);
    return subtotal + shipping; // No discount code, just subtotal + shipping
  };

  // Handle the proceed to payment
  const handleProceedToPayment = () => {
    localStorage.setItem('orderItems', JSON.stringify(orderItems));
    navigate('/payment');
  };

  return (
    <div className="order-items-page">
      <h2>Order Summary</h2>
      <ul>
        {orderItems.length === 0 ? (
          <p>Your cart is empty. Add some products to your cart!</p>
        ) : (
          orderItems.map((item, index) => (
            <li key={index} className="order-item">
              <img src={item.images[0]?.url} alt={item.name} width="50" />
              <div className="order-item__info">
                <div>{item.name}</div>
                <div>Price: ₹{item.currentPrice}</div>
                <div>Quantity: {item.quantity}</div>
                <div>Total: ₹{item.currentPrice * item.quantity}</div>
              </div>
            </li>
          ))
        )}
      </ul>

      <div className="order-summary">
        <div className="order-summary-item">
          <span>Shipping</span>
          <select value={shipping} onChange={(e) => setShipping(Number(e.target.value))}>
            <option value="5">Standard-Delivery - ₹5.00</option>
            <option value="10">Express-Delivery - ₹10.00</option>
          </select>
        </div>

        <div className="order-summary-item total">
          <span>Total Price</span>
          <span>₹{calculateTotal()}</span>
        </div>

        <button className="proceed-to-payment" onClick={handleProceedToPayment}>Proceed to Payment</button>
      </div>
    </div>
  );
};

export default OrderItemsPage;
