<template>
  <GoBack go-back-url="/admin/partners/" />
  <div class="wrapper__edit-partner">
    <v-form class="d-flex flex-column mt-150px">
      <v-text-field
        variant="outlined"
        v-model="partnerName"
        label="Ім'я партнера"
      />
      <input
        type="password"
        class="input-default"
        placeholder="Новий пароль:"
        v-model="partnerPassword"
      />
      <v-btn class="mt-2 bg-yellow-accent-4" @click="updatePartner"
        >Зберегти зміни</v-btn
      >
    </v-form>
    <v-alert class="bg-green mt-2" v-if="saveSuccessfulMessage">
      {{ saveSuccessfulMessage }}
    </v-alert>
    <v-alert class="bg-red mt-2" v-if="saveErrorMessage">
      {{ saveErrorMessage }}
    </v-alert>
  </div>
</template>
<script setup>
import Api from "@/lib/api.js";
import GoBack from "@/components/GoBack.vue";
import { useRoute } from "vue-router";

const route = useRoute();

const partnerName = ref("");
const partnerPassword = ref("");

const saveSuccessfulMessage = ref("");
const saveErrorMessage = ref("");

async function getPartner() {
  const data = (await Api.get(`/admin/partners/${route.params.id}`)).data;

  partnerName.value = data.name;
}

async function updatePartner() {
  saveErrorMessage.value = "";
  saveSuccessfulMessage.value = "";

  try {
    await Api.patch(`/admin/partners/${route.params.id}`, {
      name: partnerName.value,
      password: partnerPassword.value,
    });

    saveSuccessfulMessage.value = "Зміни збережено успішно";
  } catch {
    saveErrorMessage.value = "Помилка";
  }
}

onMounted(async function () {
  await getPartner();
});
</script>
<style scoped>
.wrapper__edit-partner {
  display: block;
  margin: 0 auto;
  width: 60%;
}

@media screen and (max-width: 800px) {
  .wrapper__edit-partner {
    width: 80%;
  }
}
</style>
