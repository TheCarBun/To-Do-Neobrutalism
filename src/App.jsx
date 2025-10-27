import DigitalClock from "./components/DigiClock";
import ToDoList from "./components/ToDoList";
import "./App.css";

function App() {
  return (
    <div className="container font-bitcount flex">
      <ToDoList />
      <DigitalClock />
    </div>
  );
}

export default App;
