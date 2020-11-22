<template>
    <div>
        <div class="page-title">
            <h3>Категории</h3>
        </div>
        <section>
            <Loader v-if="loading" />
            <div class="row" v-else>
                <CategoryCreate @created="addNewCategory" />

                <!-- Использую :key здесь, чтобы перерисовать компонент, так как categories.length будет меняться при добавлении, а updateCount при изменении -->
                <CategoryEdit :categories="categories" @updated="updateCategories" :key="categories.length + updateCount" v-if="categories.length" />
                <p v-else class="center">
                    Категорий пока нет
                </p>
            </div>
        </section>
    </div>
</template>

<script>
import CategoryCreate from '@/components/CategoryCreate';
import CategoryEdit from '@/components/CategoryEdit';

export default {
    metaInfo() {
        return {
            title: this.$title('Menu_Categories')
        };
    },
    data: () => ({
        categories: [],
        loading: true,
        updateCount: 0
    }),
    components: {
        CategoryCreate, CategoryEdit
    },
    async mounted() {
        this.categories = await this.$store.dispatch('fetchCategories');
        this.loading = false;
    },
    methods: {
        addNewCategory(category) {
            this.categories.push(category);
        },
        // Изменяем select динамически, чтобы менялся при обновлении
        updateCategories(category) {
            const idx = this.categories.findIndex(c => c.id === category.id);
            this.categories[idx].title = category.title;
            this.categories[idx].limit = category.limit;
            this.updateCount++;
        }
    }
}
</script>