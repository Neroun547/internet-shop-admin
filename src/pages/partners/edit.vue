<template>
  <div class="wrapper__edit-partner">
    <v-form class="d-flex flex-column mt-150px">
      <v-text-field variant="outlined" v-model="partnerName" label="Ім'я партнера"/>
      <input type="password" class="input-default" placeholder="Новий пароль:" v-model="partnerPassword">
      <v-btn class="mt-2 bg-yellow-accent-4" @click="updatePartner">Зберегти зміни</v-btn>
    </v-form>
    <v-alert class="bg-green mt-2" v-if="saveSuccessfulMessage">
      {{saveSuccessfulMessage}}
    </v-alert>
    <v-alert class="bg-red mt-2" v-if="saveErrorMessage">
      {{saveErrorMessage}}
    </v-alert>
  </div>
</template>
<script>
import Api from "@/lib/api.js";

export default {
  data() {
    return {
      partnerName: "",
      partnerPassword: "",
      saveSuccessfulMessage: "",
      saveErrorMessage: ""
    }
  },
  methods: {
    async getPartner() {
      const data = (await Api.get("/admin/partners/" + this.$route.params.id)).data;

      this.partnerName = data.name;
    },
    async updatePartner() {
      this.saveErrorMessage = "";
      this.saveSuccessfulMessage = "";

      try {
        await Api.patch("/admin/partners/" + this.$route.params.id, {
          name: this.partnerName,
          password: this.partnerPassword
        });
        this.saveSuccessfulMessage = "Зміни збережено успішно";
      } catch {
        this.saveErrorMessage = "Помилка";
      }
    }
  },
  async mounted() {
    await this.getPartner();
  }
}
</script>
<style scoped>
  .wrapper__edit-partner {
    display: block;
    margin: 0 auto;
    width: 60%;
  }
</style>
