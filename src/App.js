import React from "react";
import { render } from "react-dom";
import Weather from "./Weather";
const App = () => {
  return (
    <div className="weather">
      <Weather />
    </div>
  );
};

render(<App />, document.getElementById("root"));
