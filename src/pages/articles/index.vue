<template>
  <div class="wrapper__articles mt-50px">
    <h2 class="ml-5 d-block">Статті</h2>
    <RouterLink to="/admin/articles/add-article">
      <v-btn class="ml-auto mb-5 d-block bg-yellow-accent-4">Додати статтю <v-icon icon="mdi-plus"></v-icon></v-btn>
    </RouterLink>
    <v-list>
      <v-list-item v-for="article in articles" v-bind:key="article.id">
        <v-card class="bg-grey-lighten-4">
          <v-card-title>Назва:{{ article.name }}</v-card-title>
          <v-card-title>Дата:{{ article.created_at }}</v-card-title>
          <v-card-actions class="mt-5">
            <div class="bottom-actions">
              <v-btn class="bg-red" @click="deleteArticleByFilename(article.filename)"><v-icon icon="mdi-delete"></v-icon></v-btn>
              <v-spacer></v-spacer>
              <RouterLink :to="'/admin/articles/' + article.filename">
                <v-btn class="bg-yellow-accent-4">Редагувати</v-btn>
              </RouterLink>
            </div>
          </v-card-actions>
        </v-card>
      </v-list-item>
    </v-list>
    <div
      ref="sentinel"
      class="observer"
    ></div>
  </div>
</template>
<script>
import Api from "@/lib/api.js";

export default {
  data() {
    return {
      articles: [],
      loadMoreOptions: {
        take: 20,
        skip: 20
      }
    }
  },
  methods: {
    async getArticles() {
      this.articles = (await Api.get(`/articles/?take=${this.loadMoreOptions.take}&skip=0`)).data;
    },
    async loadMoreArticles() {
      this.articles.push(...(await Api.get(`/articles/?take=${this.loadMoreOptions.take}&skip=${this.loadMoreOptions.skip}`)).data)

      this.loadMoreOptions.skip += 20;
    },
    async deleteArticleByFilename(filename) {
      await Api.delete(`/admin/articles/${filename}`);
      this.loadMoreOptions.skip -= 1;

      this.articles = this.articles.filter(article => article.filename !== filename);
    },
    createObserver() {
      const options = { threshold: 1.0 };
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          this.loadMoreArticles();
        }
      }, options);
      observer.observe(this.$refs.sentinel);
    },
  },
  async mounted() {
    await this.getArticles();
    this.createObserver();
  }
}
</script>
<style scoped>
  .wrapper__articles {
    display: block;
    width: 80%;
    margin: 0 auto;
  }
</style>
