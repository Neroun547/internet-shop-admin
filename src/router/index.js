/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'

// Pages
import Orders from "../pages/orders/index.vue";
import Order from "../pages/orders/[id].vue";
import Auth from "@/pages/auth.vue";
import Products from "@/pages/products/index.vue";
import AddProduct from "@/pages/products/add-product.vue";
import EditProduct from "@/pages/products/[id].vue";
import Rubrics from "@/pages/rubrics/index.vue";
import EditRubric from "@/pages/rubrics/[id].vue";
import Partners from "@/pages/partners/index.vue";
import EditPartner from "@/pages/partners/edit.vue";
import InfoPartner from "@/pages/partners/info.vue";
import Articles from "@/pages/articles/index.vue";
import AddArticle from "@/pages/articles/add-article.vue";
import EditArticle from "@/pages/articles/[filename].vue";
import VideoPhotoGallery from "@/pages/video-photo-gallery/index.vue";
import AddNewPublication from "@/pages/video-photo-gallery/add-new-publication.vue";
import VideoPhotoGalleryItem from "@/pages/video-photo-gallery/[id].vue";
import Settings from "@/pages/settings/index.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/admin/orders",
      name: "orders",
      component: Orders
    },
    {
      path: "/admin/auth",
      name: "auth",
      component: Auth
    },
    {
      path: "/admin/orders/:id",
      name: "orders-by-id",
      component: Order
    },
    {
      path: "/admin/products",
      name: "products",
      component: Products
    },
    {
      path: "/admin/products/add-product",
      name: "add-product",
      component: AddProduct
    },
    {
      path: "/admin/products/:id",
      name: "edit-product",
      component: EditProduct
    },
    {
      path: "/admin/rubrics/",
      name: "rubrics",
      component: Rubrics
    },
    {
      path: "/admin/rubrics/:id",
      name: "edit-rubric",
      component: EditRubric
    },
    {
      path: "/admin/partners",
      name: "partners",
      component: Partners
    },
    {
      path: "/admin/partners/edit/:id",
      name: "edit-partner",
      component: EditPartner
    },
    {
      path: "/admin/partners/info/:id",
      name: "info-partner",
      component: InfoPartner
    },
    {
      path: "/admin/articles/",
      name: "articles",
      component: Articles
    },
    {
      path: "/admin/articles/add-article",
      name: "add-article",
      component: AddArticle
    },
    {
      path: "/admin/articles/:filename",
      name: "edit-article",
      component: EditArticle
    },
    {
      path: "/admin/video-photo-gallery",
      name: "video-photo-gallery",
      component: VideoPhotoGallery
    },
    {
      path: "/admin/video-photo-gallery/add-new-publication",
      name: "add-new-publication",
      component: AddNewPublication
    },
    {
      path: "/admin/video-photo-gallery/:id",
      name: "edit-video",
      component: VideoPhotoGalleryItem
    },
    {
      path: "/admin/settings",
      name: "settings",
      component: Settings
    }
  ],
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
