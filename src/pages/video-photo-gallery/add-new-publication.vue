<template>
  <GoBack />
  <div class="wrapper__add-new-publication">
    <h2 class="mb-2 add-new-publication-logo">Додати нову публікацію</h2>
    <v-card class="pa-5">
      <v-form @submit="savePublication">
        <v-carousel v-if="files.length">
          <v-carousel-item v-for="file in files" v-bind:key="file.id">
            <v-img :src="file.src" v-if="file.type.includes('image')" />
            <video
              v-if="file.type.includes('video')"
              controls
              preload="metadata"
              style="height: 300px"
            >
              <source :src="file.src" />
            </video>
          </v-carousel-item>
        </v-carousel>
        <input
          type="file"
          multiple
          accept="image/png, image/jpeg, image/jpg, video/mp4"
          id="file"
          @change="changeFile"
        />
        <v-text-field
          label="Назва публікації"
          variant="outlined"
          class="mt-2"
          v-model="publicationName"
        />
        <v-text-field
          label="Тема"
          variant="outlined"
          v-model="publicationTheme"
        />
        <v-text-field
          label="Опис"
          variant="outlined"
          v-model="publicationDescription"
        />

        <v-btn class="d-block ml-auto bg-yellow-accent-4" type="submit"
          >Зберегти</v-btn
        >

        <v-alert v-if="uploadedSuccessfulMessage" class="bg-green mt-2">{{
          uploadedSuccessfulMessage
        }}</v-alert>
        <v-alert v-if="uploadedErrorMessage" class="bg-red mt-2">{{
          uploadedErrorMessage
        }}</v-alert>
      </v-form>
    </v-card>
  </div>
</template>
<script setup>
import { API_URL } from "@/constants.js";
import GoBack from "@/components/GoBack.vue";

const publicationName = ref("");
const publicationTheme = ref("");
const publicationDescription = ref("");

const uploadedSuccessfulMessage = ref("");
const uploadedErrorMessage = ref("");

const files = ref([]);

async function savePublication(e) {
  e.preventDefault();

  uploadedSuccessfulMessage.value = "";
  uploadedErrorMessage.value = "";

  const formData = new FormData();

  for (let i = 0; i < files.value.length; i++) {
    formData.append("files", files.value[i].file);
  }

  formData.append("name", publicationName.value);
  formData.append("theme", publicationTheme.value);
  formData.append("description", publicationDescription.value);

  fetch(`${API_URL}/api/admin/video-photo-gallery/`, {
    method: "POST",
    headers: {
      authorization: localStorage.getItem("token"),
    },
    body: formData,
  })
    .then(function (response) {
      if (response.ok) {
        uploadedSuccessfulMessage.value = "Завантажено успішно";
      } else {
        uploadedErrorMessage.value = "Помилка";
      }
    })
    .catch(function () {
      uploadedErrorMessage.value = "Помилка";
    });
}

function changeFile(e) {
  const data = Array.from(e.target.files);

  files.value = data.map(function (item) {
    return {
      src: URL.createObjectURL(item),
      file: item,
      type: item.type,
      id: Date.now(),
    };
  });
}
</script>
<style scoped>
.wrapper__add-new-publication {
  display: block;
  margin: 0 auto;
  max-width: 600px;
  width: 100%;
  margin-top: 50px;
}
img {
  background-size: contain !important;
  background-repeat: no-repeat !important;
}
@media screen and (max-width: 750px) {
  .add-new-publication-logo {
    font-size: 18px;
    text-align: center;
  }
}
</style>
