<template>
  <GoBack />
  <div class="wrapper__card">
    <v-card>
      <v-card-title>Замовлення:</v-card-title>
      <v-list>
        <v-list-item v-for="product in products"
          >{{ product.name }} (кількість: {{ product.count }})</v-list-item
        >
      </v-list>
      <v-card-title>Клієнт:</v-card-title>
      <v-list>
        <v-list-item>Ім'я: {{ firstname }}</v-list-item>
        <v-list-item>Прізвище: {{ lastname }}</v-list-item>
        <v-list-item>Контактна інформація: {{ contactInfo }}</v-list-item>
        <v-list-item v-if="remark"
          >Примітка від клієнта: {{ remark }}</v-list-item
        >
      </v-list>
      <label for="remark_input" class="remark-label"
        ><strong>Примітка:</strong></label
      >
      <form class="remark-form" @submit="saveAdminNote">
        <v-row>
          <v-col cols="12" lg="6" md="12" sm="12" xs="12">
            <input id="remark_input" v-model="adminNote" class="d-block" />
          </v-col>
          <v-col cols="12" lg="6" md="12" sm="12" xs="12">
            <v-btn class="bg-yellow-accent-4 d-block" type="submit"
              >Зберегти</v-btn
            >
          </v-col>
        </v-row>
      </form>
      <v-card-title style="text-wrap: wrap"
        >Загальна сума замовлення: {{ sum }}</v-card-title
      >
      <v-card-text
        >Поточний статус замовлення:
        <span v-if="status === null" class="text-red">Не виконано</span>
        <span v-if="status === 'completed'" class="text-green">Виконано</span>
        <span v-if="status === 'in_process'" class="text-black">В процесі</span>
        <span v-if="status === 'returned'" class="text-black"
          >Повернено клієнтом</span
        >
      </v-card-text>
      <label for="select-status" class="ml-4"
        ><strong>Змінити статус замовлення:</strong></label
      >
      <v-row class="w-50 ml-5 mt-5">
        <v-select
          id="select-status"
          class="w-25 ml-4"
          :items="statusSelectItems"
          v-model="status"
          variant="outlined"
        ></v-select>
      </v-row>
      <v-card-subtitle class="pb-5 pt-5"
        >Дата замовлення: {{ created_at }}</v-card-subtitle
      >
    </v-card>
  </div>
</template>
<script setup>
import Api from "@/lib/api.js";
import GoBack from "@/components/GoBack.vue";
import { useRoute } from "vue-router";

const route = useRoute();

const products = ref([]);
const contactInfo = ref("");
const firstname = ref("");
const lastname = ref("");
const remark = ref("");
const adminNote = ref("");
const status = ref(null);
const sum = ref(0);
const created_at = ref("");

const statusSelectItems = [
  { title: "Не виконано", value: null },
  { title: "В процесі", value: "in_process" },
  { title: "Виконано", value: "completed" },
  { title: "Повернено клієнтом", value: "returned" },
];

async function saveAdminNote(e) {
  e.preventDefault();

  await Api.post(`/admin/orders/add-admin-note/${route.params.id}`, {
    note: adminNote.value,
  });
}

async function getOrder() {
  const data = (await Api.get(`/admin/orders/${route.params.id}`)).data;

  products.value = data.products;
  contactInfo.value = data.contact_info;
  firstname.value = data.first_name;
  lastname.value = data.last_name;
  sum.value = data.all_sum;
  adminNote.value = data.admin_note;
  status.value = data.status;
  remark.value = data.remark;

  if (data.created_at) {
    created_at.value = data.created_at;
  }
}

watch(status, async function (val) {
  if (val === null) {
    await Api.delete(`/admin/orders/status/${route.params.id}`);
  } else {
    await Api.patch(`/admin/orders/change-status/${route.params.id}`, {
      status: val,
    });
  }
});

onMounted(function () {
  getOrder();
});
</script>
<style scoped>
.remark-label {
  margin-left: 18px;
}
.wrapper__card {
  display: block;
  width: 50%;
  margin: 0 auto;
  margin-top: 25px;
  margin-bottom: 50px;
}
.remark-form {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  width: 95%;
  margin: 0 auto;
}
.remark-form input {
  height: 35px;
  width: 80%;
  border: 1px solid #000;
  outline: none;
  font-size: 14px;
}

@media screen and (max-width: 922px) {
  .wrapper__card {
    width: 95%;
  }
}
</style>
