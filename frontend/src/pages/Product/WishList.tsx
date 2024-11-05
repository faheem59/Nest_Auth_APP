import { useEffect, useState } from 'react';
import './Wishlist.scss';
import { Product } from '../../utils/interface/types'; 
import { Link } from 'react-router-dom';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState<Product[]>([]);

    // Load the wishlist from localStorage
    useEffect(() => {
        const storedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
        setWishlist(storedWishlist);
    }, []);

    // Handle removing product from wishlist
    const handleRemoveFromWishlist = (productId: string) => {
        const updatedWishlist = wishlist.filter(product => product._id !== productId);
        setWishlist(updatedWishlist);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist)); 
    };

    return (
        <div className="wishlist-container">
            <h1>Your Wishlist</h1>

            {wishlist.length === 0 ? (
                <p>Your wishlist is empty. Add some products to your wishlist!</p>
            ) : (
                <div className="wishlist-products">
                    {wishlist.map(product => (
                        <div className="wishlist-item" key={product._id}>
                            <Link to={`/product/${product._id}`}>
                                <img src={product.images[0]?.url} alt={product.name} className="wishlist-item__image" />
                                <div className="wishlist-item__info">
                                    <h3>{product.name}</h3>
                                    <p>{product.description}</p>
                                    <span>₹{product.currentPrice}</span>
                                </div>
                            </Link>
                            <button 
                                className="remove-btn" 
                                onClick={() => handleRemoveFromWishlist(product._id)}
                            >
                                Remove from Wishlist
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
