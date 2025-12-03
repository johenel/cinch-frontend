import { defineStore } from "pinia";
import { ref } from "vue";

interface OrderItem {
  product_id: number,
  product_name: string,
  product_description: string|null,
  product_price: number,
  quantity: number
}

interface Product {
  id: number,
  name: string,
  description: string|null,
  stock: number,
  price: number,
  featured_image: string|null
}

export const useCartStore = defineStore('cart', () => {
  const items = ref<OrderItem[]>([]);

  const addItem = (product: Product, quantity: number): void => {
    const index = items.value.findIndex(i => i.product_id === product.id);
    if (index > -1) {
      const updateItem = items.value[index];
      updateQuantity(updateItem, quantity);
    } else {
      items.value.push({
        product_id: product.id,
        product_name: product.name,
        product_description: product.description,
        product_price: product.price,
        quantity: quantity
      })
    }
  }

  const removeItem = (product_id: number): void => {
    const index = items.value.findIndex(i => i.product_id === product_id);
    items.value.splice(index,1);
  }

  const updateQuantity = (item: OrderItem, quantity: number): void => {
    const index = items.value.findIndex(i => i.product_id === item.product_id);
    items.value[index].quantity = quantity
  }

  const totalPrice = (): number => {
    let total = 0;
    items.value.forEach(item => total+= (item.product_price * item.quantity))
    return total;
  }

  const totalPriceTax = (): number => {
    return totalPrice() * 0.12;
  }

  const getOrderItem = (product: Product): OrderItem|null => {
    if (items.value.length > 0 && product) {
      return items.value.find(orderItem => orderItem.product_id === product.id);
    }
    return null;
  }

  const discard = () => {
    items.value = [];
  }

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    totalPrice,
    totalPriceTax,
    getOrderItem,
    discard
  }
})
