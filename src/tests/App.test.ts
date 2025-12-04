import {mount} from "@vue/test-utils";
import App from '@/App.vue'
import {expect, test, beforeEach} from "vitest";
import { createPinia, setActivePinia } from "pinia";

const mountApp = () => {
  const pinia = createPinia();
  setActivePinia(pinia);
  return mount(App, {
    global: {
      plugins: [pinia],
      stubs: {
        toast: true,
        "product-list": true,
        modal: true,
      },
    },
  });
};

let wrapper: ReturnType<typeof mountApp>;

beforeEach(() => {
  wrapper = mountApp();
});

test('Test initial loading of products', async () => {
  const vm = wrapper.vm as any;
  // Expect products will be empty initially
  expect(vm.products.length).toBe(0);
  // Load the products
  await vm.fetchProducts();
  // Expect products will be loaded
  expect(vm.products.length).toBeGreaterThan(0);
})

test('Test App component initial loaded static contents', async () => {
  // Search bar placeholder
  expect(wrapper.find('#searchBar').attributes('placeholder')).toBe('Search for Product');
  // Cart button label
  expect(wrapper.find('#cartBtnLabel').text()).toBe('Cart');
  expect(wrapper.find('#loadingProductsLabel').text()).toBe('Loading products...');
})

test('Test cart button click to open cart modal', async () => {
  const vm = wrapper.vm as any;

  // Expect the modal to be closed initially
  expect(vm.isCartModalOpen).toBe(false);
  // Trigger cart button click
  wrapper.find('#cartBtn').trigger('click');
  // Expect the modal to be open now
  expect(vm.isCartModalOpen).toBe(true);
})
