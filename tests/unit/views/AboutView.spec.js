import { shallowMount } from "@vue/test-utils";
import AboutView from '@/views/AboutView';

describe('AboutView.vue', () => {
  it('Should match the snapshot', () => {
    const wrapper = shallowMount(AboutView);
    expect(wrapper.html()).toMatchSnapshot();
  });
});