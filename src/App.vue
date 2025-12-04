<script setup lang="ts">
  import { PRODUCT_API } from "@/api/product-api";
  import {computed, onMounted, ref} from 'vue'
  import axios from "axios";
  import { Product } from "@/interfaces/product-interfaces";
  import { useCartStore } from "@/stores/cart";
  import CheckoutApi from "@/api/checkout-api";
  import MailerApi from "@/api/mailer-api";
  import { CreatedOrder } from "@/interfaces/order-interfaces";

  const products = ref<Product[]>([]);
  const cart = useCartStore();
  const loadingProducts = ref<boolean>(false);
  const isCartModalOpen = ref<boolean>(false);
  const isCheckoutModalOpen = ref<boolean>(false);
  const isOrderConfirmationModalOpen = ref<boolean>(false);
  const checkoutEmail = ref<string>();
  const checkoutAddress = ref<string>();
  const checkoutNote = ref<string|null>();
  const processingOrder = ref<boolean>(false);
  const createdOrder = ref<CreatedOrder>();

  const fetchProducts = async () => {
    loadingProducts.value = true;
    const response = await axios.get(PRODUCT_API.list);
    products.value = response.data.data
    loadingProducts.value = false;
  }

  const formatToMoney = (number: number): number => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: 'USD'
    }).format(number);
  }

  const discardCart = (): void => {
    cart.discard();
    isCartModalOpen.value = false;
  }

  const checkout = (): void => {
    isCartModalOpen.value = false;
    isCheckoutModalOpen.value = true;
  }

  const checkoutFormValidated = computed(() => {
    return checkoutEmail.value && checkoutAddress.value && cart.items.length > 0;
  })

  const resetCheckout = (): void => {
    checkoutEmail.value = '';
    checkoutAddress.value = '';
    checkoutNote.value = '';
    discardCart();
    isCheckoutModalOpen.value = false;
  }

  const submitOrder = async () => {
    processingOrder.value = true;

    await axios.post(CheckoutApi.create, {
      email: checkoutEmail.value,
      address: checkoutAddress.value,
      note: checkoutNote.value,
      orders: cart.items
    }).then(res => {
      createdOrder.value = res.data;
    })

    await axios.post(MailerApi.orderNotification, {
      order_id: createdOrder.value.id
    })

    processingOrder.value = false;
    resetCheckout();
    // reload products
    await fetchProducts();
    // Open order confirmation modal
    isOrderConfirmationModalOpen.value = true;
  }

  onMounted(() => {
    fetchProducts();
  })
</script>

<template>
  <div class="flex flex-col py-6">
    <toast></toast>
    <div class="min-w-5xl m-auto">
      <!-- Header Section - Contains Cart Icon -->
      <div class="py-3 flex justify-end">
        <div id="cartBtn" @click="isCartModalOpen=true" class="rounded border py-1 px-2 border-gray-400 text-sm relative cursor-pointer hover:bg-gray-100">
          <div class="absolute text-[10px] rounded-full top-[-5px] right-[-5px] bg-red-600 px-1 flex justify-center text-center text-white">{{cart.items.length}}</div>
          <span id="cartBtnLabel">Cart</span>
        </div>
      </div>
      <!-- Search Section -->
      <div class="flex flex-col py-10 justify-center">
        <div class="flex justify-center">
          <input id="searchBar"
                 class="px-4 py-2 rounded-full border border-gray-300 w-full max-w-[70%]"
                 type="text"
                 placeholder="Search for Product">
        </div>
      </div>
      <!-- Product List Section -->
      <div id="loadingProductsLabel" v-if="loadingProducts" class="text-center">Loading products...</div>
      <product-list v-else :products="products"></product-list>
    </div>
    <!-- Cart Modal -->
    <modal :open="isCartModalOpen" @close="isCartModalOpen=false">
      <div class="flex flex-col">
        <div class="text-xl mb-6 font-bold text-blue-500">Cart</div>
        <div v-if="cart.length === 0">No items added yet</div>
        <template v-else>
          <div v-for="item in cart.items" class="text-sm mb-2">
            <div class="flex justify-between">
              <div>{{item.product_name}} <span class="text-xs text-gray-400">({{item.product_price}})</span> x {{item.quantity}}</div>
              <div>{{formatToMoney(item.product_price * item.quantity)}}</div>
            </div>
          </div>
        </template>
        <hr class="py-1 mt-2">
        <div class="flex justify-between">
          <div class="font-bold text-gray-500 text-sm">VAT (12%)</div>
          <div>{{formatToMoney(cart.totalPriceTax())}}</div>
        </div>
        <div class="flex justify-between">
          <div class="font-bold text-gray-900 text-sm">Total</div>
          <div>{{formatToMoney(cart.totalPriceTax() + cart.totalPrice())}}</div>
        </div>
        <div class="flex  mt-10">
          <button class="flex w-full text-center justify-center mr-3 bt-danger" @click="discardCart">Discard</button>
          <button class="flex w-full text-center justify-center" @click="checkout">Checkout</button>
        </div>
      </div>
    </modal>
    <!-- Checkout Modal -->
    <modal :open="isCheckoutModalOpen">
      <div class="flex flex-col">
        <div class="text-2xl mb-4 font-bold">
          Checkout
        </div>
        <div>
          <input type="email" class="form" v-model="checkoutEmail" placeholder="Enter email">
        </div>
        <div>
          <textarea type="text" class="form" v-model="checkoutAddress" placeholder="Enter Address"/>
        </div>
        <div class="mb-6">
          <textarea type="text" class="form" v-model="checkoutNote" placeholder="Enter Note"/>
        </div>
        <div v-if="cart.length === 0">No items added yet</div>
        <template v-else>
          <div v-for="item in cart.items" class="text-sm mb-2">
            <div class="flex justify-between">
              <div>{{item.product_name}} <span class="text-xs text-gray-400">({{item.product_price}})</span> x {{item.quantity}}</div>
              <div>{{formatToMoney(item.product_price * item.quantity)}}</div>
            </div>
          </div>
        </template>
        <hr class="py-1 mt-2">
        <div class="flex justify-between">
          <div class="font-bold text-gray-500 text-sm">VAT (12%)</div>
          <div>{{formatToMoney(cart.totalPriceTax())}}</div>
        </div>
        <div class="flex justify-between">
          <div class="font-bold text-gray-900 text-sm">Total</div>
          <div>{{formatToMoney(cart.totalPriceTax() + cart.totalPrice())}}</div>
        </div>
        <div class="flex mt-4">
          <button class="flex w-full mr-3" @click="isCheckoutModalOpen=false">Cancel</button>
          <button class="flex w-full btn-secondary" @click="submitOrder" :disabled="!checkoutFormValidated || processingOrder">Order</button>
        </div>
      </div>
    </modal>
    <!-- Order Confirmation Modal -->
    <modal :open="isOrderConfirmationModalOpen">
      <div class="flex flex-col">
        <div class="text-xl font-bold mb-4">Order Completed!</div>
        <div>An order summary will be sent to the email you used on checkout form. Thank you for your patronage!</div>
        <div class="mt-6 flex justify-end">
          <button class="btn-primary" @click="isOrderConfirmationModalOpen=false">Got it</button>
        </div>
      </div>
    </modal>
  </div>
</template>

<style scoped>

</style>
