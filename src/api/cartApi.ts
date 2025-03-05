import { generateClient } from "@aws-amplify/api";
import { type Schema } from "../../amplify/data/resource";

const client = generateClient<Schema>();

export const cartApi = {
  async createOrder(userId: string, items: OrderItem[], total: number) {
    try {
      // Create the order
      const { data: order, errors: orderErrors } = await client.models.Order.create({
        userId,
        total,
        status: "PENDING",
        createdAt: new Date().toISOString(),
      });

      if (orderErrors) throw new Error(orderErrors[0].message);

      // Create order items
      for (const item of items) {
        const { errors: itemErrors } = await client.models.OrderItem.create({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
        });

        if (itemErrors) throw new Error(itemErrors[0].message);
      }

      return order;
    } catch (error) {
      console.error("Error creating order:", error);
      return null;
    }
  }
};

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}
