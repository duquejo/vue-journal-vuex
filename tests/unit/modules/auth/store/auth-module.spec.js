import authApi from '../../../../../src/api/authApi';
import createVuexStore from '../../../mocks/mock-store';

jest.mock('../../../../../src/api/authApi');

describe('Vuex - Auth module', () => {

  const initialState = {
    status: 'authenticating', // authenticated, not-authenticated, authenticating
    user: null,
    idToken: null,
    refreshToken: null,
  };

  const authenticatedInitialState = {
    status: 'authenticated',
    user: { name: 'demo', email: 'demo@demo.com' },
    idToken: 'abc-123',
    refreshToken: 'xyz-123',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have an initial state', () => {

    const store = createVuexStore(initialState);
    const { status, user, idToken, refreshToken } = store.state.auth;
    expect(status).toBe('authenticating');
    expect(user).toBe(null);
    expect(idToken).toBe(null);
    expect(refreshToken).toBe(null);

  });

  it('mutation: loginUser', () => {

    const store = createVuexStore(initialState);
    const payload = {
      user: { name: 'demo', email: 'demo@demo.com' },
      idToken: 'abc-123',
      refreshToken: 'xyz-123',
    };

    store.commit('auth/loginUser', payload);

    const { status, user, idToken, refreshToken } = store.state.auth;
    expect(status).toBe('authenticated');
    expect(user).toEqual(payload.user);
    expect(idToken).toBe(payload.idToken);
    expect(refreshToken).toBe(payload.refreshToken);
  });

  it('mutation: logout', () => {

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'removeItem');
    Object.setPrototypeOf(window.localStorage.removeItem, jest.fn());

    const store = createVuexStore(authenticatedInitialState);

    store.commit('auth/logout');

    const { status, user, idToken, refreshToken } = store.state.auth;
    expect(status).toBe('not-authenticated');
    expect(user).toBeFalsy();
    expect(idToken).toBeFalsy();
    expect(refreshToken).toBeFalsy();
    
    expect(window.localStorage.removeItem).toHaveBeenCalled();
    expect(window.localStorage.removeItem).toHaveBeenCalledTimes(2);
    expect(window.localStorage.removeItem).toHaveBeenNthCalledWith(1, 'idToken');
    expect(window.localStorage.removeItem).toHaveBeenNthCalledWith(2, 'refreshToken');

  });

  it('getters: getCurrentState | getUsername', () => {
    const store = createVuexStore(authenticatedInitialState);

    expect(store.getters['auth/getCurrentState']).toBe(authenticatedInitialState.status);
    expect(store.getters['auth/getUsername']).toBe(authenticatedInitialState.user.name);

    const store2 = createVuexStore({
      ...authenticatedInitialState,
      user: { email: 'demo@demo.com' },
    });

    expect(store2.getters['auth/getUsername']).toBe('');
  });

  it('actions: createUser - User exists', async () => {

    const expectedResponse = 'EMAIL_EXISTS';
    const authApiSpyPost = jest.spyOn(authApi, 'post').mockRejectedValueOnce({
      response: {
        data: {
          error: { message: expectedResponse }
        }
      }
    });
    const authApiSpyGet = jest.spyOn(authApi, 'get');
    const store = createVuexStore({
      ...initialState,
      status: 'not-authenticated',
    });
    const newUser = { name: 'test user', email: 'demo@demo.com', password: 'demo123' };
    const response = await store.dispatch('auth/createUser', newUser );
    expect( response ).toEqual({ ok: false, message: expectedResponse });
    expect(authApiSpyPost).toHaveBeenCalled();
    expect(authApiSpyPost).toHaveBeenCalledWith(':signUp', {
      email: newUser.email,
      password: newUser.password,
      returnSecureToken: true,
    });
    expect(authApiSpyGet).not.toHaveBeenCalled();
  });

  it('actions: signInUser - Create an user', async () => {

    const idTokenMock = 'idToken123';
    const refreshTokenMock = 'refreshToken123';
    const newUser = { name: 'test user', email: 'demo@demo.com' };

    const authApiSpy = jest.spyOn(authApi, 'post').mockResolvedValueOnce({
      data: {
        idToken: idTokenMock,
        refreshToken: refreshTokenMock, 
        displayName: newUser.name,
      }
    });
    const store = createVuexStore({
      ...initialState,
      status: 'not-authenticated',
    });
    const response = await store.dispatch('auth/signInUser', newUser );
    const { status, user, idToken: token, refreshToken: refToken } = store.state.auth;

    expect(authApiSpy).toHaveBeenCalled();
    expect(authApiSpy).toHaveBeenCalledWith(':signInWithPassword', {
      email: newUser.email,
      password: newUser.password,
      returnSecureToken: true,
    });
    expect(response).toEqual({ ok: true });
    expect(status).toBe('authenticated');
    expect(user).toEqual(newUser);
    expect(token).toBe(idTokenMock);
    expect(refToken).toBe(refreshTokenMock);
  });

  it('actions: checkAuthenticationStatus - Successful', async () => {

    const idTokenMock = 'idToken123';
    const refreshTokenMock = 'refreshToken123';
    const user = { name: 'test user', email: 'demo@demo.com', password: '123' };

    const authApiSpy = jest.spyOn(authApi, 'post').mockResolvedValueOnce({
      data: {
        users: [{
          email: user.email, 
          displayName: user.name,
        }],
      }
    });

    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem')
      .mockReturnValueOnce(idTokenMock)
      .mockReturnValueOnce(refreshTokenMock);
    
    Object.setPrototypeOf(window.localStorage.getItem, jest.fn());

    const store = createVuexStore({
      ...initialState,
      status: 'not-authenticated',
    });

    const response = await store.dispatch('auth/checkAuthenticationStatus');

    expect(response).toEqual({ ok: true });
    expect(window.localStorage.getItem).toHaveBeenCalled();
    expect(window.localStorage.getItem).toHaveBeenCalledTimes(2);
    expect(window.localStorage.getItem).toHaveBeenNthCalledWith(1, 'idToken');
    expect(window.localStorage.getItem).toHaveBeenNthCalledWith(2, 'refreshToken');
    expect(authApiSpy).toHaveBeenCalled();
    expect(authApiSpy).toHaveBeenCalledWith(':lookup', { idToken: idTokenMock });
    const { status, user: stateUser, idToken: token, refreshToken: refToken } = store.state.auth;
    expect(status).toBe('authenticated');
    expect(stateUser).toEqual({
      email: user.email,
      name: user.name,
    });
    expect(token).toBe(idTokenMock);
    expect(refToken).toBe(refreshTokenMock);
  });

  it('actions: checkAuthenticationStatus - Unsuccessful', async () => {

    const authApiSpy = jest.spyOn(authApi, 'post');
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce(null);    
    Object.setPrototypeOf(window.localStorage.getItem, jest.fn());

    const store = createVuexStore(initialState);

    const response = await store.dispatch('auth/checkAuthenticationStatus');

    expect(response).toEqual({ ok: false, message: 'Session token not found' });
    expect(window.localStorage.getItem).toHaveBeenCalled();
    expect(window.localStorage.getItem).toHaveBeenCalledTimes(2);
    expect(window.localStorage.getItem).toHaveBeenNthCalledWith(1, 'idToken');
    expect(window.localStorage.getItem).toHaveBeenNthCalledWith(2, 'refreshToken');
    expect(authApiSpy).not.toHaveBeenCalled();
    expect(store.state.auth).toHaveProperty('status', 'not-authenticated');
    expect(store.state.auth).toHaveProperty('user', null);
    expect(store.state.auth).toHaveProperty('idToken', null);
    expect(store.state.auth).toHaveProperty('refreshToken', null);
  });

  it('actions: checkAuthenticationStatus - Unsuccessful/wrong idToken', async () => {

    const mockedLookupResponse = 'INVALID_ID_TOKEN';
    const idTokenMock = 'abc-123';
    const authApiSpy = jest.spyOn(authApi, 'post').mockRejectedValueOnce({
      response: {
        data: {
          error: {
            message: mockedLookupResponse,
          },
        },
      },
    });
    jest.spyOn(Object.getPrototypeOf(window.localStorage), 'getItem').mockReturnValueOnce(idTokenMock);    
    Object.setPrototypeOf(window.localStorage.getItem, jest.fn());

    const store = createVuexStore(initialState);

    const response = await store.dispatch('auth/checkAuthenticationStatus');

    expect(response).toEqual({ ok: false, message: mockedLookupResponse });
    expect(window.localStorage.getItem).toHaveBeenCalled();
    expect(window.localStorage.getItem).toHaveBeenCalledTimes(2);
    expect(window.localStorage.getItem).toHaveBeenNthCalledWith(1, 'idToken');
    expect(window.localStorage.getItem).toHaveBeenNthCalledWith(2, 'refreshToken');
    expect(authApiSpy).toHaveBeenCalled();
    expect(authApiSpy).toHaveBeenCalledWith(':lookup', { idToken: idTokenMock });
    expect(store.state.auth).toHaveProperty('status', 'not-authenticated');
    expect(store.state.auth).toHaveProperty('user', null);
    expect(store.state.auth).toHaveProperty('idToken', null);
    expect(store.state.auth).toHaveProperty('refreshToken', null);
  });
});