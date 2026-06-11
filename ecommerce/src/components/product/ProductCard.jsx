/**
 * ProductCard.jsx — Reusable Product Display Component
 *
 * RESPONSIBILITY:
 *  Display a single product with its image, title, description,
 *  and one action button (e.g., "Add to Cart" or "Remove").
 *
 * USAGE:
 *  <ProductCard
 *    title="iPhone 15"
 *    description="Price: $999 | Rating: 4.5"
 *    image="https://..."
 *    onAction={() => addToCart(product)}
 *    actionLabel="Add to Cart"
 *  />
 *
 * WHY REUSABLE:
 *  The same card layout is used on the Home page (Add to Cart)
 *  and the Cart page (Remove). The action is passed as a prop
 *  so the card itself has zero business logic.
 */

import { Button, Card } from 'antd';
import styles from './ProductCard.module.css';

// Destructure the Meta sub-component from Ant Design's Card
const { Meta } = Card;

const ProductCard = ({ title, description, image, onAction, actionLabel }) => (
  <Card
    className={styles.card}
    cover={
      // Product thumbnail image
      <img
        className={styles.image}
        alt={title}
        src={image}
        style={{ width: 150, height: 150 }}
      />
    }
  >
    {/* Product name and price/rating info */}
    <Meta
      title={<span style={{ color: '#333' }}>{title}</span>}
      description={<span style={{ color: '#555' }}>{description}</span>}
    />

    {/* Action button — behavior injected from parent via prop */}
    <Button
      onClick={onAction}
      style={{ marginTop: 10, backgroundColor: '#ffce12' }}
    >
      {actionLabel}
    </Button>
  </Card>
);

export default ProductCard;
