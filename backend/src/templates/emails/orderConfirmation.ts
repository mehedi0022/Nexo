interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export const orderConfirmationTemplate = (
  name: string,
  orderNumber: string,
  items: OrderItem[],
  total: number,
) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background: #f4f4f4; }
    .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 8px; padding: 32px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th { background: #f9f9f9; padding: 10px; text-align: left; font-size: 13px; }
    td { padding: 10px; border-bottom: 1px solid #eee; font-size: 14px; }
    .total { font-size: 16px; font-weight: bold; text-align: right; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Order Confirmed! 🎉</h2>
    <p>Hi <b>${name}</b>, your order <b>#${orderNumber}</b> has been placed.</p>

    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>Qty</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>৳${item.price}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>

    <div class="total">Total: ৳${total}</div>
    <p>We will notify you when your order is shipped.</p>
  </div>
</body>
</html>
`;
