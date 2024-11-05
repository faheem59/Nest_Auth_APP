/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import "./ProductDetail.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Product } from "../../utils/interface/types";
import Navbar from "../../components/commonComponent/CommonNavbar";
import StarRating from "../../pages/Product/StarRating";
import ReviewModal from "./ReviewModal";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [numOfReviews, setNumOfReviews] = useState<number>(0);
  const [visibleReviews, setVisibleReviews] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [reviews, setReviews] = useState<any[]>([]);

  const fetchSingleProduct = async () => {
    try {
      const response = await axios.get<Product>(
        `http://localhost:3000/product/${id}`
      );
      setProduct(response.data);
      const reviews = response.data.reviews || [];
      const numOfReviews = reviews.length;
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      const averageRating = numOfReviews > 0 ? totalRating / numOfReviews : 0;
      setReviews(reviews);
      setNumOfReviews(numOfReviews);
      setRating(averageRating);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSingleProduct();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(e.target.value));
  };

  const handleAddReview = async (newReview: {
    rating: number;
    comment: string;
  }) => {
    const user = localStorage.getItem("User");
    const userName = user ? JSON.parse(user).name : "Anonymous";
    const reviewData = {
      name: userName,
      rating: newReview.rating,
      comment: newReview.comment,
    };

    try {

      const response = await axios.post(
        `http://localhost:3000/product/${id}/reviews`,
        reviewData
      );

      if (response.status === 200) {
        setReviews((prevReviews) => [...prevReviews, reviewData]);
        setIsModalOpen(false);
      } else {
        console.error("Failed to add review:", response.data);
      }
    } catch (error) {
      console.error("Error adding review:", error);
    }
  };

  const handleLoadMore = () => {
    setVisibleReviews((prev) => prev + 2);
  };

  const handleAddToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProductIndex = cart.findIndex(
      (item: any) => item._id === product._id
    );

    if (existingProductIndex >= 0) {
      cart[existingProductIndex].quantity += quantity;
    } else {
      cart.push({ ...product, quantity });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart.`);
  };

  if (!product) {
    return <p>Loading product details...</p>;
  }

  return (
    <>
      <Navbar />
      <div className="product-detail">
        <nav className="breadcrumb">
          <span>Home</span> &gt; <span>Shop</span> &gt;{" "}
          <span>{product.category?.name}</span> &gt; <span>{product.name}</span>
        </nav>

        <div className="product-content">
          <div className="product-images">
            <img
              src={product.images[0]?.url || "https://via.placeholder.com/400"}
              alt={product.images[0]?.alt || product.name}
              className="main-image"
            />
            <div className="thumbnail-images">
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img.url}
                  alt={img.alt || `Thumbnail ${index + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="product-info">
            <h1>{product.name}</h1>
            <p className="price">
              Price:{" "}
              <span className="current-price">₹{product.currentPrice}</span>
              <span className="original-price">₹{product.originalPrice}</span>
            </p>
            <p className="description">{product.description}</p>
            <p className="stock">
              Stock: {product.stock > 0 ? product.stock : "Out of stock"}
            </p>

            <div className="rating">
              <p>Rating: {rating.toFixed(1)} / 5</p>
              <p>({numOfReviews} reviews)</p>
            </div>

            {product.category?.name === "Fashion" && (
              <div className="size-selection">
                <label htmlFor="size">Size:</label>
                <select id="size" defaultValue="L">
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>
            )}

            <div className="quantity-selection">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
              />
              <button className="add-to-cart" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>

            <div className="delivery-info">
              <p>Delivery:</p>
              <p>
                Free standard shipping on orders over $35 before tax, plus free
                returns.
              </p>
              <table>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>How Long</th>
                    <th>How Much</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Standard delivery</td>
                    <td>1-4 business days</td>
                    <td>₹4.50</td>
                  </tr>
                  <tr>
                    <td>Express delivery</td>
                    <td>1 business day</td>
                    <td>₹10.00</td>
                  </tr>
                  <tr>
                    <td>Pick up in store</td>
                    <td>1-3 business days</td>
                    <td>Free</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="reviews">
          <h2>Customer Reviews</h2>

          <div className="review-container">
            {reviews
              .slice(0, visibleReviews)
              .map((review: any, index: number) => (
                <div key={index} className="review">
                  <p>
                    <strong>{review.name}</strong>
                  </p>
                  <div className="review-rating">
                    <StarRating rating={review.rating} />
                    <span className="review-date">{review.date}</span>
                  </div>
                  <div className="review-comment">{review.comment}</div>
                </div>
              ))}
          </div>

          {reviews.length > visibleReviews && (
            <button onClick={handleLoadMore} className="load-more-btn">
              Load More
            </button>
          )}

          {reviews.length === 0 && (
            <p className="no-reviews">No reviews yet.</p>
                  )}
                  
          <button
            className="write-review-btn"
            onClick={() => setIsModalOpen(true)}
          >
            Write a Review
          </button>
        </div>
      </div>

      {isModalOpen && (
        <ReviewModal
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddReview}
        />
      )}
    </>
  );
};

export default ProductDetail;
