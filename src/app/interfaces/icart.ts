export interface ICartItem {
  id: number;
  name: string;
  pictureUrl: string;
  activeIngredient: string;
  price: number;
  quantity: number;
}

export interface ICart {
  id: string;
  items: ICartItem[];
}