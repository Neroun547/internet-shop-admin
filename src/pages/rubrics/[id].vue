<template>
  <GoBack />
  <div class="wrapper__edit-rubric">
    <h2 class="wrapper__edit-rubric-title">Редагувати рубрику</h2>
    <v-form @submit="editRubric" class="mt-5">
      <v-text-field
        v-model="rubricName"
        label="Назва рубрики"
        variant="outlined"
      ></v-text-field>
      <v-btn
        class="d-block ml-auto bg-yellow-accent-4 add-type-btn"
        @click="addRubricType"
        >Додати тип <v-icon icon="mdi-plus"
      /></v-btn>
      <label class="d-block products-types-label">Типи товарів:</label>
      <div
        class="mt-3 d-flex w-100 justify-space-between align-center"
        v-bind:key="type.id"
        v-for="type in rubricTypes"
      >
        <v-text-field
          v-model="type.name"
          label="Тип товару"
          variant="outlined"
        ></v-text-field>
        <button
          class="ml-3 delete-product-type-btn"
          @click="deleteRubricType(type.id)"
        >
          <v-icon icon="mdi-delete" />
        </button>
      </div>
      <v-btn
        type="submit"
        class="bg-yellow-accent-4 ml-auto d-block mt-5 save-changes-btn"
        >Зберегти</v-btn
      >

      <v-alert v-if="saveSuccessfulMessage" class="bg-green mt-3">{{
        saveSuccessfulMessage
      }}</v-alert>
      <v-alert v-if="saveErrorMessage" class="bg-red mt-3">{{
        saveErrorMessage
      }}</v-alert>
    </v-form>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import Api from "@/lib/api.js";
import GoBack from "@/components/GoBack.vue";

const route = useRoute();

const rubricName = ref("");
const rubricTypes = ref([]);
const saveSuccessfulMessage = ref("");
const saveErrorMessage = ref("");

function addRubricType() {
  rubricTypes.value.unshift({
    id: 0,
    name: "Новий тип",
  });
}

async function getRubricsTypes() {
  const rubric = (await Api.get(`/admin/rubrics/${route.params.id}`)).data;

  rubricName.value = rubric.name;

  rubricTypes.value = (
    await Api.get(`/admin/rubrics/${route.params.id}/rubric-types/`)
  ).data;
}

function deleteRubricType(typeId) {
  rubricTypes.value = rubricTypes.value.filter((type) => type.id !== typeId);
}

async function editRubric(e) {
  e.preventDefault();

  saveSuccessfulMessage.value = "";
  saveErrorMessage.value = "";

  try {
    await Api.patch("/admin/rubrics/", {
      id: Number(route.params.id),
      rubricTypes: rubricTypes.value.map((type) => type.name),
      name: rubricName.value,
    });

    saveSuccessfulMessage.value = "Зміни збережено успішно";
  } catch {
    saveErrorMessage.value = "Помилка";
  }
}

onMounted(function () {
  getRubricsTypes();
});
</script>
<style scoped>
.wrapper__edit-rubric {
  width: 60%;
  display: block;
  margin: 0 auto;
  margin-top: 50px;
}
.wrapper__edit-rubric-title {
  margin-bottom: 40px;
}
.products-types-label {
  display: block;
  margin-top: 30px;
  margin-bottom: 30px;
}
.delete-product-type-btn {
  background-color: transparent;
  color: #f44336;
}
@media screen and (max-width: 750px) {
  .wrapper__edit-rubric {
    width: 90%;
  }
  .wrapper__edit-rubric-title {
    font-size: 18px;
  }
  .save-changes-btn {
    font-size: 11px;
  }
  .add-type-btn {
    font-size: 11px;
  }
}
</style>
