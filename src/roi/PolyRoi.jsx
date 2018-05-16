import React, { Component } from "react";
import { Line } from "react-konva";

export default class PolyRoi extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      tooltip: props.tooltip,
      text: props.text,
      visible: false,
      key: props.id,
      points: props.points
    }
  }

  setPoints(points)
  {
    this.setState({points: points});
  }

  render()
  {
    return(
      <Line ref="iRoi"
        points={this.state.points}
        key={"r" + this.state.key}
        closed={true}
        fill="black"
        opacity={0.5}
      />
    );
  }
}
