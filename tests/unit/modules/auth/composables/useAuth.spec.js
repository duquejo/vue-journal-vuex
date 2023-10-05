import useAuth from '@/modules/auth/composables/useAuth';

const mockStore = {
  dispatch: jest.fn(),
  commit: jest.fn(),
  getters: {
    'auth/getCurrentState': 'authenticated',
    'auth/getUsername': 'foo',
  },
};

jest.mock('vuex', () => ({
  useStore: () => mockStore
}));

describe('useAuth tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createUser - successful', async () => {

    const { createUser } = useAuth();
    const user = {
      name: 'Foo',
      email: 'foo@bar.com',
      password: 'foo123'
    };
    mockStore.dispatch.mockReturnValueOnce({ ok: true });
    
    const response = await createUser(user);

    expect(mockStore.dispatch).toHaveBeenCalledWith('auth/createUser', user );
    expect(response).toEqual({ ok: true });
  });

  it('createUser - failed - \'EMAIL_EXISTS\'', async () => {

    const { createUser } = useAuth();
    const user = {
      name: 'Foo',
      email: 'foo@bar.com',
      password: 'foo123'
    };
    mockStore.dispatch.mockReturnValueOnce({ ok: false, message: 'EMAIL_EXISTS' });

    const response = await createUser(user);

    expect(mockStore.dispatch).toHaveBeenCalledWith('auth/createUser', user );
    expect(response).toEqual({ ok: false, message: 'EMAIL_EXISTS' });
  });

  it('loginUser - successful', async () => {

    const { loginUser } = useAuth();
    const user = {
      email: 'foo@bar.com',
      password: 'foo123'
    };
    mockStore.dispatch.mockReturnValueOnce({ ok: true });

    const response = await loginUser(user);
    
    expect(mockStore.dispatch).toHaveBeenCalledWith('auth/signInUser', user );
    expect(response).toEqual({ ok: true });
  });

  it('loginUser - failed - \'EMAIL/PASSWORD no not exist\'', async () => {

    const { loginUser } = useAuth();
    const user = {
      email: 'foo@bar.com',
      password: 'foo123'
    };
    mockStore.dispatch.mockReturnValueOnce({ ok: false, message: 'EMAIL/PASSWORD no not exist' });

    const response = await loginUser(user);

    expect(mockStore.dispatch).toHaveBeenCalledWith('auth/signInUser', user );
    expect(response).toEqual({ ok: false, message: 'EMAIL/PASSWORD no not exist' });
  });

  it('checkAuthStatus - successful', async () => {

    const { checkAuthStatus } = useAuth();
    mockStore.dispatch.mockReturnValueOnce({ ok: true });

    const response = await checkAuthStatus();

    expect(mockStore.dispatch).toHaveBeenCalledWith('auth/checkAuthenticationStatus' );
    expect(response).toEqual({ ok: true });
  });

  it('logout', async () => {

    const { logoutUser } = useAuth();

    logoutUser();

    expect(mockStore.commit).toHaveBeenNthCalledWith(1, 'auth/logout' );
    expect(mockStore.commit).toHaveBeenNthCalledWith(2, 'journal/cleanEntries' );
  });

  it('computed authStatus/username getters', () => {
    const { authStatus, username } = useAuth();
    
    expect(authStatus.value).toBe('authenticated');
    expect(username.value).toBe('foo');
  });
});