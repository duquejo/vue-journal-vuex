import { shallowMount } from "@vue/test-utils";
import FabComponent from '@/modules/daybook/components/FabComponent';

describe('FabComponent.vue', () => {
  it('Should match the snapshot', () => {
    const wrapper = shallowMount(FabComponent);
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('Should show the default icon', () => {
    const wrapper = shallowMount(FabComponent);
    const icon = wrapper.find('i');

    expect(icon.classes('fa-plus')).toBeTruthy();
  });

  it('Should show the icon fa-circle if the args are been supplied', () => {
    const wrapper = shallowMount(FabComponent, {
      props: {
        icon: 'fa-circle',
      },
    });
    const icon = wrapper.find('i');
 
    expect(icon.classes('fa-circle')).toBeTruthy();
  });

  it('Should emit the on:click event if its clicked', () => {
    const wrapper = shallowMount(FabComponent);
    
    wrapper.find('button').trigger('click');

    expect(wrapper.emitted('on:click')).toHaveLength(1);
  });
});
