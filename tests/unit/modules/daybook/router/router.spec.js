import daybookRouter from '@/modules/daybook/router';

describe('Daybook router unit tests', () => {
  
  it('should have the specified configuration', async () => {
    expect(daybookRouter).toMatchObject({
      name: 'daybook',
      component: expect.any(Function),
      children: [
        {
          path: '',
          name: 'no-entry',
          component: expect.any(Function),
        },
        {
          path: ':id',
          name: 'entry',
          component: expect.any(Function),
          props: expect.any(Function),
        },
      ]
    });

    const promiseRoutes = [];
    daybookRouter.children.forEach( child => promiseRoutes.push(child.component() ));

    const routes = (await Promise.all(promiseRoutes)).map( r => r.default.name );
    
    expect(routes).toContain('EntryView');
    expect(routes).toContain('NoEntrySelectedView');
  });

  it('should return the route id', () => {
    const params =  { id: 'ABC-123' };
    const route = { params };
    const entryRoute = daybookRouter.children.find( entry => entry.name === 'entry' );
    expect(entryRoute.props(route)).toEqual(params);
  });
});