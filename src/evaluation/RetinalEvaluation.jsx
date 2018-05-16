import React, { Component } from "react";
import Konva from "konva";
import { withStyles, Grid, Typography } from "@material-ui/core";
import { Configuration as CNF } from '../Configuration';
import Result from './Result';
import Roi from '../roi/Roi';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: theme.spacing.unit,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }
});

const getId = (id) => {
  var endpoint = (id) => `${CNF.EVALUATION_ENDPOINT}/${id}`
  return fetch(CNF.REST_URL + endpoint(id), {
    method: 'GET',
    mode: 'cors',
    referrer: 'no-referrer',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'content-type': 'application/json'
    }})
    .then(response => response.json())
}

class RetinalEvaluation extends Component
{
  constructor(props)
  {
    super(props);
    this.state = {
      id: props.id,
      uri: "",
      results: [],
      selection: props.selection,
      block: true
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
            id={roiIndex}
            x1={currentResultData.data[roiIndex].roi_x[0]}
            x2={currentResultData.data[roiIndex].roi_x[3]}
            y1={currentResultData.data[roiIndex].roi_y[0]}
            y2={currentResultData.data[roiIndex].roi_y[3]}
            color={Konva.Util.getRandomColor()}
            opacity={0.5}
            text={currentResultData.data[roiIndex].description} />;
          roiList.push(currentRoi);
        }
        // we reverse the list so we print first the bottom right Roi first, to avoid tooltip overlap
        roiList.reverse();
        // load the result image in memory
        var currentImage = document.createElement('img');
        // eslint-disable-next-line
        currentImage.onload = () => // wait for the image to load to update the state
        {
          var currentResult = <Result
          name={currentResultData.name}
          data={roiList}
          image={currentImage} />;
          results.push(currentResult);
          this.setState({uri: data.uri, results: results, block: false});
        }
        currentImage.src = "data:image/png;base64," + currentResultData.image;
      }
    });
  }

  render()
  {
    const { classes } = this.props;
    return(
      <div className={classes.root}>
        <Grid container spacing={16} className={classes.container}>
          <Grid item xs={12}>
            <Grid container justify="center">
              <Grid item xs={12} justify="center">
                <Typography variant="display1">Retinal Evaluation</Typography>
              </Grid>
              {this.state.results[this.state.selection]}
            </Grid>
          </Grid>
        </Grid>
      </div>
     );
  }
}

export default withStyles(styles)(RetinalEvaluation);
