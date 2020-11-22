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
            <div class="input-field">
            <input
                id="name"
                type="text"
                v-model.trim="name"
                :class="{invalid: $v.name.$dirty && !$v.name.required}"
            >
            <label for="name">Имя</label>
            <small v-if="$v.name.$dirty && !$v.name.required" class="helper-text invalid">Поле имени не должно быть пустым</small>
            </div>
            <p>
            <label>
                <input type="checkbox" v-model="agree" />
                <span>С правилами согласен</span>
            </label>
            </p>
        </div>
        <div class="card-action">
            <div>
            <button
                class="btn waves-effect waves-light auth-submit"
                type="submit"
            >
                Зарегистрироваться
                <i class="material-icons right">send</i>
            </button>
            </div>

            <p class="center">
            Уже есть аккаунт?
            <router-link to="/login">Войти!</router-link>
            </p>
        </div>
    </form>
</template>

<script>
import { email, required, minLength } from 'vuelidate/lib/validators';

export default {
    name: 'registration',
    metaInfo() {
        return {
            title: this.$title('Registration')
        };
    },
    data() {
        return {
            email: '',
            password: '',
            name: '',
            agree: false
        }
    },
    validations: {
        email: {email, required},
        password: {required, minLength: minLength(8)},
        name: {required},
        // Пишем собственный валидатор, чекбокс должен быть в позиции true, обязательно, принимает value
        agree: {check: v => v}
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
                password: this.password,
                name: this.name
            };

            try {
                await this.$store.dispatch('registration', formData);
                // Если успешно зарегались, перешли на главную страницу
                this.$router.push('/');
            } catch (e) {e}
        }
    }
}
</script>