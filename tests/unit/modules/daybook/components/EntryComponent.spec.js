import { shallowMount } from '@vue/test-utils';
import EntryComponent from '@/modules/daybook/components/EntryComponent';
import { journalState } from '../../../mocks/test-journal-state';

describe('EntryComponent.vue', () => {

  const mockRouter = {
    push: jest.fn(),
  };

  const wrapper = shallowMount(EntryComponent, {
    props: {
      entry: journalState.entries[0],
    },
    global: {
      mocks: {
        $router: mockRouter,
      }
    }
  });

  it('should match the snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot();
  });

  it('should redirect when entry-container is clicked', () => {
    wrapper.find('.entry-container').trigger('click');
    expect(mockRouter.push).toHaveBeenCalled();
    expect(mockRouter.push).toHaveBeenCalledTimes(1);
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: 'entry',
      params: {
        id: journalState.entries[0].id
      }
    });
  });

  it('should have the computed variables populated', () => {
    expect(wrapper.vm.day).toBe(9);
    expect(wrapper.vm.month).toBe('September');
    expect(wrapper.vm.yearDay ).toBe('2023, Saturday');
  });
});