<template>
  <div class="wrapper__settings">
    <h2 class="mt-5"><v-icon icon="mdi-cog"></v-icon> Налаштування</h2>
    <v-row class="mt-5">
      <v-col
        lg="12"
      >
        <v-text-field variant="outlined" label="Пошта для сповіщень про замовлення" v-model="localSettings['system.admin.' + store.getId + '.notification_email']"></v-text-field>
      </v-col>
    </v-row>
    <v-btn class="bg-yellow-accent-4 ml-auto d-block" @click="saveSettings">Зберегти</v-btn>
  </div>
</template>
<script setup>
  import useUserStore from "@/stores/user.js";

  const store = useUserStore();
</script>
<script>
import Api from "@/lib/api.js";

export default {
  data() {
    return {
      settings: {},
      localSettings: {}
    }
  },
  methods: {
    async getSettings() {
      this.settings = (await Api.get("/admin/settings/admin")).data;

      for(let key in this.settings) {
        this.localSettings[key] = this.settings[key].value;
      }
    },
    async saveSettings() {
      const parsedSettings = {};

      for(let key in this.localSettings) {
        parsedSettings[key] = {
          id: this.settings[key] ? this.settings[key].id : null,
          key: key,
          value: this.localSettings[key],
        }
      }
      await Api.post("/admin/settings/admin", parsedSettings);
    }
  },
  mounted() {
    this.getSettings();
  }
}
</script>
<style scoped>
  .wrapper__settings {
    width: 80%;
    margin: 0 auto;
  }
</style>
