import DigitalClock from "./components/DigiClock";
import ToDoList from "./components/ToDoList";
import MoreIncoming from "./components/MoreIncoming";
import "./App.css";

function App() {
  return (
    <div className="container font-bitcount flex">
      <ToDoList />
      <DigitalClock />
      <MoreIncoming />
    </div>
  );
}

export default App;
