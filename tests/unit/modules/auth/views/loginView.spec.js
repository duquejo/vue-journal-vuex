import { shallowMount } from '@vue/test-utils';
import LoginView from '@/modules/auth/views/LoginView';
import createVuexStore from '../../../mocks/mock-store';
import { useRouter } from 'vue-router';

import Swal from 'sweetalert2';

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
  useRouter: jest.fn(() => ({
    push: () => {}
  }))
}));

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  showLoading: jest.fn(),
  close: jest.fn(),
}));

describe('LoginView.vue', () => {

  const store = createVuexStore({
    status: 'not-authenticated',
    user: null,
    idToken: null,
    refreshToken: null,
  });

  store.dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render the component', () => {
    const wrapper = shallowMount(LoginView, {
      global: {
        plugins: [ store ],
        stubs: ['router-link']
      }
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('should display an error if login fails', async () => {

    const push = jest.fn();
    useRouter.mockImplementationOnce(() => ({ push }));
    store.dispatch.mockReturnValueOnce({ ok: false, message: 'EMAIL/PASSWORD Credentials'});
    const wrapper = shallowMount(LoginView, {
      global: {
        plugins: [ store ],
        stubs: ['router-link']
      }
    });

    await wrapper.find('form').trigger('submit');

    /**
     * Taking advantage of the mocked Storage.
     */
    expect(store.dispatch).toHaveBeenCalledWith('auth/signInUser', {
      email: '',
      password: '',
    });
    expect(Swal.fire).toHaveBeenCalledWith('Error', 'EMAIL/PASSWORD Credentials', 'error');
    expect(push).not.toHaveBeenCalled();
  });

  test('should signIn an user and redirect to the main journal view', async () => {

    const push = jest.fn();
    useRouter.mockImplementationOnce(() => ({ push }));
    store.dispatch.mockReturnValueOnce({ ok: true });
    const wrapper = shallowMount(LoginView, {
      global: {
        plugins: [ store ],
        stubs: ['router-link']
      }
    });

    const [ inputEmail, inputPassword ] = wrapper.findAll('input');
    await inputEmail.setValue('foo@bar.com');
    await inputPassword.setValue('foo-123');

    await wrapper.find('form').trigger('submit');

    /**
     * Taking advantage of the mocked Storage.
     */
    expect(store.dispatch).toHaveBeenCalledWith('auth/signInUser', {
      email: 'foo@bar.com',
      password: 'foo-123',
    });
    expect(Swal.fire).not.toHaveBeenCalled();
    expect(push).toHaveBeenCalledWith({ name: 'no-entry' });

    expect(wrapper.vm.userForm).toHaveProperty('email', 'foo@bar.com');
    expect(wrapper.vm.userForm).toHaveProperty('password', 'foo-123');
  });
});