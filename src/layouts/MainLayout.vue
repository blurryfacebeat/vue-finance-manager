<template>
    <div>
      <Loader v-if="loading" />
      <div v-else class="app-main-layout">

        <NavBar @click="isOpen = !isOpen" />

        <SideBar v-model="isOpen" :key="locale" />

        <main class="app-content" :class="{full: !isOpen}">
          <div class="app-page">
            <!-- Сюда рендерим нужную страницу -->
            <router-view></router-view>
          </div>
        </main>

        <div class="fixed-action-btn">
          <router-link class="btn-floating btn-large blue" to="/record" v-tooltip="'Создать новую запись'">
            <i class="large material-icons">add</i>
          </router-link>
        </div>
      </div>
    </div>

</template>

<script>
import NavBar from '@/components/app/NavBar';
import SideBar from '@/components/app/SideBar';
import messages from '@/utils/messages';

export default {
  name: 'main-layout',
  data() {
    return {
      // Открыт ли сайд бар
      isOpen: true,
      // Добавляем loading здесь, чтобы валюта при перезагрузке страницы не писала "не число", до загрузки с сервера
      loading: true
    }
  },
  async mounted() {
    // Если данных о пользователе нет, то делаем запрос
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch('fetchInfo');
    }

    this.loading = false;
  },
  components: {
    NavBar,
    SideBar
  },
  computed: {
    error() {
      return this.$store.getters.error;
    },
    locale() {
      return this.$store.getters.info.locale;
    }
  },
  watch: {
    error(fbError) {
      this.$error(messages[fbError.code] || 'Что-то пошло не так');
    }
  }
}
</script>