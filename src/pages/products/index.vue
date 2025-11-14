<template>
  <div class="wrapper__products mt-5">
    <RouterLink to="/admin/products/add-product">
      <v-btn class="d-block ml-auto bg-yellow-accent-4">Додати товар <v-icon icon="mdi-plus"></v-icon></v-btn>
    </RouterLink>
    <h2>Всі товари</h2>
    <h3>Кількість товарів: {{productsCount}}</h3>
    <h3>Кількість товарів які є в наявності: {{countAvailableProducts}}</h3>
    <h3 class="mt-5">Фільтри:</h3>
    <v-form class="mt-5">
      <v-row>
        <v-col
          cols="12"
          lg="6"
        >
          <v-select label="Рубрика товару" variant="outlined" :items="rubricsSelectItems" v-model="selectedRubric"></v-select>
        </v-col>
        <v-col
          v-if="selectedRubric !== null && selectedRubric !== 0"
          cols="12"
          lg="6"
        >
          <v-select label="Тип товару" variant="outlined" :items="rubricsTypesSelectItems" v-model="selectedRubricType"></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          cols="12"
          lg="3"
        >
          <v-select label="Статус" variant="outlined" :items="statusSelectItems" v-model="status"></v-select>
        </v-col>
        <v-col
          cols="12"
          lg="3"
        >
          <v-row>
            <label for="price_from" class="cursor-pointer ml-2">Ціна від:</label>
          </v-row>
          <v-row>
            <input type="number" class="input-number w-90 ml-2" id="price_from" v-model="priceFrom"/>
          </v-row>
        </v-col>
        <v-col
          cols="12"
          lg="3"
        >
          <v-row>
            <label for="price_to" class="cursor-pointer ml-2">Ціна до:</label>
          </v-row>
          <v-row>
            <input type="number" class="input-number w-90 ml-2" id="price_to" v-model="priceTo"/>
          </v-row>
        </v-col>
        <v-col cols="12" lg="3">
          <v-btn class="bg-yellow-accent-4" @click="getProductsByFilters">Застосувати</v-btn>
        </v-col>
      </v-row>
    </v-form>
    <Products :products="products" @delete-product="(productId) => deleteProduct(productId)" />
    <div
      ref="sentinel"
      class="observer"
    ></div>
  </div>
</template>
<script>
import Api from "@/lib/api.js";
import Products from "@/components/Products.vue";

export default {
  components: {Products},
  data() {
    return {
      products: [],
      loadMoreOptions: {
        take: 20,
        skip: 20
      },
      productsCount: 0,
      countAvailableProducts: 0,
      activeDeleteProductId: null,
      statusSelectItems: [
        { title: "Всі", value: "all" },
        { title: "Які є в наявності", value: "available" },
        { title: "Яких немає в наявності", value: "not_available" }
      ],
      rubricsSelectItems: [],
      rubricsTypesSelectItems: [],
      status: null,
      selectedRubric: null,
      selectedRubricType: null,
      priceFrom: 0,
      priceTo: 0,
      filtersApplied: false,
      activeDeleteProductName: ""
    }
  },
  methods: {
    deleteProduct(productId) {
      console.log(productId);
      Api.delete("/admin/products/" + productId);

      this.isDeleteProductDialogOpen = false;
      this.products = this.products.filter(product => product.id !== productId);
      this.loadMoreOptions.skip -= 1;
    },
    getProductsUrl(loadMore=false) {
      let url;

      if(!this.filtersApplied && !loadMore) return `/admin/products`;

      if(!this.filtersApplied && loadMore) {
        url = `/admin/products/load-more/?take=${this.loadMoreOptions.take}&skip=${this.loadMoreOptions.skip}&available=all`;
        this.loadMoreOptions.skip += 20;

        return url;
      }
      if(loadMore) {
        url = `/admin/products/load-more/?available=${this.status === null ? 'all' : this.status}`;
        url += `&take=${this.loadMoreOptions.take}`;
        url += `&skip=${this.loadMoreOptions.skip}`;

        this.loadMoreOptions.skip += 20;
      } else {
        url = `/admin/products/by-filters/?available=${this.status === null ? 'all' : this.status}`;
      }
      url += `&priceFrom=${this.priceFrom}`;
      url += `&priceTo=${this.priceTo}`;

      if(this.selectedRubric) {
        url += `&rubricId=${this.selectedRubric}`;
      }
      if(this.selectedRubricType) {
        url += `&rubricTypeNameId=${this.selectedRubricType}`;
      }

      return url;
    },
    async getProducts() {
      const data = (await Api.get(`/admin/products`)).data;

      this.products = data.products;
      this.productsCount = data.countProducts;
      this.priceTo = data.maxPrice;
      this.priceFrom = data.minPrice;
      this.countAvailableProducts = data.countAvailableProducts;
    },
    async getAllRubrics() {
      const data = (await Api.get("/rubrics")).data;

      this.rubricsSelectItems = data.map(rubric => ({ title: rubric.name, value: rubric.id }));
      this.rubricsSelectItems.unshift({ title: "Всі", value: 0 });
    },
    async loadMoreProducts() {
      const url = this.getProductsUrl(true);
      this.products.push(...(await Api.get(url)).data);
    },
    async getProductsByFilters() {
      this.filtersApplied = true;
      const url = this.getProductsUrl();
      this.products = (await Api.get(url)).data;

      this.loadMoreOptions.skip = 20;
    },
    async getRubricsTypesByRubric(rubricId) {
      const data = (await Api.get("/rubrics/rubrics-types/" + rubricId)).data;

      this.rubricsTypesSelectItems = data.map(rubric => ({ title: rubric.name, value: rubric.id }));
      this.rubricsTypesSelectItems.unshift({ title: "Всі", value: 0 });
    },
    createObserver() {
      const options = { threshold: 1.0 };
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.loadMoreProducts();
        }
      }, options);
      observer.observe(this.$refs.sentinel);
    },
  },
  async mounted() {
    await this.getProducts();
    await this.getAllRubrics();
    this.createObserver();
  },
  watch: {
    selectedRubric: function (val) {
      this.getRubricsTypesByRubric(val);
      this.selectedRubricType = 0;
    }
  }
}
</script>
<style>
.wrapper__products {
  width: 80%;
  display: block;
  margin: 0 auto;
}
</style>
