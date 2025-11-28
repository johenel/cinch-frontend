export interface OrderItem {
  product_id: number,
  product_name: string,
  product_description: string|null,
  product_price: number,
  quantity: number
}

export interface Order {
  email: string,
  address: string,
  note: string,
  orders: OrderItem[]
}
