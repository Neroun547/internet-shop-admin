<template>
  <div class="wrapper__articles mt-50px">
    <h2 class="ml-5 mb-5 d-block articles-logo">Статті</h2>
    <RouterLink to="/admin/articles/add-article">
      <v-btn class="ml-auto mb-5 d-block bg-yellow-accent-4 add-article-btn">Додати статтю <v-icon icon="mdi-plus"></v-icon></v-btn>
    </RouterLink>
    <v-list>
      <v-list-item v-for="article in articles" v-bind:key="article.id">
        <v-card class="bg-grey-lighten-4">
          <v-card-title class="article-name text-wrap">Назва:{{ article.name }}</v-card-title>
          <v-card-title class="article-date text-wrap">Дата:{{ article.created_at }}</v-card-title>
          <v-card-actions class="mt-10">
            <div class="d-flex justify-space-between w-100">
              <v-icon icon="mdi-delete" class="text-red" @click="deleteArticleByFilename(article.filename)"></v-icon>
              <v-spacer></v-spacer>
              <RouterLink :to="'/admin/articles/' + article.filename">
                <v-icon icon="mdi-pencil"></v-icon>
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

  @media screen and (max-width: 750px) {
    .articles-logo {
      font-size: 18px;
    }
    .add-article-btn {
      font-size: 12px;
    }
    .article-name {
      font-size: 16px;
    }
    .article-date {
      font-size: 16px;
    }
  }
</style>
