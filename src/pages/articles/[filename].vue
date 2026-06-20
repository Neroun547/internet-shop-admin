<template>
  <GoBack />
  <main class="wrapper__article-editor">
    <v-text-field
      variant="outlined"
      label="Назва статті"
      v-model="articleName"
    ></v-text-field>
    <v-text-field
      variant="outlined"
      label="Тема статті"
      v-model="articleTheme"
    ></v-text-field>
    <v-text-field
      variant="outlined"
      label="Автори статті"
      v-model="articleAuthors"
    ></v-text-field>
    <Editor
      api-key="fqqboid3jj5dviefd7qko96da2nnz3run5y6af5t891srayh"
      :init="{
        toolbar_mode: 'sliding',
        plugins:
          'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
        toolbar:
          'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
      }"
      v-model="articleData"
    />
    <v-alert class="bg-green mt-5" v-if="articleUploadedSuccessfulMessage">{{
      articleUploadedSuccessfulMessage
    }}</v-alert>
    <v-alert class="bg-red mt-5" v-if="articleUploadErrorMessage">{{
      articleUploadErrorMessage
    }}</v-alert>
    <v-btn class="bg-yellow-accent-4 mt-5 ml-auto d-block" @click="editArticle"
      >Оновити статтю</v-btn
    >
  </main>
</template>
<script setup>
import Editor from "@tinymce/tinymce-vue";
import Api from "@/lib/api.js";
import GoBack from "@/components/GoBack.vue";
import { useRoute } from "vue-router";

const route = useRoute();

const articleData = ref("");
const articleName = ref("");
const articleTheme = ref("");
const articleAuthors = ref("");

const articleUploadedSuccessfulMessage = ref("");
const articleUploadErrorMessage = ref("");

async function editArticle() {
  articleUploadedSuccessfulMessage.value = "";
  articleUploadErrorMessage.value = "";

  try {
    await Api.patch(`/admin/articles/edit/${route.params.filename}`, {
      name: articleName.value,
      theme: articleTheme.value,
      authors: articleAuthors.value,
      content: articleData.value,
    });

    articleUploadedSuccessfulMessage.value = "Статтю оновлено успішно";
  } catch {
    articleUploadErrorMessage.value = "Помилка";
  }
}

async function getArticle() {
  const data = (await Api.get(`/admin/articles/${route.params.filename}`)).data;

  articleData.value = data.content;
  articleTheme.value = data.theme;
  articleAuthors.value = data.authors;
  articleName.value = data.name;
}

onMounted(function () {
  getArticle();
});
</script>
<style scoped></style>
