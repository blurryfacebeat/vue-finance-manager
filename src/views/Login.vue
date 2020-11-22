<template>
    <form class="card auth-card" @submit.prevent="submitHandler">
        <div class="card-content">
            <span class="card-title">Домашняя бухгалтерия</span>
            <div class="input-field">
            <!-- $dirty - компонент был потроган -->
            <input
                id="email"
                type="text"
                v-model.trim="email"
                :class="{invalid: ($v.email.$dirty && !$v.email.required) || ($v.email.$dirty && !$v.email.email)}"
            >
            <label for="email">Email</label>
            <!-- Выводим нужную ошибку при валидации -->
            <small class="helper-text invalid" v-if="$v.email.$dirty && !$v.email.required">Поле email не должно быть пустым</small>
            <small class="helper-text invalid" v-else-if="$v.email.$dirty && !$v.email.email">Поле email должно быть в правильном формате</small>
            </div>
            <div class="input-field">
            <input
                id="password"
                type="password"
                v-model.trim="password"
                :class="{invalid: ($v.password.$dirty && !$v.password.required) || ($v.password.$dirty && !$v.password.minLength)}"
            >
            <label for="password">Пароль</label>
            <small v-if="$v.password.$dirty && !$v.password.required" class="helper-text invalid">Поле пароль не должно быть пустым</small>
            <small v-else-if="$v.password.$dirty && !$v.password.minLength" class="helper-text invalid">Пароль должен содержать минимум {{ $v.password.$params.minLength.min }} символов. Сейчас он {{ password.length }}</small>
            </div>
        </div>
        <div class="card-action">
            <div>
            <button
                class="btn waves-effect waves-light auth-submit"
                type="submit"
            >
                Войти
                <i class="material-icons right">send</i>
            </button>
            </div>

            <p class="center">
            Нет аккаунта?
            <router-link to="/registration">Зарегистрироваться</router-link>
            </p>
        </div>
    </form>
</template>

<script>
import { email, required, minLength } from 'vuelidate/lib/validators';
import messages from '@/utils/messages';

export default {
    name: 'login',
    metaInfo() {
        return {
            title: this.$title('Login')
        };
    },
    data() {
        return {
            email: '',
            password: ''
        }
    },
    validations: {
        email: {email, required},
        password: {required, minLength: minLength(8)}
    },
    mounted() {
        // Если в объекте сообщений есть ключ с подходящим названием, которое используется в query компоненте
        if (messages[this.$route.query.message]) {
            this.$message(messages[this.$route.query.message]);
        }
    },
    methods: {
        async submitHandler() {
            // Валидация будет срабатывать только при отправке формы
            // Если вся форма находится в инвалидном состоянии, то:
            if (this.$v.$invalid) {
                // Вызывает валидацию
                this.$v.$touch();
                return;
            }
            const formData = {
                email: this.email,
                password: this.password
            };

            try {
                // $store отвечает за работу с vuex; 1 - action, который диспатчим, 2 - нужный объект
                await this.$store.dispatch('login', formData);
                // Если успешно залогинились, перешли на главную страницу
                this.$router.push('/');
            } catch (e) {}
        }
    }
}
</script>