<template>
  <div class="wrapper__video-photo-gallery">
    <h2 class="gallery-logo">Галерея</h2>
    <RouterLink :to="'/admin/video-photo-gallery/add-new-publication'">
      <v-btn
        class="bg-yellow-accent-4 d-block ml-auto gallery-add-publication-btn"
        >Додати відео або фото <v-icon icon="mdi-plus"></v-icon
      ></v-btn>
    </RouterLink>
    <div v-if="!videoPhoto.length" class="mt-5">
      <h2 class="text-center no-data-text">Відео та фото поки що немає ...</h2>
    </div>
    <v-row class="mt-5">
      <v-col
        v-for="item in videoPhoto"
        v-bind:key="item.id"
        cols="12"
        lg="3"
        md="6"
        sm="12"
      >
        <v-card class="card-publication">
          <video
            v-if="item.previewFileVideo"
            controls
            preload="metadata"
            :type="item.mimeType"
            style="max-width: 300px"
          >
            <source :src="API_URL + '/gallery/' + item.previewFile" />
          </video>
          <v-img
            :src="API_URL + '/gallery/' + item.previewFile"
            v-if="!item.previewFileVideo"
          />

          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-subtitle>{{ item.theme }}</v-card-subtitle>

          <v-card-actions class="mt-5">
            <v-icon
              icon="mdi-delete"
              @click="deletePublicationById(item.id)"
              class="text-red"
            ></v-icon>
            <v-spacer></v-spacer>
            <RouterLink :to="'/admin/video-photo-gallery/' + item.id">
              <v-btn class="bg-yellow-accent-4 gallery-edit-btn"
                >Редагувати</v-btn
              >
            </RouterLink>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <div ref="sentinel" class="observer"></div>
  </div>
</template>
<script setup>
import Api from "@/lib/api.js";
import { API_URL } from "@/constants.js";

const videoPhoto = ref([]);

const loadMoreOptions = ref({
  take: 12,
  skip: 12,
});

const sentinel = ref(null);

async function deletePublicationById(id) {
  await Api.delete(`/admin/video-photo-gallery/${id}`);

  videoPhoto.value = videoPhoto.value.filter(function (publication) {
    return publication.id !== id;
  });

  loadMoreOptions.value.skip -= 1;
}

async function getVideoPhoto() {
  videoPhoto.value = (await Api.get("/video-photo-gallery/")).data;
}

async function loadMorePublication() {
  videoPhoto.value.push(
    ...(
      await Api.get(
        `/video-photo-gallery/load-more/?take=${loadMoreOptions.value.take}&skip=${loadMoreOptions.value.skip}`,
      )
    ).data,
  );

  loadMoreOptions.value.skip += 12;
}

function createObserver() {
  const options = { threshold: 1.0 };

  const observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      loadMorePublication();
    }
  }, options);

  observer.observe(sentinel.value);
}

onMounted(async function () {
  await getVideoPhoto();
  createObserver();
});
</script>
<style scoped>
.wrapper__video-photo-gallery {
  display: block;
  margin: 0 auto;
  width: 80%;
}
.card-publication img {
  max-width: 300px;
  width: 100%;
}
.card-publication video {
  max-width: 300px;
  max-height: 300px;
  width: 100%;
}
@media screen and (max-width: 750px) {
  .gallery-add-publication-btn {
    font-size: 12px;
  }
  .gallery-logo {
    font-size: 18px;
  }
  .gallery-edit-btn {
    font-size: 12px;
  }
}
</style>
