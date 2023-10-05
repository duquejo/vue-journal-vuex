import { computed } from 'vue';
import { useStore } from 'vuex';

const useAuth = () => {
  const store = useStore();                                                  

  const createUser = async (user) => {
    return await store.dispatch('auth/createUser', user);
  };

  const loginUser = async (user) => {
    return await store.dispatch('auth/signInUser', user);
  };

  const checkAuthStatus = async () => {
    return await store.dispatch('auth/checkAuthenticationStatus');
  };

  const logoutUser = () => {
    store.commit('auth/logout');
    store.commit('journal/cleanEntries');
  };

  return {
    checkAuthStatus,
    createUser,
    loginUser,
    logoutUser,

    authStatus: computed(() => store.getters['auth/getCurrentState']),
    username: computed(() => store.getters['auth/getUsername']),
  };
};

export default useAuth;