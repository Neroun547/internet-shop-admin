<template>
  <div class="wrapper__products">
    <h2>Всі товари</h2>
    <RouterLink to="/admin/products/add-product">
      <v-btn class="d-block ml-auto bg-yellow-accent-4"
        >Додати товар <v-icon icon="mdi-plus"></v-icon
      ></v-btn>
    </RouterLink>
    <h3>Кількість товарів: {{ productsCount }}</h3>
    <h3>Кількість товарів які є в наявності: {{ countAvailableProducts }}</h3>
    <h3 class="mt-5">Фільтри:</h3>
    <v-form class="mt-5">
      <v-row>
        <v-col cols="12" lg="6">
          <v-select
            label="Рубрика товару"
            variant="outlined"
            :items="rubricsSelectItems"
            v-model="selectedRubric"
          ></v-select>
        </v-col>
        <v-col
          v-if="selectedRubric !== null && selectedRubric !== 0"
          cols="12"
          lg="6"
        >
          <v-select
            label="Тип товару"
            variant="outlined"
            :items="rubricsTypesSelectItems"
            v-model="selectedRubricType"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" lg="3">
          <v-select
            label="Статус"
            variant="outlined"
            :items="statusSelectItems"
            v-model="status"
          ></v-select>
        </v-col>
        <v-col cols="12" lg="3">
          <v-row>
            <label for="price_from" class="cursor-pointer ml-2"
              >Ціна від:</label
            >
          </v-row>
          <v-row>
            <input
              type="number"
              class="input-number w-90 ml-2"
              id="price_from"
              v-model="priceFrom"
            />
          </v-row>
        </v-col>
        <v-col cols="12" lg="3">
          <v-row>
            <label for="price_to" class="cursor-pointer ml-2">Ціна до:</label>
          </v-row>
          <v-row>
            <input
              type="number"
              class="input-number w-90 ml-2"
              id="price_to"
              v-model="priceTo"
            />
          </v-row>
        </v-col>
        <v-col cols="12" lg="3">
          <v-btn class="bg-yellow-accent-4" @click="getProductsByFilters"
            >Застосувати</v-btn
          >
        </v-col>
      </v-row>
    </v-form>
    <Products
      :products="products"
      @delete-product="(productId) => deleteProduct(productId)"
    />
    <div ref="sentinel" class="observer"></div>
  </div>
</template>
<script setup>
import Api from "@/lib/api.js";
import Products from "@/components/Products.vue";

const products = ref([]);

const loadMoreOptions = ref({
  take: 20,
  skip: 20,
});

const productsCount = ref(0);
const countAvailableProducts = ref(0);

const statusSelectItems = [
  { title: "Всі", value: "all" },
  { title: "Які є в наявності", value: "available" },
  { title: "Яких немає в наявності", value: "not_available" },
];

const rubricsSelectItems = ref([]);
const rubricsTypesSelectItems = ref([]);

const status = ref(null);
const selectedRubric = ref(null);
const selectedRubricType = ref(null);
const priceFrom = ref(0);
const priceTo = ref(0);
const filtersApplied = ref(false);

const sentinel = ref(null);

function deleteProduct(productId) {
  Api.delete(`/admin/products/${productId}`);

  products.value = products.value.filter(function (product) {
    return product.id !== productId;
  });

  loadMoreOptions.value.skip -= 1;
}

function getProductsUrl(loadMore = false) {
  let url;

  if (!filtersApplied.value && !loadMore) return "/admin/products";

  if (!filtersApplied.value && loadMore) {
    url = `/admin/products/load-more/?take=${loadMoreOptions.value.take}&skip=${loadMoreOptions.value.skip}&available=all`;
    loadMoreOptions.value.skip += 20;

    return url;
  }

  if (loadMore) {
    url = `/admin/products/load-more/?available=${status.value === null ? "all" : status.value}`;
    url += `&take=${loadMoreOptions.value.take}`;
    url += `&skip=${loadMoreOptions.value.skip}`;

    loadMoreOptions.value.skip += 20;
  } else {
    url = `/admin/products/by-filters/?available=${status.value === null ? "all" : status.value}`;
  }

  url += `&priceFrom=${priceFrom.value}`;
  url += `&priceTo=${priceTo.value}`;

  if (selectedRubric.value) {
    url += `&rubricId=${selectedRubric.value}`;
  }

  if (selectedRubricType.value) {
    url += `&rubricTypeNameId=${selectedRubricType.value}`;
  }

  return url;
}

async function getProducts() {
  const data = (await Api.get("/admin/products")).data;

  products.value = data.products;
  productsCount.value = data.countProducts;
  priceTo.value = data.maxPrice;
  priceFrom.value = data.minPrice;
  countAvailableProducts.value = data.countAvailableProducts;
}

async function getAllRubrics() {
  const data = (await Api.get("/rubrics")).data;

  rubricsSelectItems.value = data.map(function (rubric) {
    return {
      title: rubric.name,
      value: rubric.id,
    };
  });

  rubricsSelectItems.value.unshift({
    title: "Всі",
    value: 0,
  });
}

async function loadMoreProducts() {
  const url = getProductsUrl(true);

  products.value.push(...(await Api.get(url)).data);
}

async function getProductsByFilters() {
  filtersApplied.value = true;

  const url = getProductsUrl();

  products.value = (await Api.get(url)).data;

  loadMoreOptions.value.skip = 20;
}

async function getRubricsTypesByRubric(rubricId) {
  const data = (await Api.get(`/rubrics/rubrics-types/${rubricId}`)).data;

  rubricsTypesSelectItems.value = data.map(function (rubric) {
    return {
      title: rubric.name,
      value: rubric.id,
    };
  });

  rubricsTypesSelectItems.value.unshift({
    title: "Всі",
    value: 0,
  });
}

function createObserver() {
  const options = { threshold: 1.0 };

  const observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      loadMoreProducts();
    }
  }, options);

  observer.observe(sentinel.value);
}

watch(selectedRubric, function (val) {
  getRubricsTypesByRubric(val);
  selectedRubricType.value = 0;
});

onMounted(async function () {
  await getProducts();
  await getAllRubrics();
  createObserver();
});
</script>
<style scoped>
.wrapper__products {
  width: 80%;
  display: block;
  margin: 0 auto;
}
</style>
