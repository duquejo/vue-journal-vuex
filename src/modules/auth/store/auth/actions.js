import authApi from '@/api/authApi';

export const createUser = async ({ commit }, user ) => {
  const { name, email, password } = user;
  try {
    const { data } = await authApi.post(':signUp', {
      email,
      password,
      returnSecureToken: true,
    });
    const { idToken, refreshToken } = data;
    /**
     * Update userinfo.
     */
    await authApi.post(':update', {
      displayName: name,
      idToken,
    });
    delete user.password;
    commit('loginUser', { user, idToken, refreshToken });
    return { ok: true };
  } catch (error) {
    console.error(error.response.data.error);
    return {
      ok: false,
      message: error.response.data.error.message,
    }
  }
};

export const signInUser = async ({ commit }, user ) => {
  const { email, password } = user;
  try {
    const { data } = await authApi.post(':signInWithPassword', {
      email,
      password,
      returnSecureToken: true,
    });
    const { idToken, refreshToken, displayName } = data;
    user.name = displayName;
    commit('loginUser', { user, idToken, refreshToken });
    return { ok: true };
  } catch (error) {
    console.error(error.response.data.error);
    return {
      ok: false,
      message: error.response.data.error.message,
    }
  }
};

export const checkAuthenticationStatus = async({ commit }) => {
  const idToken = localStorage.getItem('idToken');
  const refreshToken = localStorage.getItem('refreshToken');

  if( !idToken ) {
    commit('logout');
    return { ok: false, message: 'Session token not found' };
  }

  try {
    const { data } = await authApi.post(':lookup', { idToken });
    const { displayName: name, email } = data.users[0];
    const user = { name, email };
    commit('loginUser', { user, idToken, refreshToken });
    return { ok: true };
  } catch (error) {
    commit('logout');
    return {
     ok: false, 
     message: error.response.data.error.message
    };
  }
};