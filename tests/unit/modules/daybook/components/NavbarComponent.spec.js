import { shallowMount } from "@vue/test-utils";
import NavbarComponent from '@/modules/daybook/components/NavbarComponent';
import createVuexStore from "../../../mocks/mock-store";
import { useRouter } from 'vue-router';

jest.mock('vue-router', () => ({
  useRoute: jest.fn(),
  useRouter: jest.fn(() => ({
    push: () => {}
  }))
}));

describe('NavbarComponent.vue', () => {

  const store = createVuexStore({
    user: {
      name: 'John Doe',
      email: 'foo@bar.com',
    },
    status: 'authenticated',
    idToken: 'abc-123',
    refreshToken: 'xyz-123',
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show the component as needed', () => {
    const wrapper = shallowMount(NavbarComponent, {
      global: {
        plugins: [ store ],
      }
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should logout when logout button is pressed and redirect', async () => {

    const push = jest.fn();
    useRouter.mockImplementationOnce(() => ({ push }));

    const wrapper = shallowMount(NavbarComponent, {
      global: {
        plugins: [ store ],
      }
    });

    await wrapper.find('button').trigger('click');

    expect(push).toHaveBeenCalledWith({ name: 'login' });
    expect(store.state.auth).toEqual({
      user: null,
      status: 'not-authenticated',
      idToken: null,
      refreshToken: null,
    });
  });
});