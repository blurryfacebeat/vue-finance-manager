import _ from 'lodash';

export default {
    data() {
        return {
            // Дефолтная страница
            page: +this.$route.query.page || 1,
            pageSize: 3,
            pageCount: 0,
            allItems: [],
            // Только те данные, которые нужно показывать
            items: []
        };
    },
    methods: {
        pageChangeHandler(page) {
            // Добавляем квери параметры
            this.$router.push(`${this.$route.path}?page=${page}`);
            this.items = this.allItems[page - 1] || this.allItems[0];
        },
        setupPagination(allItems) {
            this.allItems = _.chunk(allItems, this.pageSize);
            this.pageCount = _.size(this.allItems);
            this.items = this.allItems[this.page - 1] || this.allItems[0];
        }
    }
}