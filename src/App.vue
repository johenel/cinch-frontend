<script setup lang="ts">
  import {PRODUCT_API} from "@/api/product-api";
  import {onMounted, ref} from 'vue'
  import { Product } from "@/interfaces/product-interfaces";
  import axios from "axios";
  
  const products = ref<Product[]>([]);

  const fetchProducts = async () => {
    const response = await axios.get(PRODUCT_API.list);
    products.value = response.data
  }

  onMounted(() => {
    fetchProducts();
  })
</script>

<template>
  <div>
    Initial frontend config
  </div>
</template>

<style scoped>

</style>
