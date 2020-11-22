<template>
    <div class="col s12 m6">
                <div>
                <div class="page-subtitle">
                    <h4>Редактировать</h4>
                </div>

                <form @submit.prevent="submitHandler">
                    <div class="input-field">
                    <select ref="select" v-model="current">
                        <option
                            v-for="cat in categories"
                            :key="cat.id"
                            :value="cat.id"
                        >   
                            {{ cat.title }}
                        </option>
                    </select>
                    <label>Выберите категорию</label>
                    </div>

                    <div class="input-field">
                    <input type="text" id="name" v-model="title" :class="{invalid: $v.title.$dirty && !$v.title.required}">
                    <label for="name">Название</label>
                    <span 
                        class="helper-text invalid"
                        v-if="$v.title.$dirty && !$v.title.required"
                    >
                        Введите название категории
                    </span>
                    </div>

                    <div class="input-field">
                    <input
                        id="limit"
                        type="number"
                        v-model="limit"
                        :class="{invalid: ($v.limit.$dirty && !$v.limit.minValue) || ($v.limit.$dirty && !$v.limit.required)}"
                    >
                    <label for="limit">Лимит</label>
                    <span 
                        class="helper-text invalid"
                        v-if="($v.limit.$dirty && !$v.limit.minValue) || ($v.limit.$dirty && !$v.limit.required)"
                    >
                        Минимальная величина {{ $v.limit.$params.minValue.min }} или поле не заполнено
                    </span>
                    </div>

                    <button class="btn waves-effect waves-light" type="submit">
                    Обновить
                    <i class="material-icons right">send</i>
                    </button>
                </form>
                </div>
            </div>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators';

export default {
    props: ['categories'],
    data: () => ({
        select: null,
        title: '',
        limit: '100',
        current: null
    }),
    validations: {
        title: {required},
        limit: {minValue: minValue(100), required}
    },
    // Динамически следим на изменениями, как только выбераем другую опцию, меняются данные в полях
    watch: {
        current(catId) {
            const {title, limit} = this.categories.find(c => c.id === catId);
            this.title = title;
            this.limit = limit;
        }
    },
    methods: {
        async submitHandler() {
            if (this.$v.$invalid) {
                this.$v.$touch();
                return;
            }

            try {
                const categoryData = {
                    id: this.current,
                    title: this.title,
                    limit: this.limit
                };
                await this.$store.dispatch('updateCategory', categoryData);
                this.$message(`Категория ${this.title} успешно обновлена`);
                this.$emit('updated', categoryData);
            } catch (e) {}
        }
    },
    created() {
        const {id, title, limit} = this.categories[0];
        this.current = id;
        this.title = title;
        this.limit = limit;
    },
    mounted() {
        M.updateTextFields();
        this.select = M.FormSelect.init(this.$refs.select);
    },
    // Чтобы не было утечек памяти
    destroyed() {
        if (this.select && this.select.destroy) {
            this.select.destroy;
        }
    }
}
</script>