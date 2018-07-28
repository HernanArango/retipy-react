import React, { Component } from "react";
import Demography from "./Demography";
import OpticalEvaluation from "./OpticalEvaluation";
import Biomicroscopy from "./Biomicroscopy";

export default class Record extends Component
{
  render()
  {
    return(
      <div>
        <Demography id={0} disabled={false} />
        <OpticalEvaluation id={0} disabled={false} />
        <Biomicroscopy id={0} disabled={false} />
      </div>
      );
  }
}
