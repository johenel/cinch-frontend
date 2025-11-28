const BASE_URL = import.meta.env.VITE_PRODUCT_API_BASE_URL as string;

export const PRODUCT_API = {
  list: `${BASE_URL}/products`,
  item: (id) => `${BASE_URL}/products/${id}`
}
