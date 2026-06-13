/**
 * ProductCard.jsx — Reusable Product Display Component
 *
 * PHASE 7 UPDATE:
 *  - Added wishlist heart button
 *  - Heart fills red when product is in wishlist
 *  - onWishlist prop handles add/remove from wishlist
 */

import { Button, Card } from 'antd';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import styles from './ProductCard.module.css';

const { Meta } = Card;

const ProductCard = ({
  title,
  description,
  image,
  onAction,
  actionLabel,
  onWishlist,
  isWishlisted,
}) => (
  <Card
    className={styles.card}
    cover={
      <div className={styles.imageContainer}>
        <img
          className={styles.image}
          alt={title}
          src={image}
          style={{ width: 150, height: 150 }}
        />
        {/* Heart button — only shown when onWishlist prop is provided */}
        {onWishlist && (
          <button
            className={styles.heartBtn}
            onClick={(e) => {
              e.stopPropagation(); // prevent card click
              onWishlist();
            }}
            title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isWishlisted ? (
              <FaHeart style={{ color: '#e53935' }} />
            ) : (
              <FaRegHeart style={{ color: '#999' }} />
            )}
          </button>
        )}
      </div>
    }
  >
    {/* Product name and price/rating info */}
    <Meta
      title={<span style={{ color: '#333' }}>{title}</span>}
      description={<span style={{ color: '#555' }}>{description}</span>}
    />

    {/* Action button */}
    <Button
      onClick={onAction}
      style={{ marginTop: 10, backgroundColor: '#ffce12' }}
    >
      {actionLabel}
    </Button>
  </Card>
);

export default ProductCard;