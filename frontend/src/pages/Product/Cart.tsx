import React, { useEffect, useState } from 'react';
import './Cart.scss';
import { Product } from '../../utils/interface/types';
import { Link } from 'react-router-dom';

const Cart = () => {
    const [cart, setCart] = useState<Product[]>([]);
    const [shipping, setShipping] = useState<number>(5); // Default shipping cost
    const [discountCode, setDiscountCode] = useState<string>('');
    const [discount, setDiscount] = useState<number>(0);

    useEffect(() => {
        // Load cart from localStorage
        const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
        setCart(storedCart);
    }, []);

    const handleRemoveFromCart = (productId: string) => {
        // Remove product from cart
        const updatedCart = cart.filter(product => product._id !== productId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const handleQuantityChange = (productId: string, delta: number) => {
        // Update quantity in the cart
        const updatedCart = cart.map(product => 
            product._id === productId 
            ? { ...product, quantity: Math.max(product.quantity + delta, 1) }  // Prevent negative quantity
            : product
        );
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));  // Save updated cart to localStorage
    };

    const calculateTotalPrice = () => {
        const subtotal = cart.reduce((total, product) => total + product.currentPrice * product.quantity, 0);
        return subtotal + shipping - discount;
    };

    const applyDiscountCode = () => {
        // Check if the discount code is valid
        if (discountCode === "SAVE10") {
            setDiscount(10);
        } else {
            setDiscount(0);
            alert("Invalid discount code.");
        }
    };

    return (
        <div className="cart-container">
            <div className="cart-products">
                <h2>Shopping Cart</h2>
                {cart.length === 0 ? (
                    <p>Your cart is empty. Add some products to your cart!</p>
                ) : (
                    <>
                        {cart.map(product => (
                            <div className="cart-item" key={product._id}>
                                <img 
                                    src={product.images[0]?.url} 
                                    alt={product.name} 
                                    className="cart-item__image" 
                                />
                                <div className="cart-item__info">
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <div className="cart-item__quantity">
                                        <button 
                                            onClick={() => handleQuantityChange(product._id, -1)} 
                                            disabled={product.quantity <= 1}  // Disable minus if quantity is 1
                                        >
                                            -
                                        </button>
                                        <span>{product.quantity}</span>
                                        <button 
                                            onClick={() => handleQuantityChange(product._id, 1)} 
                                        >
                                            +
                                        </button>
                                    </div>
                                    <span className="cart-item__price">
                                        ₹{product.currentPrice * product.quantity}
                                    </span>
                                </div>
                                <button className="remove-btn" onClick={() => handleRemoveFromCart(product._id)}>
                                    ×
                                </button>
                            </div>
                        ))}
                        <Link to="/" className="back-to-shop">← Back to shop</Link>
                    </>
                )}
            </div>
            <div className="cart-summary">
                <h2>Summary</h2>
                <div className="summary-item">
                    <span>ITEMS {cart.length}</span>
                    <span>₹{cart.reduce((total, product) => total + product.currentPrice * product.quantity, 0)}</span>
                </div>
                <div className="summary-item">
                    <span>SHIPPING</span>
                    <select value={shipping} onChange={e => setShipping(Number(e.target.value))}>
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
                            onChange={e => setDiscountCode(e.target.value)}
                            placeholder="Enter your code"
                        />
                        <button onClick={applyDiscountCode}>→</button>
                    </div>
                </div>
                <div className="summary-item total">
                    <span>TOTAL PRICE</span>
                    <span>₹{calculateTotalPrice()}</span>
                </div>
                <button className="checkout-btn">CHECKOUT</button>
            </div>
        </div>
    );
};

export default Cart;
