<template>
  <v-dialog v-model="isAddPartnerDialogOpen" max-width="600">
    <v-card class="pa-5">
      <v-card-title>Додати партнера</v-card-title>
      <v-text-field variant="outlined" label="Ім'я" v-model="newPartnerName"></v-text-field>
      <input type="password" placeholder="Пароль" class="input-default" required v-model="newPartnerPassword">
      <v-card-actions class="mt-5">
        <v-btn class="bg-red" @click="isAddPartnerDialogOpen = false;">
          Закрити
        </v-btn>
        <v-spacer/>
        <v-btn class="bg-yellow-accent-4" @click="savePartner">
          Зберегти
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isDeletePartnerDialogOpen" max-width="600">
    <v-card>
      <v-card-title>Ви дійсно хочете видалити партнера {{activeDeletePartnerName}} ?</v-card-title>
      <v-card-actions class="mt-5">
        <v-btn class="bg-yellow-accent-4" @click="isDeletePartnerDialogOpen = false;">Ні</v-btn>
        <v-spacer></v-spacer>
        <v-btn class="bg-red" @click="deletePartner">Так</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div class="wrapper__partners">
    <v-btn class="d-block ml-auto mt-5 bg-yellow-accent-4" @click="isAddPartnerDialogOpen = true">Додати партнера <v-icon icon="mdi-plus"></v-icon></v-btn>
    <v-list>
      <v-list-item v-for="partner in partners" class="mt-5">
        <v-card class="bg-grey-lighten-4">
          <v-card-title class="text-wrap d-block">
            <div class="bottom-actions">
              <span>{{partner.name}}</span>
              <RouterLink :to="'/admin/partners/edit/' + partner.id">
                <v-btn class="ml-auto d-block"><v-icon icon="mdi-pencil"></v-icon></v-btn>
              </RouterLink>
            </div>
          </v-card-title>
          <v-card-actions class="mt-50px mb-2">
            <div class="bottom-actions">
              <v-btn class="bg-red ml-2 mt-2" @click="openDeletePartnerDialog(partner.id, partner.name)">
                Видалити
              </v-btn>
              <v-spacer></v-spacer>
              <RouterLink :to="'/admin/partners/info/' + partner.id">
                <v-btn class="bg-yellow-accent-4 mr-2 mt-2 ml-2">
                  Інформація
                </v-btn>
              </RouterLink>
            </div>
          </v-card-actions>
        </v-card>
      </v-list-item>
    </v-list>
  </div>
</template>
<script>
import Api from "@/lib/api.js";

export default {
  data() {
    return {
      partners: [],
      isAddPartnerDialogOpen: false,
      newPartnerName: "",
      newPartnerPassword: "",
      isDeletePartnerDialogOpen: false,
      activeDeletePartnerId: null,
      activeDeletePartnerName: ""
    }
  },
  methods: {
    async getPartners() {
      this.partners = (await Api.get("/admin/partners")).data;
    },
    async savePartner() {
      await Api.post("/admin/partners/", {
        name: this.newPartnerName,
        password: this.newPartnerPassword
      });
      await this.getPartners();

      this.newPartnerName = "";
      this.newPartnerPassword = "";
      this.isAddPartnerDialogOpen = false;
    },
    openDeletePartnerDialog(partnerId, partnerName) {
      this.activeDeletePartnerId = partnerId;

      this.isDeletePartnerDialogOpen = true;
      this.activeDeletePartnerName = partnerName;
    },
    async deletePartner() {
      await Api.delete("/admin/partners/" + this.activeDeletePartnerId);

      await this.getPartners();

      this.activeDeletePartnerName = "";
      this.activeDeletePartnerId = null;
      this.isDeletePartnerDialogOpen = false;
    }
  },
  mounted() {
    this.getPartners();
  }
}
</script>
<style scoped>
  .wrapper__partners {
    display: block;
    margin: 0 auto;
    width: 60%;
  }
</style>
