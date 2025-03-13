<template>
  <div class="wrapper__edit-rubric">
    <h2>Редагувати рубрику</h2>
    <v-form @submit="editRubric" class="mt-5">
      <v-text-field v-model="rubricName" label="Назва рубрики" variant="outlined"></v-text-field>
      <v-btn class="d-block ml-auto bg-yellow-accent-4" @click="addRubricType">Додати тип <v-icon icon="mdi-plus"/></v-btn>
      <label class="mb-3 d-block">Типи товарів:</label>
      <v-row
        class="mt-3"
        v-bind:key="type.id" v-for="type in rubricTypes"
      >
        <v-text-field v-model="type.name" label="Тип товару" variant="outlined"></v-text-field>
        <v-btn class="bg-red ml-1" @click="deleteRubricType(type.id)"><v-icon icon="mdi-delete"/></v-btn>
      </v-row>
      <v-btn type="submit" class="bg-yellow-accent-4 ml-auto d-block mt-5">Зберегти</v-btn>

      <v-alert v-if="saveSuccessfulMessage" class="bg-green mt-3">{{saveSuccessfulMessage}}</v-alert>
      <v-alert v-if="saveErrorMessage" class="bg-red mt-3">{{saveErrorMessage}}</v-alert>
    </v-form>
  </div>
</template>
<script>
  import Api from "@/lib/api.js";

  export default {
    data() {
      return {
        rubricName: "",
        rubricTypes: [],
        saveSuccessfulMessage: "",
        saveErrorMessage: ""
      }
    },
    methods: {
      addRubricType() {
        this.rubricTypes.unshift({
          id: 0,
          name: "Новий тип"
        });
      },
      async getRubricsTypes() {
        const rubric = (await Api.get(`/admin/rubrics/${this.$route.params.id}`)).data;

        this.rubricName = rubric.name;
        this.rubricTypes = (await Api.get(`/admin/rubrics/${this.$route.params.id}/rubric-types/`)).data;
      },
      deleteRubricType(typeId) {
        this.rubricTypes = this.rubricTypes.filter(type => type.id !== typeId);
      },
      async editRubric(e) {
        e.preventDefault();

        this.saveSuccessfulMessage = "";
        this.saveErrorMessage = "";

        try {
          await Api.patch("/admin/rubrics/", {
            id: Number(this.$route.params.id),
            rubricTypes: this.rubricTypes.map(type => type.name),
            name: this.rubricName
          });

          this.saveSuccessfulMessage = "Зміни збережено успішно";
        } catch {
          this.saveErrorMessage = "Помилка";
        }
      }
    },
    mounted() {
      this.getRubricsTypes();
    }
  }
</script>
<style scoped>
  .wrapper__edit-rubric {
    width: 60%;
    display: block;
    margin: 0 auto;
    margin-top: 100px;
  }
</style>
