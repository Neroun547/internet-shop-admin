<template>
  <v-dialog v-model="isAddPartnerDialogOpen" max-width="600">
    <v-card class="pa-5">
      <v-card-title>Додати партнера</v-card-title>
      <v-text-field variant="outlined" label="Ім'я" v-model="newPartnerName"></v-text-field>
      <input type="password" placeholder="Пароль" class="input-default" required v-model="newPartnerPassword">
      <v-card-actions class="mt-5">
        <v-btn class="bg-red create-partner-modal-close-btn" @click="isAddPartnerDialogOpen = false;">
          Закрити
        </v-btn>
        <v-spacer/>
        <v-btn class="bg-yellow-accent-4 create-partner-modal-save-btn" @click="savePartner">
          Зберегти
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isDeletePartnerDialogOpen" max-width="600">
    <v-card>
      <v-card-title class="delete-partner-modal-title text-wrap">Ви дійсно хочете видалити партнера {{activeDeletePartnerName}} ?</v-card-title>
      <v-card-actions class="mt-5">
        <v-btn class="bg-yellow-accent-4 delete-partner-modal-action-btn" @click="isDeletePartnerDialogOpen = false;">Ні</v-btn>
        <v-spacer></v-spacer>
        <v-btn class="bg-red delete-partner-modal-action-btn" @click="deletePartner">Так</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div class="wrapper__partners">
    <h2>Партнери</h2>
    <v-btn class="d-block ml-auto mt-5 bg-yellow-accent-4 add-partner-btn mb-5" @click="isAddPartnerDialogOpen = true">Додати партнера <v-icon icon="mdi-plus"></v-icon></v-btn>
    <v-list>
      <v-list-item v-for="partner in partners" class="mt-5" v-bind:key="partner.id">
        <v-card class="bg-grey-lighten-4">
          <v-card-title class="text-wrap d-block">
            <div class="d-flex w-100 justify-space-between">
              <div class="partner-name">{{partner.name}}</div>
              <RouterLink :to="'/admin/partners/edit/' + partner.id">
                <v-icon icon="mdi-pencil" class="edit-partner-icon"></v-icon>
              </RouterLink>
            </div>
          </v-card-title>
          <v-card-actions class="mt-50px mb-2">
            <div class="d-flex justify-space-between w-100">
              <button class="delete-partner-btn mt-5" @click="openDeletePartnerDialog(partner.id, partner.name)">
                <v-icon icon="mdi-delete"></v-icon>
              </button>
              <v-spacer></v-spacer>
              <RouterLink :to="'/admin/partners/info/' + partner.id" class="text-yellow-accent-4 mt-5 info-link">
                Інформація <v-icon icon="mdi-chevron-right" class="info-icon"></v-icon>
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
  .info-icon {
    font-size: 20px;
  }
  .delete-partner-btn {
    background-color: transparent;
    color: #F44336;
  }
  .edit-partner-icon {
    font-size: 22px;
  }
  @media screen and (max-width: 750px) {
    .create-partner-modal-save-btn {
      font-size: 11px;
    }
    .create-partner-modal-close-btn {
      font-size: 11px;
    }
    .edit-partner-icon {
      font-size: 18px;
    }
    .wrapper__partners {
      width: 90%;
    }
    .delete-partner-btn {
      font-size: 14px !important;
    }
    .partner-name {
      font-size: 15px;
    }
    .info-icon {
      font-size: 15px;
    }
    .info-link {
      font-size: 12px;
    }
    .add-partner-btn {
      font-size: 12px;
    }
    .delete-partner-modal-action-btn {
      font-size: 11px;
    }
    .delete-partner-modal-title {
      font-size: 14px;
    }
  }
</style>
