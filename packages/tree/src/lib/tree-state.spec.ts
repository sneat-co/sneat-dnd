import {TreeState} from './tree-state';
import {IDndTreeSpec} from './interfaces-dnd';

describe('TreeState', () => {
  interface ITestItem {
    id: string;
    children?: ITestItem[];
  }

  it('should emit `moved` event', done => {
    const spec: IDndTreeSpec<ITestItem> = {
      itemId: item => item.id,
      hasChildren: item => !!item.children?.length,
      childrenCount: item => item.children?.length,
      getChildItems: item => item.children,
      autoExpand: () => true,
    };
    const id = 'test-tree';
    const state = new TreeState<ITestItem>({id, spec});
    const root: ITestItem = {
      id: 'root',
      children: [
        {id: '1'},
        {id: '2'},
        {id: '3'},
        {id: '4'},
      ]
    };
    state.updateRoot(root);

    let movedCount = 0;
    state.moved.subscribe(moved => {
      movedCount += 1;
      expect(moved).toBeTruthy();

      expect(moved.from).toBeTruthy();
      expect(moved.from.parent).toEqual('root');
      expect(moved.from.index).toEqual(0);

      expect(moved.node).toBeTruthy();
      expect(moved.node.parent).toEqual('root');
      expect(moved.node.index).toEqual(1);

      done();
    });

    // The method we test
    const node = state.move('1', {parent: 'root', index: 1});

    expect(node).toBeTruthy();
    expect(node.id).toEqual('1');
    expect(node.index).toEqual(1);
    expect(movedCount).toEqual(1);
  });
});
