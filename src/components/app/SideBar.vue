<template>
    <ul class="sidenav app-sidenav" :class="{open: value}">
      <!-- Можем задать любой тег для элемента через tag="", active-class, если route совпадает с ссылкой -->
      <router-link 
        v-for="link of links"
        :key="link.url"
        tag="li"
        active-class="active"
        :to="link.url"
        :exact="link.exact"
      >
        <a href="#" class="waves-effect waves-orange pointer">{{ link.title }}</a>
      </router-link>
    </ul>
</template>

<script>
import localizeFilter from '@/filters/localize.filter';

export default {
  props: ['value'],
  data() {
    return {
      links: [
        {title: localizeFilter('Menu_Bill'), url: '/', exact: true},
        {title: localizeFilter('Menu_History'), url: '/history'},
        {title: localizeFilter('Menu_Planing'), url: '/planning'},
        {title: localizeFilter('Menu_NewRecord'), url: 'record'},
        {title: localizeFilter('Menu_Categories'), url: '/categories'}
      ]
    }
  }
}
</script>