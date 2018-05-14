import React, { Component } from "react";
import { Stage, Layer, Line, Image } from "react-konva";
import { Configuration as CNF } from "../Configuration.js";
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  button: {
    margin: theme.spacing.unit,
  },
});

const getId = (id) => {
  var endpoint = (id) => `${CNF.DIAGNOSTIC_ENDPOINT}/${id}`
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

class PolyRoi extends Component
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

class Diagnostic extends Component
{
  state =
  {
    id: 0,
    width: 0,
    height: 0,
    notes: "",
    rois: [],
    roiCount: 0,
    diagnostic: "",
    points: [],
    roiText: "",
    addingRoi: false
  }

  constructor(props)
  {
    super(props);
    this.state.id = props.id;
  }

  componentDidMount()
  {

    getId(this.state.id).then(data =>
      {
        const image = document.createElement('img');
        image.onload = () =>
        {
          this.setState({width: image.naturalWidth, height: image.naturalHeight});
          this.setState({ image });
        }
        image.src = "data:image/png;base64," + data.image;
      });
  }

  handleMouseDown = () =>
  {
    if (this.state.addingRoi)
    {
      const stage = this.image.getStage();
      const point = stage.getPointerPosition();
      var currentPoints = this.state.points.slice();
      currentPoints.push(point.x);
      currentPoints.push(point.y);
      console.log(`x:${point.x} y:${point.y}`);
      this.setState( { points: currentPoints } );
    }
  }

  handleAddRoi = event =>
  {
    this.setState({ addingRoi: event.target.checked });
  }

  handleClearRoi = () =>
  {
    this.setState( { points: [], addingRoi: false } );
  }

  handleSaveRoi = () =>
  {
    if (this.state.addingRoi && this.state.points.length >= 6)
    {
      const id = this.state.roiCount;
      console.log(`saving roi with id ${id}`);
      const roi =
        <PolyRoi tooltip={id} text={this.state.roiText} key={id} points={this.state.points} />
      var roiList = this.state.rois;
      roiList.push(roi);
      this.setState(
        {
          rois: roiList,
          roiCount: id + 1,
          points: [],
          addingRoi: false,
          roiText: ""
        });
    }
  }

  render()
  {
    const { classes } = this.props;
    return(
      <Grid container className={classes.root} spacing={24}>
        <Grid item justify="center" xs={12}> {/* Konva div */}
        <div>
          <Stage
            width={this.state.width}
            height={this.state.height}
            onContentClick={this.handleMouseDown}
          >
            <Layer>
              <Image
                image={this.state.image}
                ref={node => (this.image = node)}
                width={this.state.width}
                height={this.state.height}
              />
            </Layer>
            <Layer>
              <Line ref="currentRoi"
                points={this.state.points}
                closed={false}
                stroke="white"
                opacity={0.5}
              />
            </Layer>
            <Layer>
              {this.state.rois}
            </Layer>
          </Stage>
        </div>
        </Grid>
        <Grid item xs={12}>
            <Grid container>
              <Grid item>
                <Paper className={classes.paper}>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.addingRoi}
                          color="primary"
                          onChange={this.handleAddRoi}
                        />}
                      label="Add new ROI"
                    />
                    <Button
                      variant="raised"
                      color="primary"
                      onClick={this.handleSaveRoi}
                      disabled={!this.state.addingRoi}
                      className={classes.button}
                    >
                      Save
                    </Button>
                    <Button
                      variant="raised"
                      color="primary"
                      onClick={this.handleClearRoi}
                      disabled={!this.state.addingRoi}
                      className={classes.button}
                    >
                      Cancel
                    </Button>
                  </FormGroup>
                  <TextField
                    color="primary"
                    disabled={!this.state.addingRoi}
                    placeholder="Notes"
                    helperText="Roi Observation"
                    value={this.state.roiText}
                  />
                </Paper>
              </Grid>
            </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Diagnostic);
