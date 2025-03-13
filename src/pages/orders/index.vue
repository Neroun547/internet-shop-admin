<template>
  <div class="wrapper__orders mt-5 mb-5">
    <h2>Замовлення</h2>
    <h3>Кількість замовлень: {{ordersCount}}</h3>
    <Orders :orders="orders"/>
    <div
      ref="sentinel"
      class="observer"
    ></div>
  </div>
</template>

<script>
  import Api from "@/lib/api.js";
  import Orders from "@/components/Orders.vue";

  export default {
    components: { Orders },
    data() {
      return {
        orders: [],
        loadMoreOptions: {
          skip: 16,
          take: 16
        },
        ordersCount: 0
      }
    },
    methods: {
      async getOrders() {
        const data = (await Api.get("/admin/orders")).data;

        this.orders = data.orders;
        this.ordersCount = data.countOrders;
      },
      async loadMoreOrders() {
        const data = (await Api.get(`/admin/orders/load-more?take=${this.loadMoreOptions.take}&skip=${this.loadMoreOptions.skip}`)).data;

        this.loadMoreOptions.skip += 16;
        this.orders.push(...data.orders);
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
    },
    async mounted() {
      await this.getOrders();
      this.createObserver();
    }
  }
</script>
<style scoped>
  .wrapper__orders {
    display: block;
    margin: 0 auto;
    width: 80%;
  }
</style>
