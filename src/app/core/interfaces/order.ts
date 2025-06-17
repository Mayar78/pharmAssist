 

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