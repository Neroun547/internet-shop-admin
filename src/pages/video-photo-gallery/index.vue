<template>
  <div class="wrapper__video-photo-gallery">
    <RouterLink :to="'/admin/video-photo-gallery/add-new-publication'">
      <v-btn class="bg-yellow-accent-4 d-block ml-auto gallery-add-publication-btn">Додати відео або фото <v-icon icon="mdi-plus"></v-icon></v-btn>
    </RouterLink>
    <h2 class="mt-5 gallery-logo">Галерея</h2>
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
          <video v-if="item.previewFileVideo" controls preload="metadata">
            <source :src="api_url + '/gallery/' + item.previewFile">
          </video>
          <v-img :src="api_url + '/gallery/' + item.previewFile" v-if="!item.previewFileVideo"/>

          <v-card-title>{{ item.name }}</v-card-title>
          <v-card-subtitle>{{ item.theme }}</v-card-subtitle>

          <v-card-actions class="mt-5">
            <v-icon icon="mdi-delete" @click="deletePublicationById(item.id)" class="text-red"></v-icon>
            <v-spacer></v-spacer>
            <RouterLink :to="'/admin/video-photo-gallery/' + item.id">
              <v-btn class="bg-yellow-accent-4 gallery-edit-btn">Редагувати</v-btn>
            </RouterLink>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <div
      ref="sentinel"
      class="observer"
    ></div>
  </div>
</template>
<script>
import Api from "@/lib/api.js";
import {API_URL} from "@/constants.js";

export default {
  data() {
    return {
      videoPhoto: [],
      loadMoreOptions: {
        take: 12,
        skip: 12
      }
    }
  },
  async mounted() {
    await this.getVideoPhoto();
    this.createObserver();
  },
  methods: {
    async deletePublicationById(id) {
      await Api.delete("/admin/video-photo-gallery/" + id);

      this.videoPhoto = this.videoPhoto.filter(publication => publication.id !== id);
      this.loadMoreOptions.skip -= 1;
    },
    async getVideoPhoto() {
      this.videoPhoto = (await Api.get("/video-photo-gallery/")).data;
    },
    async loadMorePublication() {
      this.videoPhoto.push(...(await Api.get(`/video-photo-gallery/load-more/?take=${this.loadMoreOptions.take}&skip=${this.loadMoreOptions.skip}`)).data);

      this.loadMoreOptions.skip += 12;
    },
    createObserver() {
      const options = { threshold: 1.0 };
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.loadMorePublication();
        }
      }, options);
      observer.observe(this.$refs.sentinel);
    },
  },
  computed: {
    api_url: {
      get() {
        return API_URL;
      }
    }
  },
}
</script>
<style scoped>
  .wrapper__video-photo-gallery {
    display: block;
    margin: 0 auto;
    margin-top: 50px;
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
