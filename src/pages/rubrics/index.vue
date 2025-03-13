<template>
  <v-dialog v-model="isDeleteRubricDialogOpen" max-width="600">
    <v-card>
      <v-card-title>Ви дійсно хочете видалити рубрику {{activeDeleteRubricName}} ?</v-card-title>
      <v-card-actions class="mt-5">
        <v-btn class="bg-yellow-accent-4" @click="isDeleteRubricDialogOpen = false;">Ні</v-btn>
        <v-spacer />
        <v-btn class="bg-red" @click="deleteRubric">Так</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="isCreateRubricDialogOpen" max-width="600">
    <v-card class="pa-3">
      <v-card-title>Створити нову рубрику</v-card-title>
      <div>
        <v-text-field label="Назва рубрики" v-model="newRubricName" variant="outlined"/>
        <v-btn @click="addTypeToRubric">Додати тип <v-icon icon="mdi-plus"></v-icon></v-btn>
        <div v-for="type in newRubricTypes" v-bind:key="type.id" class="mt-2">
          <v-text-field v-model="type.name" variant="outlined" label="Тип товару"/>
        </div>
      </div>
      <v-card-actions>
        <v-btn @click="isCreateRubricDialogOpen = false;">Закрити</v-btn>
        <v-spacer></v-spacer>
        <v-btn @click="saveRubric">Зберегти</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <div class="wrapper__rubrics">
    <h2 class="ml-5 mt-5 mb-5">Рубрики</h2>
    <v-btn class="ml-auto d-block mb-5 bg-yellow-accent-4" @click="isCreateRubricDialogOpen = true;">Додати рубрику <v-icon icon="mdi-plus" ></v-icon></v-btn>
    <v-list>
      <v-list-item v-for="rubric in rubrics" :key="rubric.id" class="mb-5">
        <v-card class="pa-2 bg-grey-lighten-4">
          <v-card-title class="text-wrap">{{rubric.name}}</v-card-title>
          <v-card-actions class="mt-5">
            <div class="bottom-actions">
              <v-btn class="bg-red d-block" v-if="!rubric.selected_default" @click="openDeleteRubricsDialog(rubric.id)">
                Видалити
              </v-btn>
              <v-spacer></v-spacer>
              <RouterLink :to="'/admin/rubrics/' + rubric.id" class="ml-auto d-block">
                <v-btn class="bg-yellow-accent-4">
                  Редагувати
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
</style>
