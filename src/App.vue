<template>
  <div id="app">
    <!-- component формирует из общего нужный нам компонент -->
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import EmptyLayout from '@/layouts/EmptyLayout';
import MainLayout from '@/layouts/MainLayout';

export default {
  computed: {
    // Указываем, какой компонент будет рендерить
    // Берется название свойства layout из route, empty по дефолту, если нет другого
    layout() {
      return (this.$route.meta.layout || 'empty') + '-layout';
    }
  },
  components: {
    EmptyLayout,
    MainLayout
  }
}
</script>

<style lang="scss">
@import '~materialize-css/dist/css/materialize.min.css';
@import 'assets/index.css';
</style>
