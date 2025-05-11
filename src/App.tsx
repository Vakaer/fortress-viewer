import { ModelViewer } from './components/ModelViewer';
import hotspots from './data/hotspots';

function App() {
  return (
      <ModelViewer annotations={hotspots} />
  );
}

export default App;
