<template>
  <v-dialog v-model="isDeleteRubricDialogOpen" max-width="600">
    <v-card>
      <v-card-title class="create-rubric-modal-title">Ви дійсно хочете видалити рубрику {{activeDeleteRubricName}} ?</v-card-title>
      <v-card-actions class="mt-5">
        <v-btn class="bg-yellow-accent-4 create-rubric-modal-actions-btn" @click="isDeleteRubricDialogOpen = false;">Ні</v-btn>
        <v-spacer />
        <v-btn class="bg-red create-rubric-modal-actions-btn" @click="deleteRubric">Так</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isCreateRubricDialogOpen" max-width="600">
    <v-card class="pa-3">
      <v-card-title class="create-rubric-modal-title">Створити нову рубрику</v-card-title>
      <div class="mt-2">
        <v-text-field label="Назва рубрики" v-model="newRubricName" variant="outlined"/>
        <v-btn @click="addTypeToRubric" class="mt-5 mb-5 create-rubric-add-type-btn">Додати тип <v-icon icon="mdi-plus"></v-icon></v-btn>
        <div v-for="(type, index) in newRubricTypes" v-bind:key="type.id" class="mt-2 d-flex justify-space-between align-center">
          <v-text-field v-model="type.name" variant="outlined" label="Тип товару" class="create-rubric-modal-type-input"/>
          <v-icon icon="mdi-delete" class="ml-5" @click="newRubricTypes = newRubricTypes.filter((el, elIndex) => elIndex !== index)"></v-icon>
        </div>
      </div>
      <v-card-actions class="mt-5">
        <v-btn @click="isCreateRubricDialogOpen = false;" class="bg-red create-rubric-modal-actions-btn">Закрити</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="saveRubric" class="bg-yellow-accent-4 create-rubric-modal-actions-btn">Зберегти</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div class="wrapper__rubrics">
    <h2 class="ml-5 mt-5 mb-5">Рубрики</h2>
    <v-btn class="ml-auto d-block mb-5 bg-yellow-accent-4 add-rubric-btn" @click="isCreateRubricDialogOpen = true;">Додати рубрику <v-icon icon="mdi-plus" ></v-icon></v-btn>
    <v-list>
      <v-list-item v-for="rubric in rubrics" :key="rubric.id" class="mb-5">
        <v-card class="pa-2 bg-grey-lighten-4">
          <v-card-title class="text-wrap rubric-title">{{rubric.name}}</v-card-title>
          <v-card-actions class="mt-5">
            <div class="d-flex justify-space-between w-100">
              <button class="d-block delete-rubric-btn mt-5" v-if="!rubric.selected_default" @click="openDeleteRubricsDialog(rubric.id)">
                <v-icon icon="mdi-delete" class="delete-rubric-btn-icon"></v-icon>
              </button>
              <v-spacer></v-spacer>
              <RouterLink :to="'/admin/rubrics/' + rubric.id" class="ml-auto d-block mt-5">
                <v-icon icon="mdi-pencil" class="edit-link-icon"></v-icon>
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
      rubrics: [],
      isDeleteRubricDialogOpen: false,
      activeDeleteRubricId: null,
      activeDeleteRubricName: "",
      isCreateRubricDialogOpen: false,
      newRubricName: "",
      newRubricTypes: []
    }
  },
  methods: {
    addTypeToRubric() {
      this.newRubricTypes.push({ id: Date.now(), name: "" });
    },
    async getRubrics() {
      this.rubrics = (await Api.get("/rubrics")).data;
    },
    openDeleteRubricsDialog(rubricId, rubricName) {
      this.isDeleteRubricDialogOpen = true;
      this.activeDeleteRubricId = rubricId;
      this.activeDeleteRubricName = rubricName;
    },
    deleteRubric() {
      Api.delete("/admin/rubrics/" + this.activeDeleteRubricId);

      this.rubrics = this.rubrics.filter(rubric => rubric.id !== this.activeDeleteRubricId);
      this.isDeleteRubricDialogOpen = false;
    },
    async saveRubric() {
      await Api.post("/admin/rubrics/", {
        name: this.newRubricName,
        types: this.newRubricTypes.map(type => type.name)
      });

      await this.getRubrics();

      this.newRubricName = "";
      this.newRubricTypes = [];
      this.isCreateRubricDialogOpen = false;
    }
  },
  async mounted() {
    await this.getRubrics();
  }
}
</script>
<style scoped>
  .wrapper__rubrics {
    width: 60%;
    display: block;
    margin: 0 auto;
  }
  .delete-rubric-btn {
    background-color: transparent;
    border: none;
    color: #F44336;
  }
  @media screen and (max-width: 750px) {
    .add-rubric-btn {
      font-size: 12px;
    }
    .wrapper__rubrics {
      width: 90%;
    }
    .rubric-title {
      font-size: 16px;
    }
    .delete-rubric-btn-icon {
      font-size: 18px !important;
    }
    .edit-link-icon {
      font-size: 18px;
    }
    .create-rubric-modal-actions-btn {
      font-size: 11px;
    }
    .create-rubric-modal-title {
      font-size: 14px;
    }
    .create-rubric-add-type-btn {
      font-size: 12px;
    }
  }
</style>
