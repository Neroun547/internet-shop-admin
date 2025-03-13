<template>
  <div class="wrapper__upload-product mt-75px mb-5">
    <v-card class="pa-5">
      <v-form>
        <v-text-field label="Назва товару" v-model="productName" required :rules="productNameRules"/>
        <v-text-field label="Опис товару" v-model="productDescription"/>
        <label for="file">Картинки:</label>
        <input type="file" id="file" accept="image/png, image/jpeg, image/jpg" multiple class="cursor-pointer ml-2" @change="fileInputChange" required/>
        <v-carousel v-if="preloadImgSrc.length">
          <v-carousel-item v-for="img in preloadImgSrc" :src="img.src"/>
        </v-carousel>
        <v-row class="mt-5">
          <v-col>
            <label for="price_number" id="price_input" class="cursor-pointer">Ціна</label>
            <input type="number" id="price_input" class="input-number ml-2" min="1" v-model="productPrice" required>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select id="product_status" label="Статус" variant="outlined" :items="selectProductItems" v-model="productStatus" required :rules="productStatusRules"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-select label="Рубрика товару" variant="outlined" :items="selectProductRubricsItems" v-model="selectedRubric" required :rules="productRubricRules"></v-select>
          </v-col>
        </v-row>
        <v-row v-if="selectedRubric">
          <v-col>
            <v-select label="Тип товару" variant="outlined" :items="selectProductRubricsTypesItems" v-model="selectedRubricType" required :rules="productRubricTypesRules"></v-select>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <label for="number_input">Порядковий номер товару:</label>
            <input type="number" v-model="productNum" id="number_input" class="ml-2 input-number">
          </v-col>
        </v-row>
        <v-alert v-if="uploadedSuccessful" class="mt-5 bg-green text-center">Товар завантажено успішно</v-alert>
        <v-alert v-if="validationErrorMessage" class="mt-5 text-red text-center">{{validationErrorMessage}}</v-alert>
        <v-card-actions class="mt-5">
          <v-spacer></v-spacer>
          <v-btn class="bg-yellow-accent-4" @click="editProduct">Оновити товар</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </div>
</template>
<script>
import Api from "@/lib/api.js";
import {API_URL} from "@/constants.js";
import useUserStore from "../../stores/user.js";

export default {
  data() {
    return {
      selectProductItems: [
        { title: "Є в наявності", value: true },
        { title: "Немає в наявності", value: false }
      ],
      selectProductRubricsItems: [],
      selectProductRubricsTypesItems: [],
      selectedRubric: null,
      selectedRubricType: null,
      productStatus: true,
      productPrice: 1,
      preloadImgSrc: [],
      uploadedImg: null,
      productName: "",
      productDescription: "",
      productNum: 1,
      uploadedSuccessful: false,
      validationErrorMessage: "",
      firstRender: true,
      productNameRules: [
        value => {
          if (value) return true

          return "Назва товару обов'язкова."
        },
      ],
      productPriceRules: [
        value => {
          if (value) return true

          return "Ціна товару обов'язкова."
        },
      ],
      productRubricRules: [
        value => {
          if (value) return true

          return "Рубрика товару обов'язкова."
        },
      ],
      productRubricTypesRules: [
        value => {
          if (value) return true

          return "Тип товару обов'язковий."
        },
      ],
      productImageRules: [
        value => {
          if (value) return true

          return "Картинка товару обов'язкова."
        },
      ],
      productStatusRules: [
        value => {
          if (value || value === false) return true

          return "Статус товару обов'язковий."
        },
      ],
    }
  },
  methods: {
    async getProductById() {
      const data = (await Api.get("/products/" + this.$route.params.id)).data;

      this.productPrice = data.price;
      this.productName = data.name;
      this.productDescription = data.description;
      this.selectedRubric = data.rubric_id;
      this.selectedRubricType = data.type;
      this.productStatus = data.available;
      this.productNum = data.num;

      this.preloadImgSrc = data.images.map(img => ({ src: API_URL + "/images/" + img, file: null }));
    },
    fileInputChange(e) {
      const files = Array.from(e.target.files);

      this.preloadImgSrc = files.map(file => ({ src: URL.createObjectURL(file), file: file }));
    },
    async getAllRubrics() {
      this.selectProductRubricsItems = (await Api.get("/rubrics/")).data.map(rubric => ({ title: rubric.name, value: rubric.id }));
    },
    async getAllRubricsTypes() {
      this.selectProductRubricsTypesItems = (await Api.get("/rubrics/rubrics-types/" + this.selectedRubric)).data.map(type => ({ title: type.name, value: type.name }));
    },
    async editProduct() {
      this.validationErrorMessage = "";

      if(!this.productName) {
        this.validationErrorMessage = "Введіть назву товару і спробуйте ще раз";

        return;
      }
      if(!this.productPrice) {
        this.validationErrorMessage = "Введіть ціну товару і спробуйте ще раз";

        return;
      }
      if(!this.productStatus && this.productStatus !== false) {
        this.validationErrorMessage = "Вкажіть статус товару і спробуйте ще раз";

        return;
      }
      if(!this.selectedRubric) {
        this.validationErrorMessage = "Вкажіть рубрику товару і спробуйте ще раз";

        return;
      }
      if(!this.selectedRubricType) {
        this.validationErrorMessage = "Вкажіть рубрику товару і спробуйте ще раз";

        return;
      }
      this.uploadedSuccessful = false;

      const formData = new FormData();

      for(let i = 0; i < this.preloadImgSrc.length; i++) {
        formData.append("files", this.preloadImgSrc[i].file);
      }
      formData.append("name", this.productName);
      formData.append("description", this.productDescription);
      formData.append("price", this.productPrice);
      formData.append("type", this.selectedRubricType);
      formData.append("available", this.productStatus);
      formData.append("rubric_id", this.selectedRubric);
      formData.append("num", this.productNum);

      fetch(API_URL + "/api" + "/admin/products/" + this.$route.params.id, {
        method: "PATCH",
        headers: {
          authorization: localStorage.getItem("token"),
        },
        body: formData,

      }).then(() => {
        this.uploadedSuccessful = true;
      })
    }
  },
  mounted() {
    this.getAllRubrics();
    this.getProductById();
  },
  watch: {
    selectedRubric: function () {
      this.getAllRubricsTypes();

      if(this.firstRender){
        this.firstRender = false;

        return;
      }
      this.selectedRubricType = null;
    }
  }
}
</script>
<style scoped>
.wrapper__upload-product {
  max-width: 600px;
  width: 100%;
  display: block;
  margin: 0 auto;
}
</style>
