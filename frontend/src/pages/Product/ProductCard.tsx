import { useEffect, useState, useRef } from 'react';
import './ProductCard.scss';
import axios from 'axios';
import { Product, Review } from '../../utils/interface/types';
import { Link } from 'react-router-dom';
import StarRating from './StarRating';

const ProductCard = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [wishlist, setWishlist] = useState<Product[]>([]); // Wishlist state
    const productRowRef = useRef<HTMLDivElement | null>(null);

    // Fetch products along with reviews
    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:3000/product/allproduct');
            if (response) {
                setProducts(response.data);  // Assume this contains products with their reviews
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Load wishlist from localStorage on initial load
    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlist(storedWishlist);
    }, []);

    // Group products by category
    const groupByCategory = (products: Product[]) => {
        return products.reduce((acc, product) => {
            const categoryName = product.category?.name || 'Others'; 
            if (!acc[categoryName]) {
                acc[categoryName] = [];
            }
            acc[categoryName].push(product);
            return acc;
        }, {} as Record<string, Product[]>);
    };

    const groupedProducts = groupByCategory(products);

    // Function to calculate average rating from reviews
    const calculateAverageRating = (reviews: Review[]): number => {
        if (!reviews || reviews.length === 0) return 0;
        const total = reviews.reduce((sum, review) => sum + review.rating, 0);
        return Math.round(total / reviews.length); 
    };

    // Handle adding product to wishlist
    const handleAddToWishlist = (product: Product) => {
        // Check if product is already in the wishlist
        const isProductInWishlist = wishlist.some((item) => item._id === product._id);
        
        if (isProductInWishlist) {
            // Remove product from wishlist
            const updatedWishlist = wishlist.filter((item) => item._id !== product._id);
            setWishlist(updatedWishlist);
            // Store updated wishlist in localStorage
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
            alert('Product removed from wishlist');
        } else {
            // Add product to wishlist
            const updatedWishlist = [...wishlist, product];
            setWishlist(updatedWishlist);
            // Store updated wishlist in localStorage
            localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
            alert('Product added to wishlist');
        }
    };

    return (
        <div className="product-container">
            {Object.keys(groupedProducts).map((category) => (
                <div key={category} className="category">
                    <h2 className="category__title">{category}</h2>
                    <div className="slider-container">
                        <div className={`product-row slider-${category}`} ref={productRowRef}>
                            {groupedProducts[category].map((product) => {
                                const averageRating = calculateAverageRating(product.reviews);

                                // Check if this product is already in the wishlist
                                const isInWishlist = wishlist.some((item) => item._id === product._id);

                                return (
                                    <div className="product" key={product._id}>
                                        <span className="product__price">₹{product.currentPrice}</span>
                                        <Link to={`/product/${product._id}`}>
                                            <img className="product__image" src={product.images[0]?.url} alt={product.name} />
                                        </Link>
                                        <h1 className="product__title">{product.name}</h1>
                                        <hr />
                                        <p className="product__description">{product.description}</p>
                                        
                                        <div className="product__rating">
                                            <StarRating rating={averageRating} />
                                            <p className="rating">({product.reviews.length} Reviews)</p>
                                        </div>

                                        <div className="product__actions">
                                            {/* Conditional Wishlist Button */}
                                            <button
                                                className="wishlist-btn"
                                                onClick={() => handleAddToWishlist(product)}
                                            >
                                                {isInWishlist ? 'Remove Wishlist' : 'Add to Wishlist'}
                                            </button>
                                            <Link className="product__btn btn" to={''}>Buy Now</Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProductCard;
