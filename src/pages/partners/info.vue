<template>
  <GoBack go-back-url="/admin/partners/" />
  <div class="wrapper__info-partner mt-50px">
    <h2>Замовлення партнера {{ partnerName }}</h2>
    <Orders :orders="orders" :hide-details-btn="true" />
    <div ref="sentinel" class="observer"></div>
  </div>
</template>
<script setup>
import Orders from "@/components/Orders.vue";
import Api from "@/lib/api.js";
import GoBack from "@/components/GoBack.vue";
import { useRoute } from "vue-router";

const route = useRoute();

const orders = ref([]);
const partnerName = ref("");

const loadMoreOptions = ref({
  take: 20,
  skip: 20,
});

const sentinel = ref(null);

async function getOrders() {
  orders.value = (
    await Api.get(`/admin/partners/${route.params.id}/orders`)
  ).data;

  partnerName.value = (
    await Api.get(`/admin/partners/${route.params.id}`)
  ).data.name;
}

async function loadMoreOrders() {
  orders.value.push(
    ...(
      await Api.get(
        `/admin/partners/${route.params.id}/orders/load-more/?take=${loadMoreOptions.value.take}&skip=${loadMoreOptions.value.skip}`,
      )
    ).data.orders,
  );

  loadMoreOptions.value.skip += 20;
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
<style>
.wrapper__info-partner {
  width: 80%;
  display: block;
  margin: 0 auto;
}
</style>
