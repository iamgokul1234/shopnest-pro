// src/utils/emailTemplates.js
// HTML email templates for ShopNest Pro

// ─── Welcome Email ────────────────────────────────────────────────
export const welcomeEmail = (name) => ({
  subject: "Welcome to ShopNest Pro! 🛍️",
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #0f1111; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffce12; margin: 0;">ShopNest Pro</h1>
      </div>
      
      <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0;">
        <h2 style="color: #222;">Welcome, ${name}! 👋</h2>
        <p style="color: #555; line-height: 1.6;">
          Thank you for joining ShopNest Pro. Your account has been 
          created successfully.
        </p>
        <p style="color: #555; line-height: 1.6;">
          You can now:
        </p>
        <ul style="color: #555; line-height: 2;">
          <li>Browse thousands of products</li>
          <li>Add items to your cart and wishlist</li>
          <li>Place orders with fast delivery</li>
          <li>Track your orders in real time</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a 
            href="http://localhost:5173" 
            style="background: #ffce12; color: #222; padding: 12px 30px; 
                   text-decoration: none; border-radius: 6px; 
                   font-weight: bold; font-size: 16px;"
          >
            Start Shopping
          </a>
        </div>
      </div>

      <div style="background: #f5f5f5; padding: 16px; text-align: center; 
                  border-radius: 0 0 8px 8px; color: #888; font-size: 12px;">
        <p>ShopNest Pro — Your one stop shop</p>
      </div>
    </div>
  `,
});

// ─── Order Confirmation Email ──────────────────────────────────────
export const orderConfirmationEmail = (name, order) => ({
  subject: `Order Confirmed #${order._id.toString().slice(-6).toUpperCase()} 🎉`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #0f1111; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: #ffce12; margin: 0;">ShopNest Pro</h1>
      </div>

      <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0;">
        <h2 style="color: #222;">Order Confirmed! 🎉</h2>
        <p style="color: #555;">Hi ${name}, your order has been placed successfully.</p>

        <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #333;">
            <strong>Order ID:</strong> 
            #${order._id.toString().slice(-6).toUpperCase()}
          </p>
          <p style="margin: 8px 0 0; color: #333;">
            <strong>Payment:</strong> 
            ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay'}
          </p>
          <p style="margin: 8px 0 0; color: #333;">
            <strong>Total:</strong> $${order.totalPrice.toFixed(2)}
          </p>
          <p style="margin: 8px 0 0; color: #333;">
            <strong>Status:</strong> 
            <span style="color: #e65100; font-weight: bold;">
              ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </p>
        </div>

        <h3 style="color: #333;">Items Ordered:</h3>
        ${order.items
          .map(
            (item) => `
          <div style="display: flex; padding: 12px 0; border-bottom: 1px solid #f0f0f0;">
            <div>
              <p style="margin: 0; font-weight: bold; color: #333;">${item.title}</p>
              <p style="margin: 4px 0 0; color: #666; font-size: 14px;">
                $${item.price} × ${item.quantity} = 
                $${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        `
          )
          .join("")}

        <h3 style="color: #333; margin-top: 20px;">Shipping Address:</h3>
        <div style="background: #f9f9f9; padding: 16px; border-radius: 8px;">
          <p style="margin: 0; color: #555;">${order.shippingAddress.fullName}</p>
          <p style="margin: 4px 0 0; color: #555;">${order.shippingAddress.phone}</p>
          <p style="margin: 4px 0 0; color: #555;">${order.shippingAddress.address}</p>
          <p style="margin: 4px 0 0; color: #555;">
            ${order.shippingAddress.city}, ${order.shippingAddress.state} - 
            ${order.shippingAddress.pincode}
          </p>
        </div>
      </div>

      <div style="background: #f5f5f5; padding: 16px; text-align: center;
                  border-radius: 0 0 8px 8px; color: #888; font-size: 12px;">
        <p>ShopNest Pro — Your one stop shop</p>
      </div>
    </div>
  `,
});

// ─── Order Status Update Email ─────────────────────────────────────
export const orderStatusEmail = (name, order) => {
  const statusColors = {
    pending: "#e65100",
    processing: "#1565c0",
    shipped: "#6a1b9a",
    delivered: "#2e7d32",
    cancelled: "#c62828",
  };

  const statusMessages = {
    pending: "Your order is pending confirmation.",
    processing: "Your order is being processed.",
    shipped: "Your order has been shipped and is on its way!",
    delivered: "Your order has been delivered. Enjoy your purchase!",
    cancelled: "Your order has been cancelled.",
  };

  return {
    subject: `Order Update #${order._id.toString().slice(-6).toUpperCase()} — ${
      order.status.charAt(0).toUpperCase() + order.status.slice(1)
    }`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #0f1111; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: #ffce12; margin: 0;">ShopNest Pro</h1>
        </div>

        <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0;">
          <h2 style="color: #222;">Order Status Update</h2>
          <p style="color: #555;">Hi ${name},</p>
          <p style="color: #555;">${statusMessages[order.status]}</p>

          <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #333;">
              <strong>Order ID:</strong> 
              #${order._id.toString().slice(-6).toUpperCase()}
            </p>
            <p style="margin: 8px 0 0; color: #333;">
              <strong>New Status:</strong>
              <span style="color: ${statusColors[order.status]}; font-weight: bold;">
                ${order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
            </p>
            <p style="margin: 8px 0 0; color: #333;">
              <strong>Total:</strong> $${order.totalPrice.toFixed(2)}
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a 
              href="http://localhost:5173/orders"
              style="background: #ffce12; color: #222; padding: 12px 30px;
                     text-decoration: none; border-radius: 6px;
                     font-weight: bold; font-size: 16px;"
            >
              View My Orders
            </a>
          </div>
        </div>

        <div style="background: #f5f5f5; padding: 16px; text-align: center;
                    border-radius: 0 0 8px 8px; color: #888; font-size: 12px;">
          <p>ShopNest Pro — Your one stop shop</p>
        </div>
      </div>
    `,
  };
};