import React, { Component } from "react";
import { withStyles, Paper, Typography } from "@material-ui/core";
import { Stage, Layer, Image } from "react-konva";

const styles = theme => ({
    paper: {
      padding: theme.spacing.unit * 2,
      textAlign: 'center',
      color: theme.palette.text.secondary,
    }
  });

class Result extends Component
{
  handleClick = () => {
    console.log(this.state.name);
  }

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
    const { classes } = this.props;
    console.log(this.state.data)
    return(
      <Paper className={classes.paper}>
        <Typography variant="display1">{this.state.name}</Typography>
        <Stage width={this.state.image.width} height={this.state.image.height}>
          <Layer>
            <Image image={this.state.image} />
          </Layer>
          <Layer>
            {this.state.data}
          </Layer>
        </Stage>
      </Paper>
    );
  }
};

export default withStyles(styles)(Result);
