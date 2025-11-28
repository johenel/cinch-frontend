const BASE_URL = import.meta.env.VITE_CHECKOUT_API_BASE_URL as string;

export default {
  create: `${BASE_URL}/orders`
}
