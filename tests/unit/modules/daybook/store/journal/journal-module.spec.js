import { createStore } from 'vuex';
import journal from '@/modules/daybook/store/journal';
import { journalState } from '../../../../mocks/test-journal-state';

import journalApi from '../../../../../../src/api/journalApi';

jest.mock('../../../../../../src/api/journalApi');

describe('Vuex - Journal module', () => {

  const createVuexStore = (initialState) => createStore({
    modules: {
      journal: {
        ...journal,
        state: { ...initialState },
      },
    },
  });

  /**
   * From mocked firebase.
   */
  const mockedEntries = {
    abc123: {
      date: 'Sat Jul 27 2021',
      text: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit. Qui distinctio cumque neque explicabo suscipit laborum quia molestias accusantium! Eos in similique velit alias ipsum rem veniam tenetur labore odio? Veniam.'
    },
    xyz456: {
      date: 'Sat Jul 16 2021',
      text: 'Eos in similique velit alias ipsum rem veniam tenetur labore odio? Veniam.'
    }
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should have an initial state preconfigured', () => {
    const store = createVuexStore(journalState);
    const { isLoading, entries }  = store.state.journal;
    expect(isLoading).toBeFalsy();
    expect(entries).toEqual(journalState.entries);
  });

  test('mutation: setEntries', () => {
    const store = createVuexStore({ isLoading: true, entries: [] });
    store.commit('journal/setEntries', journalState.entries);
    expect(store.state.journal.entries).toHaveLength(2);
    expect(store.state.journal.isLoading).toBeFalsy();
  });

  test('mutation: updateEntry', () => {
    const updatedEntry = {
      id: '-Nduiz2VC-Fp3KiXUR96',
      date: 1694276249920,
      text: 'Hello world from tests!',
    };
    const store = createVuexStore(journalState);
    store.commit('journal/updateEntry', updatedEntry);
    const storeEntries = store.state.journal.entries;
    expect(storeEntries).toHaveLength(2);
    expect(storeEntries.find( entry => entry.id === updatedEntry.id )).toEqual(updatedEntry);
  });

  test('mutation: addEntry', () => {
    const store = createVuexStore(journalState);
    const addEntry = {
      id: 'ABC-123',
      date: new Date(),
      text: 'Hello world!',
    };
    store.commit('journal/addEntry', addEntry);
    expect(store.state.journal.entries).toHaveLength(3);
    expect(store.state.journal.entries.some(e => e.id === addEntry.id )).toBeTruthy();
  });

  test('mutation: deleteEntry', () => {
    const store = createVuexStore(journalState);
    const deleteEntry = journalState.entries[0].id;
    store.commit('journal/deleteEntry', deleteEntry);
    expect(store.state.journal.entries).toHaveLength(1);
    expect(store.state.journal.entries.some(e => e.id === deleteEntry.id )).toBeFalsy();
  });


  test('getters: getEntriesByTerm', () => {
    const store = createVuexStore(journalState);
    const [ _, entry2 ] = journalState.entries;
    expect( store.getters['journal/getEntriesByTerm']('') ).toHaveLength(2);
    expect( store.getters['journal/getEntriesByTerm']('development') ).toEqual([ entry2 ]);
  });

  test('getters: getEntryById', () => {
    const store = createVuexStore(journalState);
    const [ entry1 ] = journalState.entries;
    expect( store.getters['journal/getEntryById'](entry1.id) ).toEqual(entry1);
  });

  test('actions: loadEntries', async () => {
    const journalApiSpy = jest.spyOn(journalApi, 'get').mockResolvedValueOnce({ data: mockedEntries });

    const store = createVuexStore({ isLoading: true, entries: [] });

    await store.dispatch('journal/loadEntries');

    expect( store.state.journal.entries ).toHaveLength(Object.keys(mockedEntries).length);
    expect(journalApiSpy).toHaveBeenCalled();
    expect(journalApiSpy).toHaveBeenCalledTimes(1);
    expect(journalApiSpy).toHaveBeenCalledWith('/entries.json');
  });

  test('actions: updateEntry', async () => {
    const journalApiSpy = jest.spyOn(journalApi, 'put');

    const updatedEntry = {
      id: '-Nduiz2VC-Fp3KiXUR96',
      date: 1694276249920,
      text: 'Hello world from tests!',
      anotherField: true,
      foo: 'bar',
    };

    const expectedEntry = {
      id: updatedEntry.id,
      date: updatedEntry.date,
      text: updatedEntry.text,
      picture: undefined,
    };

    const store = createVuexStore(journalState);

    await store.dispatch('journal/updateEntry', updatedEntry);

    expect( store.state.journal.entries ).toHaveLength(2);

    const foundEntry =  store.state.journal.entries.find( e => e.id === updatedEntry.id );
    expect(foundEntry).toEqual(expectedEntry);
    expect(journalApiSpy).toHaveBeenCalled();
    expect(journalApiSpy).toHaveBeenCalledTimes(1);
    expect(journalApiSpy).toHaveBeenCalledWith(`/entries/${updatedEntry.id}.json`,expect.objectContaining({
      date: expect.any(Number),
      text: expect.any(String),
      id: expect.any(String),
      picture: undefined
    }));
  });

  test('actions: createEntry', async () => {

    const newId = 'ABC-123';
    const journalApiSpy = jest.spyOn(journalApi, 'post').mockResolvedValueOnce({
      data: { name: newId },
    });
    const addEntry = {
      date: 1694276249920,
      text: 'Hello world from tests 2!',
      picture: 'http://photo.jpg',
    };
    const store = createVuexStore({ isLoading: true, entries: [] });

    const id = await store.dispatch('journal/createEntry', addEntry);

    const foundEntry =  store.state.journal.entries.find( e => e.id === id );

    expect( store.state.journal.entries ).toHaveLength(1);
    expect(typeof id).toBe('string');
    expect(id).toBe(newId);
    expect(foundEntry).toBeTruthy();
    expect(journalApiSpy).toHaveBeenCalled();
    expect(journalApiSpy).toHaveBeenCalledTimes(1);
    expect(journalApiSpy).toHaveBeenCalledWith(`/entries.json`, expect.objectContaining({
      date: expect.any(Number),
      picture: expect.any(String),
      text: expect.any(String)
    }));
  });

  test('actions: deleteEntry', async () => {

    const deleteId = journalState.entries[0].id;
    const journalApiSpy = jest.spyOn(journalApi, 'delete');
    const store = createVuexStore(journalState);

    const id = await store.dispatch('journal/deleteEntry', deleteId);

    const foundEntry =  store.state.journal.entries.find( e => e.id === id );
    expect( store.state.journal.entries ).toHaveLength(1);
    expect(typeof id).toBe('string');
    expect(foundEntry).toBeFalsy();
    expect(id).toBe(deleteId);
    expect(journalApiSpy).toHaveBeenCalled();
    expect(journalApiSpy).toHaveBeenCalledTimes(1);
    expect(journalApiSpy).toHaveBeenCalledWith(`/entries/${deleteId}.json`);
  });


});