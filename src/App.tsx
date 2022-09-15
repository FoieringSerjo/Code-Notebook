import 'bulmaswatch/superhero/bulmaswatch.min.css';
// import CodeCell from './components/code-cell';
import { Provider } from 'react-redux';
import { store } from './state';
import CellList from './components/cell-list';

const App = () => {
  return (
    <Provider store={store}>
      <div>
        <CellList />
        {/* <CodeCell /> */}
      </div>
    </Provider>
  );
};

export default App;
