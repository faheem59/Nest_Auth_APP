/* eslint-disable @typescript-eslint/no-explicit-any */
/* ShippingPage.js */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Shipping.scss";

const ShippingPage = () => {
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    phoneNo: '',
  });

  const history = useNavigate();

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    // Handle pinCode and phoneNo to ensure they are numbers
    if (name === 'pinCode' || name === 'phoneNo') {
      // Allow only numeric input
      const numericValue = value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
      setShippingInfo({
        ...shippingInfo,
        [name]: numericValue,  // Only set the cleaned-up numeric value
      });
    } else {
      setShippingInfo({
        ...shippingInfo,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Validate pinCode and phoneNo before saving
    if (!shippingInfo.pinCode || !shippingInfo.phoneNo) {
      alert('Pin Code and Phone Number are required and must be numeric!');
      return;
    }

    // Convert pinCode and phoneNo to numbers
    const updatedShippingInfo = {
      ...shippingInfo,
      pinCode: Number(shippingInfo.pinCode),  // Convert to number
      phoneNo: Number(shippingInfo.phoneNo),  // Convert to number
    };

    // Send the shipping info to the next page (order items page)
    localStorage.setItem('shippingInfo', JSON.stringify(updatedShippingInfo));
    history('/order-items');
  };

  return (
    <div className="shipping-page">
      <h2>Shipping Information</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="address"
          value={shippingInfo.address}
          onChange={handleChange}
          placeholder="Address"
          required
        />
        <input
          type="text"
          name="city"
          value={shippingInfo.city}
          onChange={handleChange}
          placeholder="City"
          required
        />
        <input
          type="text"
          name="state"
          value={shippingInfo.state}
          onChange={handleChange}
          placeholder="State"
          required
        />
        <input
          type="text"
          name="country"
          value={shippingInfo.country}
          onChange={handleChange}
          placeholder="Country"
          required
        />
        <input
          type="text"
          name="pinCode"
          value={shippingInfo.pinCode}
          onChange={handleChange}
          placeholder="Pin Code"
          required
          pattern="\d*" // Ensure that only numbers are entered
        />
        <input
          type="text"
          name="phoneNo"
          value={shippingInfo.phoneNo}
          onChange={handleChange}
          placeholder="Phone Number"
          required
          pattern="\d*" // Ensure that only numbers are entered
        />
        <button type="submit">Next</button>
      </form>
    </div>
  );
};

export default ShippingPage;
