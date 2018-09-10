import { Paper } from '@material-ui/core';
import Chip from '@material-ui/core/Chip';
import MenuItem from '@material-ui/core/MenuItem';
import NoSsr from '@material-ui/core/NoSsr';
import { withStyles } from '@material-ui/core/styles';
import { emphasize } from '@material-ui/core/styles/colorManipulator';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import CreatableSelect from 'react-select/lib/Creatable';


const styles = theme => ({
  chip: {
    margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08,
    ),
  },
  input: {
    display: 'flex',
    padding: 0,
  },
  noOptionsMessage: {
    fontSize: 14,
    padding: `${theme.spacing.unit}px ${theme.spacing.unit * 2}px`,
  },
  paper: {
    left: 0,
    marginTop: theme.spacing.unit,
    position: 'absolute',
    right: 0,
    zIndex: 1,
  },
  placeholder: {
    fontSize: 14,
    left: 2,
    position: 'absolute',
  },
  singleValue: {
    fontSize: 14,
  },
  valueContainer: {
    alignItems: 'center',
    display: 'flex',
    flex: 1,
    flexWrap: 'wrap',
  },
});

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  return (
    <TextField
      fullWidth
      InputProps={{
        inputComponent,
        inputProps: {
          children: props.children,
          className: props.selectProps.classes.input,
          inputRef: props.innerRef,
          ...props.innerProps,
        },
      }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  return (
    <MenuItem
      buttonRef={props.innerRef}
      selected={props.isFocused}
      component="div"
      style={{
        fontWeight: props.isSelected ? 500 : 400,
      }}
      {...props.innerProps}
    >
      {props.children}
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.placeholder}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
      {props.children}
    </Typography>
  );
}

function ValueContainer(props) {
  return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused,
      })}
      onDelete={event => {
        props.removeProps.onClick();
        props.removeProps.onMouseDown(event);
      }}
    />
  );
}


function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer,
};

const fromMultiAutocompleteData = (values) => {
  return values.map(value => value.value);
}


const toSingleAutocompleteData = (value) => {
  return { value: value, label: value };
}

const fromSingleAutocompleteData = (value) => {
  return value.value;
}

class Autocomplete extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <NoSsr>
        {this.props.single ?
          <CreatableSelect
            textFieldProps={{
              InputLabelProps: { shrink: true, },
              disabled: this.props.disabled,
              label: this.props.label,
            }}
            classes={classes}
            options={this.props.suggestions}
            components={components}
            value={toSingleAutocompleteData(this.props.selection)}
            onChange={(value) => this.props.onChange(fromSingleAutocompleteData(value))}
            placeholder={this.props.placeholder}
          />
          :
          <CreatableSelect
            textFieldProps={{
              InputLabelProps: {
                shrink: true,
              },
              disabled: this.props.disabled,
              label: this.props.label,
            }}
            classes={classes}
            options={this.props.suggestions}
            components={components}
            value={this.props.toMultiAutocompleteData(this.props.selection)}
            onChange={(value) => this.props.onChange(fromMultiAutocompleteData(value))}
            placeholder={this.props.placeholder}
            isMulti
          />
        }
      </NoSsr>
    );
  }
}

Autocomplete.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

Autocomplete.defaultProps = {
  toMultiAutocompleteData: (values) => values.map(value => ({ value: value, label: value })),
}

export default withStyles(styles, {withTheme: true})(Autocomplete);
