// Компонент с пустым фоном для логина и регистрации
<template>
  <!-- С чего начинаются страницы логина и регистрации в шаблонах html -->
  <div class="grey darken-1 empty-layout">
    <router-view></router-view>
  </div>
</template>

<script>
import messages from '@/utils/messages';

export default {
  computed: {
    error() {
      return this.$store.getters.error;
    }
  },
  watch: {
    error(fbError) {
      this.$error(messages[fbError.code] || 'Что-то пошло не так');
    }
  }
}
</script>