import React, { useState } from 'react';
import './ReviewModal.scss';

interface ReviewModalProps {
    onClose: () => void;
    onSubmit: (review: { rating: number; comment: string }) => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ onClose, onSubmit }) => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>('');

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value);
    };

    const handleSubmit = () => {
        if (rating > 0 && comment.trim()) {
            onSubmit({ rating, comment });
            setRating(0);
            setComment('');
        } else {
            alert('Please provide both rating and comment!');
        }
    };

    return (
        <div className="review-modal-overlay">
            <div className="review-modal">
                <h2>Write a Review</h2>

                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`star ${star <= rating ? 'filled' : ''}`}
                            onClick={() => handleRatingChange(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <textarea
                    placeholder="Write your review here..."
                    value={comment}
                    onChange={handleCommentChange}
                />

                <div className="modal-actions">
                    <button onClick={onClose} className="cancel-btn">Cancel</button>
                    <button onClick={handleSubmit} className="submit-btn">Submit</button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
