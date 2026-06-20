<template>
  <div class="wrapper__articles">
    <h2 class="ml-5 d-block articles-logo">Статті</h2>
    <RouterLink to="/admin/articles/add-article">
      <v-btn class="ml-auto mb-5 d-block bg-yellow-accent-4 add-article-btn"
        >Додати статтю <v-icon icon="mdi-plus"></v-icon
      ></v-btn>
    </RouterLink>
    <div class="mt-5" v-if="!articles.length">
      <h2 class="text-center no-data-text">Статей поки що немає ...</h2>
    </div>
    <v-list>
      <v-list-item v-for="article in articles" v-bind:key="article.id">
        <v-card class="bg-grey-lighten-4">
          <v-card-title class="article-name text-wrap"
            >Назва:{{ article.name }}</v-card-title
          >
          <v-card-title class="article-date text-wrap"
            >Дата:{{ article.created_at }}</v-card-title
          >
          <v-card-title class="articles-authors text-wrap"
            >Автори: {{ article.authors }}</v-card-title
          >
          <v-card-actions class="mt-10">
            <div class="d-flex justify-space-between w-100">
              <v-icon
                icon="mdi-delete"
                class="text-red"
                @click="deleteArticleByFilename(article.filename)"
              ></v-icon>
              <v-spacer></v-spacer>
              <RouterLink :to="'/admin/articles/' + article.filename">
                <v-icon icon="mdi-pencil"></v-icon>
              </RouterLink>
            </div>
          </v-card-actions>
        </v-card>
      </v-list-item>
    </v-list>
    <div ref="sentinel" class="observer"></div>
  </div>
</template>
<script setup>
import Api from "@/lib/api.js";

const articles = ref([]);

const loadMoreOptions = ref({
  take: 20,
  skip: 20,
});

const sentinel = ref(null);

async function getArticles() {
  articles.value = (
    await Api.get(`/articles/?take=${loadMoreOptions.value.take}&skip=0`)
  ).data;
}

async function loadMoreArticles() {
  articles.value.push(
    ...(
      await Api.get(
        `/articles/?take=${loadMoreOptions.value.take}&skip=${loadMoreOptions.value.skip}`,
      )
    ).data,
  );

  loadMoreOptions.value.skip += 20;
}

async function deleteArticleByFilename(filename) {
  await Api.delete(`/admin/articles/${filename}`);

  loadMoreOptions.value.skip -= 1;

  articles.value = articles.value.filter(function (article) {
    return article.filename !== filename;
  });
}

function createObserver() {
  const options = { threshold: 1.0 };

  const observer = new IntersectionObserver(function (entries) {
    if (entries[0].isIntersecting) {
      loadMoreArticles();
    }
  }, options);

  observer.observe(sentinel.value);
}

onMounted(async function () {
  await getArticles();
  createObserver();
});
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
  .articles-authors {
    font-size: 14px;
  }
}
</style>
