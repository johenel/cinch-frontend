<script setup lang="ts">
import {defineProps, defineEmits, ref, computed, watch, nextTick} from 'vue';
  import { Product } from "@/interfaces/product-interfaces";
  import { useToast } from "@/composables/use-toast";
  import { useCartStore } from "@/stores/cart";

  const { showToast } = useToast();
  const cart = useCartStore();

  const props = defineProps<{
    products: Product[]
  }>();

  const isProductDetailModalOpen = ref<boolean>(false);
  const isQuantityModalOpen = ref<boolean>(false);
  const selectedProduct = ref<Product|null>(null);
  const quantity = ref<number>(1);

  const selectedProductItem = computed(() => {
    return cart.getOrderItem(selectedProduct.value);
  });

  const openProductDetailModal = (product: Product): void => {
    selectedProduct.value = product;
    isProductDetailModalOpen.value = true;
  }

  const openAddToCartQuantityModal = (product: Product): void => {
    selectedProduct.value = product;
    quantity.value = selectedProductItem.value?.quantity ?? 1;
    isQuantityModalOpen.value = true;
  }

  const isNotEnoughStock = (stock: number): boolean => {
    return quantity.value > stock;
  }

  const addToCart = (): void => {
    cart.addItem(selectedProduct.value, quantity.value)
    showToast({
      message: `${selectedProduct?.value?.name} x ${quantity.value} added to cart`
    })
    // reset selected product and quantity
    selectedProduct.value = null;
    quantity.value = 1;
    // Close quantity modal
    isQuantityModalOpen.value = false;
  }

  const removeCartItem = (): void => {
      cart.removeItem(selectedProductItem.value.product_id);
      selectedProduct.value = null;
      isQuantityModalOpen.value = false;
  }

</script>

<template>
  <div class="grid grid-cols-3 gap-3">
    <product-card v-for="product in props.products" :product="product" @open-product-detail="openProductDetailModal" @add-to-cart="openAddToCartQuantityModal"></product-card>
  </div>
  <!-- Product Detail Modal -->
  <modal :open="isProductDetailModalOpen" @close="isProductDetailModalOpen=false">
    <div class="flex flex-col">
      <div class="text-2xl">{{selectedProduct?.name}}</div>
      <div class="flex justify-between mt-4 text-sm">
        <div>Price: <b class="text-green-600">${{selectedProduct?.price}}</b></div>
        <div>Stock: {{selectedProduct?.stock}}</div>
      </div>
      <div class="mt-8 text-gray-500 text-sm">{{selectedProduct?.description}}</div>
    </div>
  </modal>
  <!-- Quantity Modal -->
  <modal :open="isQuantityModalOpen" @close="isQuantityModalOpen=false">
    <div class="flex flex-col">
      How many do you want to order?
    </div>
    <div class="text-sm text-gray-400"> (stock: <span :class="[isNotEnoughStock(selectedProduct?.stock) ? 'text-red-500' : '']">{{selectedProduct?.stock}}</span>)</div>
    <div class="px-2 py-1 rounded border border-gray-200 mt-3">
      <input type="number" :min="1" :max="selectedProduct?.stock" class="w-full" v-model="quantity">
    </div>
    <div class="flex mt-4 justify-end">
      <button v-if="selectedProductItem" class="btn-danger mr-2" @click="removeCartItem">Remove</button>
      <button v-if="selectedProductItem" :disabled="isNotEnoughStock(selectedProduct?.stock)" @click="addToCart">Update</button>
      <button v-else class="btn-primary" :disabled="isNotEnoughStock(selectedProduct?.stock)" @click="addToCart">Add to Cart</button>
    </div>
  </modal>
</template>
