import React, { Component } from "react";
import "./App.scss";
import Navbar from "./components/Navbar";
import Home from "./components/Home";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      update: false
    };
  }
  render() {
    return (
      <div>
        <Navbar />
        <Home />
      </div>
    );
  }
}

export default App;
