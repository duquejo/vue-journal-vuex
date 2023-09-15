import { createStore } from 'vuex';
import journal from '@/modules/daybook/store/journal';
import { shallowMount } from '@vue/test-utils';
import EntryListComponent from '@/modules/daybook/components/EntryListComponent';
import { journalState } from '../../../mocks/test-journal-state';

describe('EntryListComponent.vue', () => {

  const routerMock = {
    push: jest.fn(),
  };

  const createVuexStore = (initialState) => createStore({
    modules: {
      journal: {
        ...journal,
        state: { ...initialState },
      },
    },
  });

  const store = createVuexStore(journalState);

  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = shallowMount(EntryListComponent,{
      global: {
        mocks: {
          $router: routerMock,
        },
        plugins: [ store ],
      },
    });
  });

  it('should call getEntriesByTerm without term and it should return 2 entries.', () => {
    expect(wrapper.html()).toMatchSnapshot();
    expect(wrapper.findAll('entry-component-stub')).toHaveLength(2);
  });

  it('should call getEntriesByTerm and it should filter the provided entries.', async () => {
    const input = wrapper.find('input');
    await input.setValue('development');
    expect(wrapper.findAll('entry-component-stub')).toHaveLength(1);
  });

  it('should the new button redirect to the following /new subview.', () => {
    wrapper.find('button').trigger('click');
    expect(routerMock.push).toHaveBeenCalled();
    expect(routerMock.push).toHaveBeenCalledTimes(1);
    expect(routerMock.push).toHaveBeenCalledWith({ name: 'entry', params: { id: 'new' }});
  });
});