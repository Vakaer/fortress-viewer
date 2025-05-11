import './App.css';
import { ModelViewer } from './components/ModelViewer';
import hotspots from './data/hotspots';

function App() {
  return (
    <div className="App">
      <ModelViewer annotations={hotspots} />
    </div>
  );
}

export default App;
