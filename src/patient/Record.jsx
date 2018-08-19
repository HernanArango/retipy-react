import React, { Component } from "react";
import Patient from "./Patient";
import OpticalEvaluationView from "./OpticalEvaluationView";
import { Typography } from "@material-ui/core";

export default class Record extends Component
{
  render()
  {
    return(
      <div>
        <Typography>THIS IS A DEMO UI</Typography>
        <Patient id={0} disabled={false}/>
        <OpticalEvaluationView id={0} disabled={false} />
      </div>
      );
  }
}
