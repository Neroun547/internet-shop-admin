<template>
  <GoBack go-back-url="/admin/partners/" />
  <div class="wrapper__info-partner mt-50px">
    <h2>Замовлення партнера {{ partnerName }}</h2>
    <Orders
      :orders="orders"
      :hide-details-btn="true"
    />
    <div
      ref="sentinel"
      class="observer"
    ></div>
  </div>
</template>
<script>
import Orders from "@/components/Orders.vue";
import Api from "@/lib/api.js";
import GoBack from "@/components/GoBack.vue";

export default {
  components: {GoBack, Orders},
  data() {
    return {
      selectedTab: "",
      orders: [],
      partnerName: "",
      loadMoreOptions: {
        take: 20,
        skip: 20
      }
    }
  },
  methods: {
    async getOrders() {
      this.orders = (await Api.get(`/admin/partners/${this.$route.params.id}/orders`)).data;
      this.partnerName = (await Api.get("admin/partners/" + this.$route.params.id)).data.name;
    },
    createObserver() {
      const options = { threshold: 1.0 };
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.loadMoreOrders();
        }
      }, options);
      observer.observe(this.$refs.sentinel);
    },
    async loadMoreOrders() {
      this.orders.push(...(await Api.get(`/admin/partners/${this.$route.params.id}/orders/load-more/?take=${this.loadMoreOptions.take}&skip=${this.loadMoreOptions.skip}`)).data.orders);

      this.loadMoreOptions.skip += 20;
    }
  },
  async mounted() {
    await this.getOrders();
    this.createObserver();
  }
}
</script>
<style>
.wrapper__info-partner {
  width: 80%;
  display: block;
  margin: 0 auto;
}
</style>
