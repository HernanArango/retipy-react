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
        opacity={this.props.opacity}
      />
    );
  }
}

class Result extends Component
{
  constructor(props)
  {
    super(props)
    this.state =
    {
      name: props.name,
      data: props.data,
      image: props.image
    }
  }

  render()
  {
    console.log(this.state.data)
    return(
      <div>
        <label>{this.state.name}</label>
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Image image={this.state.image} />
        </Layer>
        <Layer>
          {this.state.data}
        </Layer>
      </Stage>
    </div>
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
      results: [],
      selection: props.selection
    };
  }

  componentDidMount()
  {
    getId(this.state.id).then(data => {
      var results = [];
      // process the result array
      for (var i = 0; i < data.results.length; i++)
      {
        var currentResultData = data.results[i];
        // process the internal Roi objects
        var roiList = [];
        for (var roiIndex=0; roiIndex < currentResultData.data.length; roiIndex++)
        {
          var currentRoi = <Roi
            key={roiIndex}
            x1={currentResultData.data[roiIndex].roi_x[0]}
            x2={currentResultData.data[roiIndex].roi_x[3]}
            y1={currentResultData.data[roiIndex].roi_y[0]}
            y2={currentResultData.data[roiIndex].roi_y[3]}
            color={Konva.Util.getRandomColor()}
            opacity={0.5} />;
          roiList.push(currentRoi);
        }
        // load the result image in memory
        var currentImage = new window.Image();
        currentImage.src = "data:image/png;base64," + currentResultData.image;

        var currentResult = <Result
          name={currentResultData.name}
          data={roiList}
          image={currentImage} />;
        results.push(currentResult);
      }
      this.setState({uri: data.uri, results: results});
      this.forceUpdate()
    });
  }

  render()
  {
    return(
      <div>
        {this.state.results[this.state.selection]}
      </div>
     );
  }
}
