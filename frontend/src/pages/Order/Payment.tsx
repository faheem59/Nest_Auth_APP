/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Payment.scss';

interface PaymentResponse {
  paymentId: string;
  status: string;
}
const PaymentPage = () => {
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  });

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('User') || '');

  // Safely retrieve and parse data from localStorage
  const orderItems = JSON.parse(localStorage.getItem('orderItems') || '[]');
  const shippingInfo = JSON.parse(localStorage.getItem('shippingInfo') || '{}');

  // Calculate total price of order items
  const calculateTotal = () => {
      return orderItems.reduce((total: number, item: any) => {
      return total + (item.currentPrice * item.quantity);
    }, 0);
  };

 const handlePaymentSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const paymentResponse = await processPayment(paymentInfo);

    const itemsPrice = calculateTotal();
    const taxPrice = 10;
    const shippingPrice = 5;
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    const order = {
      shippingInfo,
      orderItems: orderItems.map((item: any) => ({
        product: item._id,
        name: item.name,
        price: item.currentPrice,
        quantity: item.quantity,
        image: item.images[0]?.url,
      })),
      paymentInfo: {
        id: paymentResponse.paymentId,
        status: paymentResponse.status,
      },
      itemsPrice: Number(itemsPrice),
      taxPrice: Number(taxPrice),
      shippingPrice: Number(shippingPrice),
      totalPrice: Number(totalPrice),
      orderStatus: 'Processing',
      userId: user.id,
    };

      const createdOrder = await createOrder(order, user.id);
      console.log(createdOrder)
    navigate('/order-success');
  } catch (error: any) {
    console.error('Failed to create order:', error.message);
    alert('An error occurred while creating the order: ' + error.message);
  }
};

  const processPayment = (paymentInfo: { cardNumber: string; expirationDate: string; cvv: string; }): Promise<PaymentResponse> => {
    // Simulating payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ paymentId: '12345', status: 'Success' });
      }, 2000);
    });
  };

const createOrder = async (order: any, userId: string) => {
  try {
      const token = user.token;
      console.log(userId, 'ggg');
    const response = await axios.post(
      'http://localhost:3000/order/order',
      {
        ...order,
        userId,
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 201) {
      throw new Error('Failed to create order');
    }

    return response.data;
  } catch (error: any) {
    console.log(error)
  }
};


  return (
    <div className='payment-page'>
      <h2>Payment Information</h2>
      <form onSubmit={handlePaymentSubmit}>
        <input
          type="text"
          name="cardNumber"
          value={paymentInfo.cardNumber}
          onChange={(e) => setPaymentInfo({ ...paymentInfo, cardNumber: e.target.value })}
          placeholder="Card Number"
          required
        />
        <input
          type="text"
          name="expirationDate"
          value={paymentInfo.expirationDate}
          onChange={(e) => setPaymentInfo({ ...paymentInfo, expirationDate: e.target.value })}
          placeholder="Expiration Date"
          required
        />
        <input
          type="text"
          name="cvv"
          value={paymentInfo.cvv}
          onChange={(e) => setPaymentInfo({ ...paymentInfo, cvv: e.target.value })}
          placeholder="CVV"
          required
        />
        <button type="submit">Pay Now</button>
      </form>
    </div>
  );
};

export default PaymentPage;
