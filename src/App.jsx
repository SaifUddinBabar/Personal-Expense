import AppRouter from "./AppRouter";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        <AppRouter />
      </div>
    </div>
  );
}

export default App;
