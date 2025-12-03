import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import "./assets/css/app.css";

// Util Components
import Modal from './components/utils/Modal.vue';
import Toast from './components/utils/Toast.vue';

// Custom Components
import ProductList from './components/ProductList.vue';
import ProductCard from './components/ProductCard.vue';

const app = createApp(App);

app.use(createPinia());

// Register utility components
app.component('modal', Modal);
app.component('toast', Toast);
// Register custom components
app.component('product-list', ProductList);
app.component('product-card', ProductCard);

app.mount('#app');
