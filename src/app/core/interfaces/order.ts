export interface Order {
  id: number;
  buyerEmail: string;
  orderDate: string;
  status: number;
  shippingAddress: ShippingAddress;
  deliveryMethod: string;
  deliveryMethodCost: string;
  items: OrderItem[];
  subTotal: number;
  total: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  city: string;
  country: string;
  street: string;
}

export interface OrderItem {
  productId: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}