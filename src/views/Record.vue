<template>
    <div>
        <div class="page-title">
            <h3>Новая запись</h3>
        </div>

        <Loader v-if="loading" />

        <!-- Если нет категорий -->
        <p class="center" v-else-if="!categories.length">Категорий пока нет. <router-link to="/categories">Добавить новую категорию.</router-link></p>

        <form v-else class="form" @submit.prevent="submitHandler">
            <div class="input-field" >
            <select ref="select" v-model="category">
                <option
                    v-for="c in categories"
                    :key="c.id"
                    :value="c.id"
                >
                    {{ c.title }}
                </option>
            </select>
            <label>Выберите категорию</label>
            </div>

            <p>
            <label>
                <input
                    class="with-gap"
                    name="type"
                    type="radio"
                    value="income"
                    v-model="type"
                />
                <span>Доход</span>
            </label>
            </p>

            <p>
            <label>
                <input
                    class="with-gap"
                    name="type"
                    type="radio"
                    value="outcome"
                    v-model="type"
                />
                <span>Расход</span>
            </label>
            </p>
            
            <div class="input-field">
            <input
                id="amount"
                type="number"
                v-model.number="amount"
                :class="{invalid: ($v.amount.$dirty && !$v.amount.minValue) || ($v.amount.$dirty && !$v.amount.required)}"
            >
            <label for="amount">Сумма</label>
            <span class="helper-text invalid" v-if="($v.amount.$dirty && !$v.amount.minValue) || ($v.amount.$dirty && !$v.amount.required)">Минимальное значение должно быть {{ $v.amount.$params.minValue.min }} или поле не заполнено</span>
            </div>

            <div class="input-field">
            <input
                id="description"
                type="text"
                v-model="description"
                :class="{invalid: $v.description.$dirty && !$v.description.required}"
            >
            <label for="description">Описание</label>
            <span v-if="$v.description.$dirty && !$v.description.required"
                    class="helper-text invalid">Обязательно введите описание</span>
            </div>

            <button class="btn waves-effect waves-light" type="submit">
            Создать
            <i class="material-icons right">send</i>
            </button>
        </form>
    </div>
</template>

<script>
import { required, minValue } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';

export default {
    metaInfo() {
        return {
            title: this.$title('Menu_NewRecord')
        };
    },
    data: () => ({
        loading: true,
        categories: [],
        select: null,
        category: null,
        type: 'outcome',
        amount: 100,
        description: ''
    }),
    validations: {
        amount: {required, minValue: minValue(100)},
        description: {required}
    },
    computed: {
        ...mapGetters(['info']),
        canCreateRecord() {
            if (this.type === 'income') {
                return true;
            }

            return this.info.bill >= this.amount;
        }
    },
    methods: {
        async submitHandler() {
            if (this.$v.$invalid) {
                this.$v.$touch();
                return;
            }

            if (this.canCreateRecord) {
                try {
                    await this.$store.dispatch('createRecord', {
                        categoryId: this.category,
                        amount: this.amount,
                        description: this.description,
                        type: this.type,
                        date: new Date().toJSON()
                    });
                    // Обновляем счет после того как потратили, либо заработали деньги
                    const bill = this.type === 'income' 
                        ? this.info.bill + this.amount
                        : this.info.bill - this.amount;

                    await this.$store.dispatch('updateInfo', {bill});
                    this.$message('Запись успешно добавлена');
                    this.amount = 100;
                    this.description = '';
                    this.$v.reset();
                } catch (e) {}
            } else {
                this.$message(`Недостаточно средств на счете (${this.amount - this.info.bill})`);
            }
        }
    },
    async mounted() {
        this.categories = await this.$store.dispatch('fetchCategories');
        this.loading = false;

        if (this.categories.length) {
            this.category = this.categories[0].id;
        }

        // Это нужно, потому что select добавляется раньше, чем форма в шаблон
        setTimeout(() => {
            M.updateTextFields();
            this.select = M.FormSelect.init(this.$refs.select);
        }, 0);
    },
    destroyed() {
        if (this.select && this.select.destroy) {
            this.select.destroy;
        }
    }
}
</script>