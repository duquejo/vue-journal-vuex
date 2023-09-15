import { createStore } from 'vuex';
import journal from '@/modules/daybook/store/journal';
import { shallowMount } from '@vue/test-utils';
import EntryView from '@/modules/daybook/views/EntryView';
import { journalState } from '../../../mocks/test-journal-state';
import Swal from 'sweetalert2';

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  showLoading: jest.fn(),
  close: jest.fn(),
}));

describe('EntryView.vue', () => {

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
  store.dispatch = jest.fn(); // Mocking inner functions. (because it could trigger API calls.)

  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = shallowMount(EntryView,{
      props: {
        id: journalState.entries[0].id,
      },
      global: {
        mocks: {
          $router: routerMock,
        },
        plugins: [ store ],
      },
    });
  });

  it('should redirect the user when the ID doesn\'t exists.', () => {
    shallowMount(EntryView, {
      props: {
        id: 'This ID doesn\'t exists!',
      },
      global: {
        mocks: {
          $router: routerMock,
        },
        plugins: [ store ],
      },
    });
    expect(routerMock.push).toHaveBeenCalled();
    expect(routerMock.push).toHaveBeenCalledTimes(1);
    expect(routerMock.push).toHaveBeenCalledWith({ name: 'no-entry' });
  });


  it('should show the entry as well.', () => {
    expect(wrapper.html()).toMatchSnapshot();
    expect(routerMock.push).not.toHaveBeenCalled();
  });

  it('should remove an entry and it should redirect.', (done) => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });

    wrapper.find('.btn-danger').trigger('click');

    expect(Swal.fire).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Are you sure?',
      text: 'Once deleted, it cannot be recovered.',
      showDenyButton: true,
      confirmButtonText: 'Yes, I\'m sure',
    });

    setTimeout(() => {
      expect(store.dispatch).toHaveBeenCalled();
      expect(store.dispatch).toHaveBeenCalledWith('journal/deleteEntry', journalState.entries[0].id);
      expect(routerMock.push).toHaveBeenCalled();
      expect(routerMock.push).toHaveBeenCalledWith({ name: 'no-entry' });
      done();
    }, 1);

  });
});