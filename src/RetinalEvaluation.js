import React, { Component } from "react";
import Konva from "konva";
import { Stage, Layer, Rect, Image } from "react-konva";

const config = {
  backend_url: "http://localhost:8080/"
}

const getId = (id) => {
  var endpoint = (id) => `retipy/evaluation/${id}`
  return fetch(config.backend_url + endpoint(id), {
    method: 'GET',
    mode: 'cors',
    referrer: 'no-referrer',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'content-type': 'application/json'
    }})
    .then(response => response.json())
}

class Roi extends Component
{
  render()
  {
    return (
      <Rect
        x={this.props.x1}
        y={this.props.y1}
        width={this.props.x2 - this.props.x1}
        height={this.props.y2 - this.props.y1}
        fill={this.props.color}
        opacity={0.5}
      />
    );
  }
}

export default class RetinalEvaluation extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      id: props.id,
      uri: "",
      roi: [],
      image: null
    }
  }

  componentDidMount()
  {
    getId(this.state.id).then(data => {
      var new_roi = []
      for (var i = 0; i < data.data.length; i++)
      {
        var currentRoi = <Roi key={i} x1={data.data[i].roi_x[0]} x2={data.data[i].roi_x[3]} y1={data.data[i].roi_y[0]} y2={data.data[i].roi_y[3]} color={Konva.Util.getRandomColor()} />;
        new_roi.push(currentRoi);
      }
      var new_image = new window.Image();
      new_image.src = "data:image/png;base64," + data.image;
      this.setState({uri: data.uri, roi: new_roi, image: new_image})
    });
  }

  render()
  {
    return(
        <div>
          <Stage width={window.innerWidth} height={window.innerHeight}>
            <Layer>
              <Image image={this.state.image} />
            </Layer>
            <Layer>
              {this.state.roi}
            </Layer>
          </Stage>
        </div>
     );
  }
}
