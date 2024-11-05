// StarRating.tsx
import React from 'react';

interface StarRatingProps {
    rating: number; 
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
    const stars = Array(5).fill(0);

    return (
        <div className="star-rating">
            {stars.map((_, index) => (
                <span key={index} className={index < rating ? 'star filled' : 'star'}>
                    ★
                </span>
            ))}
        </div>
    );
};

export default StarRating;
