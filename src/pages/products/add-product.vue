<template>
  <GoBack />
  <div class="wrapper__upload-product mt-75px">
    <v-card class="pa-5">
      <v-form>
        <v-text-field
          label="Назва товару"
          v-model="productName"
          variant="outlined"
          required
          :rules="productNameRules"
        />
        <v-text-field
          label="Опис товару"
          v-model="productDescription"
          variant="outlined"
        />
        <label for="file">Картинки:</label>
        <input
          type="file"
          id="file"
          accept="image/png, image/jpeg, image/jpg"
          multiple
          class="cursor-pointer ml-2"
          @change="fileInputChange"
          required
        />
        <v-carousel v-if="preloadImgSrc.length">
          <v-carousel-item v-for="img in preloadImgSrc" :src="img.src" />
        </v-carousel>
        <v-row class="mt-5">
          <v-col>
            <label for="price_number" id="price_input" class="cursor-pointer"
              >Ціна</label
            >
            <input
              type="number"
              id="price_input"
              class="input-number ml-2"
              min="1"
              v-model="productPrice"
              required
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
              id="product_status"
              label="Статус"
              variant="outlined"
              :items="selectProductItems"
              v-model="productStatus"
              required
              :rules="productStatusRules"
            ></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select
              label="Рубрика товару"
              variant="outlined"
              :items="selectProductRubricsItems"
              v-model="selectedRubric"
              required
              :rules="productRubricRules"
            ></v-select>
          </v-col>
        </v-row>
        <v-row v-if="selectedRubric">
          <v-col>
            <v-select
              label="Тип товару"
              variant="outlined"
              :items="selectProductRubricsTypesItems"
              v-model="selectedRubricType"
              required
              :rules="productRubricTypesRules"
            ></v-select>
          </v-col>
        </v-row>
        <v-alert v-if="uploadedSuccessful" class="mt-5 bg-green text-center"
          >Товар завантажено успішно</v-alert
        >
        <v-alert
          v-if="validationErrorMessage"
          class="mt-5 text-red text-center"
          >{{ validationErrorMessage }}</v-alert
        >
        <v-card-actions class="mt-5">
          <v-spacer></v-spacer>
          <v-btn class="bg-yellow-accent-4" @click="uploadProduct"
            >Завантажити товар</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>
<script setup>
import Api from "@/lib/api.js";
import { API_URL } from "@/constants.js";
import GoBack from "@/components/GoBack.vue";

const selectProductItems = [
  { title: "Є в наявності", value: true },
  { title: "Немає в наявності", value: false },
];

const selectProductRubricsItems = ref([]);
const selectProductRubricsTypesItems = ref([]);

const selectedRubric = ref(null);
const selectedRubricType = ref(null);
const productStatus = ref(true);
const productPrice = ref(1);
const preloadImgSrc = ref([]);
const productName = ref("");
const productDescription = ref("");
const uploadedSuccessful = ref(false);
const validationErrorMessage = ref("");

const productNameRules = [
  function (value) {
    if (value) return true;

    return "Назва товару обов'язкова.";
  },
];

const productRubricRules = [
  function (value) {
    if (value) return true;

    return "Рубрика товару обов'язкова.";
  },
];

const productRubricTypesRules = [
  function (value) {
    if (value) return true;

    return "Тип товару обов'язковий.";
  },
];

const productStatusRules = [
  function (value) {
    if (value || value === false) return true;

    return "Статус товару обов'язковий.";
  },
];

function fileInputChange(e) {
  const files = Array.from(e.target.files);

  preloadImgSrc.value = files.map(function (file) {
    return {
      src: URL.createObjectURL(file),
      file: file,
    };
  });
}

async function getAllRubrics() {
  selectProductRubricsItems.value = (await Api.get("/rubrics/")).data.map(
    function (rubric) {
      return {
        title: rubric.name,
        value: rubric.id,
      };
    },
  );
}

async function getAllRubricsTypes() {
  selectProductRubricsTypesItems.value = (
    await Api.get(`/rubrics/rubrics-types/${selectedRubric.value}`)
  ).data.map(function (type) {
    return {
      title: type.name,
      value: type.name,
    };
  });
}

async function uploadProduct() {
  uploadedSuccessful.value = false;
  validationErrorMessage.value = "";

  if (!productName.value) {
    validationErrorMessage.value = "Введіть назву товару і спробуйте ще раз";

    return;
  }

  if (!productPrice.value) {
    validationErrorMessage.value = "Введіть ціну товару і спробуйте ще раз";

    return;
  }

  if (!productStatus.value && productStatus.value !== false) {
    validationErrorMessage.value = "Вкажіть статус товару і спробуйте ще раз";

    return;
  }

  if (!selectedRubric.value) {
    validationErrorMessage.value = "Вкажіть рубрику товару і спробуйте ще раз";

    return;
  }

  if (!selectedRubricType.value) {
    validationErrorMessage.value = "Вкажіть рубрику товару і спробуйте ще раз";

    return;
  }

  const formData = new FormData();

  for (let i = 0; i < preloadImgSrc.value.length; i++) {
    formData.append("files", preloadImgSrc.value[i].file);
  }

  formData.append("name", productName.value);
  formData.append("description", productDescription.value);
  formData.append("price", productPrice.value);
  formData.append("type", selectedRubricType.value);
  formData.append("available", String(Boolean(productStatus.value)));
  formData.append("rubric_id", selectedRubric.value);

  const api = await fetch(`${API_URL}/api/admin/products`, {
    method: "POST",
    headers: {
      authorization: localStorage.getItem("token"),
    },
    body: formData,
  });
  if (!api.ok) {
    const response = await api.json();

    uploadedSuccessful.value = false;
    validationErrorMessage.value = response.message;
  } else {
    uploadedSuccessful.value = true;
  }
}

watch(selectedRubric, function () {
  getAllRubricsTypes();

  selectedRubricType.value = null;
});

onMounted(function () {
  getAllRubrics();
});
</script>
<style scoped>
.wrapper__upload-product {
  max-width: 600px;
  width: 100%;
  display: block;
  margin: 0 auto;
}
</style>
