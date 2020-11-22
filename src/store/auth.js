import firebase from 'firebase/app';

export default {
    actions: {
        async login({dispatch, commit}, {email, password}) {
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password);
            } catch (e) {
                commit('setError', e);
                throw e;
            }
        },
        async registration({dispatch, commit}, {email, password, name}) {
            try {
                await firebase.auth().createUserWithEmailAndPassword(email, password);
                // dispatch - потому что обращаемся к action vuex
                const uid = await dispatch('getUid');
                // Обращаемся к полю в бд
                await firebase.database().ref(`/users/${uid}/info`).set({
                    bill: 10000,
                    name
                });
            } catch (e) {
                commit('setError', e);
                throw e;
            }
        },
        // Получаем id пользователя
        getUid() {
            const user = firebase.auth().currentUser;
            // null - для того, чтобы не было ошибки, потому что обращение к .uid, если его нет вызовет ошибку
            return user ? user.uid : null;
        },
        async logout({commit}) {
            await firebase.auth().signOut();
            commit('clearInfo');
        }
    }
}