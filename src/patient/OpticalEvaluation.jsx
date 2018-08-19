import React from "react";
import OpticalEvaluationView from "./OpticalEvaluationView";

class OpticalEvaluation extends React.Component
{
  state =
  {
    id: 0,
    visualLeftEye: "",
    visualRightEye: "",
    visualLeftPh: "",
    visualRightPh: "",
    pupilLeftEyeRD: 0,
    pupilLeftEyeRC: 0,
    pupilLeftEyeDPA: 0,
    pupilRightEyeRD: 0,
    pupilRightEyeRC: 0,
    pupilRightEyeDPA: 0,
    evaluationId: 0,
    addDisabled: false,
  }

  handleChange = (key, value) => this.setState({[key]: value});

  render()
  {
    return(
      <OpticalEvaluationView />
    )
  }
}
