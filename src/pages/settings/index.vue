<template>
  <div class="wrapper__global-settings">
    <h2>Налаштування</h2>
    <div class="mt-5">
      <div class="d-flex">
        <label for="is-email-notification-enabled" class="mt-4"
          >Увімкнути сповіщення по пошті</label
        >
        <v-checkbox
          id="is-email-notification-enabled"
          v-model="globalSettings.isEmailNotificationEnabled"
        />
      </div>
      <div>
        <v-text-field
          label="Пошта для сповіщень"
          variant="outlined"
          v-model="globalSettings.email"
        />
      </div>
    </div>
    <v-btn
      class="bg-yellow-accent-4 ml-auto d-block"
      @click="saveGlobalSettings"
      >Зберегти</v-btn
    >
  </div>
</template>
<script setup>
import Api from "@/lib/api.js";

const globalSettings = ref({
  email: "",
  isEmailNotificationEnabled: false,
});

async function saveGlobalSettings() {
  await Api.put("/admin/settings/", {
    ...globalSettings.value,
  });

  loadData();
}

async function loadData() {
  const response = await Api.get("/admin/settings");

  globalSettings.value = response.data;
}

onMounted(() => {
  loadData();
});
</script>
<style scoped>
.wrapper__global-settings {
  width: 80%;
  margin: 0 auto;
  display: block;
}

.max-width-600px {
  max-width: 600px;
}
</style>
