<template>
  <div class="wrapper__orders">
    <h2>Замовлення</h2>
    <h3>Кількість замовлень: {{ ordersCount }}</h3>
    <Orders :orders="orders" />
    <div ref="sentinel" class="observer" style="height: 10px"></div>
  </div>
</template>

<script setup>
import Api from "@/lib/api.js";
import Orders from "@/components/Orders.vue";

const orders = ref([]);
const ordersCount = ref(0);

const loadMoreOptions = ref({
  skip: 16,
  take: 16,
});

const sentinel = ref(null);

async function getOrders() {
  const data = (await Api.get("/admin/orders")).data;

  orders.value = data.orders;
  ordersCount.value = data.countOrders;
}

async function loadMoreOrders() {
  const data = (
    await Api.get(
      `/admin/orders/load-more?take=${loadMoreOptions.value.take}&skip=${loadMoreOptions.value.skip}`,
    )
  ).data;

  loadMoreOptions.value.skip += 16;

  orders.value.push(...data.orders);
}

function createObserver() {
  const options = { threshold: 1.0 };

  const observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      loadMoreOrders();
    }
  }, options);

  observer.observe(sentinel.value);
}

onMounted(async function () {
  await getOrders();
  createObserver();
});
</script>
<style scoped>
.wrapper__orders {
  display: block;
  margin: 0 auto;
  width: 80%;
}
</style>
