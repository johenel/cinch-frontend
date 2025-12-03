<script setup lang="ts">
  import { defineProps, defineEmits } from 'vue';
  import { Product} from "@/interfaces/product-interfaces";
  import {OrderItem} from "@/interfaces/order-interfaces";
  import {useCartStore} from "@/stores/cart";

  const props = defineProps<{
    product: Product
  }>();
  const cart = useCartStore();

  const emit = defineEmits<{
  (e: 'openProductDetail', product: Product): void,
  (e: 'addToCart', product: Product): void
  }>();

  const formatPrice = (price: number): string => {
    return `$${price}`;
  }
</script>

<template>
  <div class="flex flex-col rounded-md border border-gray-100 overflow-hidden cursor-pointer hover:shadow-lg">
    <div class="h-[200px] bg-gray-200">
    </div>
    <div class="p-3 flex flex-col">
      <div>{{product.name}}</div>
      <div class="flex justify-between mt-1 text-xs">
        <div >Price: <b class="text-green-700">{{formatPrice(product.price)}}</b></div>
        <div >Stock: {{product.stock}}</div>
      </div>
      <div class="flex py-1 mt-4 justify-between text-sm">
        <button @click="emit('openProductDetail', product)">Details</button>
        <button @click="emit('addToCart', product)" :class="[cart.getOrderItem(props.product) ? 'btn-primary' : '']">
          <span v-if="!cart.getOrderItem(props.product)">Add to Cart</span>
          <span v-else>Added ({{cart.getOrderItem(props.product).quantity}})</span>
        </button>
      </div>
    </div>
  </div>
</template>
