import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  Product: a.model({
    id: a.id(),
    name: a.string().required(),
    description: a.string(),
    price: a.float().required(),
    inventory: a.integer().required(),
    categoryId: a.id(),
    category: a.belongsTo("Category", "categoryId"),
    orderItems: a.hasMany("OrderItem", "productId"),
    imageUrl: a.string(),
  }),

  Category: a.model({
    id: a.id(),
    name: a.string().required(),
    products: a.hasMany("Product", "categoryId"),
  }),

  Order: a.model({
    id: a.id(),
    userId: a.id(),
    user: a.belongsTo("User", "userId"),
    items: a.hasMany("OrderItem", "orderId"),
    total: a.float().required(),
    status: a.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"]),
    createdAt: a.datetime(),
  }),

  OrderItem: a.model({
    id: a.id(),
    orderId: a.id(),
    order: a.belongsTo("Order", "orderId"),
    productId: a.id(),
    product: a.belongsTo("Product", "productId"),
    quantity: a.integer().required(),
    price: a.float().required(),
  }),

  User: a.model({
    id: a.id(),
    email: a.string().required(),
    name: a.string().required(),
    orders: a.hasMany("Order", "userId"),
  }),
}).authorization((allow) => [
  allow.guest().to(["read"]),
  allow.owner().to(["create", "update", "delete"]),
]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
