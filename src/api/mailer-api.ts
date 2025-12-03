const BASE_URL = import.meta.env.VITE_MAILER_API_BASE_URL as string;

export default {
  orderNotification: `${BASE_URL}/notifications/order`
}
