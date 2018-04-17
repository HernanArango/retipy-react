import React, { Component } from "react";
import {Route, Link} from 'react-router-dom'
import RetinalEvaluation from "./RetinalEvaluation.js"
import UploadImage from "./UploadImage.js"

class App extends Component {
  render() {
    return (
    <div>
      <nav>
        <Link to="/evaluation/1">Evaluation</Link>
      </nav>
      <div>
        <Route exact path="/evaluation/:id/:selection" render={props => {
          return <RetinalEvaluation id={props.match.params.id} selection={props.match.params.selection}/> }} />
        <Route exact path="/upload" component={UploadImage} />
      </div>
    </div>
    );
  }
}

export default App;
