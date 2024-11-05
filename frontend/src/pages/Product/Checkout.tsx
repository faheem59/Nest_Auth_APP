/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const navigate = useNavigate();
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalPrice = cart.reduce((total: number, product: any) => total + product.currentPrice, 0);

    const handleCheckout = () => {
        // Here you would handle actual checkout logic (e.g., payment, shipping details, etc.)
        alert('Proceeding to payment');
        navigate('/');  // Redirect to homepage or a confirmation page
    };

    return (
        <div className="checkout-container">
            <h1>Checkout</h1>
            <p><strong>Total Price:</strong> ₹{totalPrice}</p>
            <button onClick={handleCheckout} className="checkout-btn">Proceed to Payment</button>
        </div>
    );
};

export default Checkout;
