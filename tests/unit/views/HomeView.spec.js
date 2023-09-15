import { shallowMount } from "@vue/test-utils";
import HomeView from '@/views/HomeView';

describe('HomeView.vue', () => {
  it('Should match the snapshot', () => {
    const wrapper = shallowMount(HomeView);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('Should redirect to no-entry view if any button is clicked', () => {
    const mockRouter = {
      push: jest.fn(),
    };

    const wrapper = shallowMount(HomeView, {
      global: {
        mocks: {
          $router: mockRouter,
        },
      },
    });

    wrapper.find('button').trigger('click');

    expect(mockRouter.push).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'no-entry' });

  });
});