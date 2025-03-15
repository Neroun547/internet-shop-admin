<template>
  <GoBack />
  <main class="wrapper__article-editor">
    <v-text-field variant="outlined" label="Назва статті" v-model="articleName"></v-text-field>
    <v-text-field variant="outlined" label="Тема статті" v-model="articleTheme"></v-text-field>
    <v-text-field variant="outlined" label="Автори статті" v-model="articleAuthors"></v-text-field>
    <Editor
      api-key="fqqboid3jj5dviefd7qko96da2nnz3run5y6af5t891srayh"
      :init="{
        toolbar_mode: 'sliding',
        plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
      }"
      v-model="articleData"
    />
    <v-alert class="bg-green mt-5" v-if="articleUploadedSuccessfulMessage">{{articleUploadedSuccessfulMessage}}</v-alert>
    <v-alert class="bg-red mt-5" v-if="articleUploadErrorMessage">{{articleUploadErrorMessage}}</v-alert>
    <v-btn class="bg-yellow-accent-4 mt-5 ml-auto d-block" @click="editArticle">Оновити статтю</v-btn>
  </main>
</template>
<script>
import Editor from "@tinymce/tinymce-vue";
import Api from "@/lib/api.js";
import GoBack from "@/components/GoBack.vue";

export default {
  components: {GoBack, Editor},
  data() {
    return {
      articleData: "",
      articleName: "",
      articleTheme: "",
      articleAuthors: "",
      articleUploadedSuccessfulMessage: "",
      articleUploadErrorMessage: ""
    }
  },
  methods: {
    async editArticle() {
      this.articleUploadedSuccessfulMessage = "";
      this.articleUploadErrorMessage = "";

      try {
        await Api.patch("/admin/articles/edit/" + this.$route.params.filename, {
          name: this.articleName,
          theme: this.articleTheme,
          authors: this.articleAuthors,
          content: this.articleData
        });
        this.articleUploadedSuccessfulMessage = "Статтю оновлено успішно";
      } catch {
        this.articleUploadErrorMessage = "Помилка";
      }
    }
  },
  async mounted() {
    const data = (await Api.get("/admin/articles/" + this.$route.params.filename)).data;

    this.articleData = data.content;
    this.articleTheme = data.theme;
    this.articleAuthors = data.authors;
    this.articleName = data.name;
  }
}
</script>
<style scoped>

</style>
