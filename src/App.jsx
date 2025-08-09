import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import PdfReader from "./components/Pdf";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <PdfReader />
      </div>
    </>
  );
}

export default App;
