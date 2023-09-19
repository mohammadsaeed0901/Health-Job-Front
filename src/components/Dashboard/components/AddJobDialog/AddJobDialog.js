import React, { useEffect } from 'react';
import lodash from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Button from '@material-ui/core/Button';
import {Divider, IconButton} from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormLabel from '@material-ui/core/FormLabel';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { AddableInputItems } from 'components/AddableInputItems';

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  formControl2: {
    margin: theme.spacing(1),
    minWidth: 400,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 10,
    color: '#fff',
  },
  appBar: {
    position: 'relative',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  freeSolo: {
    width: 350,
    margin: theme.spacing(1),
    minWidth: 350,
    marginBottom: theme.spacing(2),
    '& > * + *': {
      marginTop: theme.spacing(3),
    },
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddJobDialog(props) {
  const classes = useStyles();
  const {handleAddJob, openJobDialog, handleAddJobDialogClose} = props;
  const [jobData, setJobData] = React.useState({});
    // const [open, setOpen] = React.useState(props.openJobDialog);
  const [loading, setLoading] = React.useState(false);

    // const handleClickOpen = () => {
    //   setOpen(true);
    // };
  
    const onChange = async(e, path) => {
      lodash.set(jobData, path, e.target.value);
    };

    const onAutoCompleteChange = async(path, values) => {
      lodash.set(jobData, path, values);
    };

    const handleAddableInputItemChange = (list, itemName) => {
      lodash.set(jobData, itemName, list);
    };
  
    return (
      <div>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Backdrop className={classes.backdrop} open={loading}>
          <CircularProgress color="inherit" />
        </Backdrop>
        <Dialog fullScreen disableBackdropClick disableEscapeKeyDown open={openJobDialog} onClose={handleAddJobDialogClose} TransitionComponent={Transition}>
          {/* <DialogTitle id="form-dialog-title">Add New Job</DialogTitle> */}
          <form className={classes.container} >
            <AppBar className={classes.appBar}>
              <Toolbar>
                <IconButton edge="start" color="inherit" onClick={handleAddJobDialogClose} aria-label="close">
                  <CloseIcon />
                </IconButton>
                <Typography variant="h6" color="inherit" className={classes.title}>
                  Add New Job
                </Typography>
                <Button autoFocus color="inherit" onClick={()=>handleAddJob(jobData)}>
                  save
                </Button>
              </Toolbar>
            </AppBar>
            <DialogContent>
              <div>
                {/* <FormControl className={classes.formControl}>
                  <TextField
                    required
                    margin="dense"
                    id="jobId"
                    name="id"
                    onChange={e => onChange(e, "id")}
                    // onChange={event => lodash.set(jobData, 'id', event.target.value)}
                    label="Id"
                    type="number"
                    variant="outlined"
                    fullWidth
                  />
                </FormControl> */}
                <FormControl className={classes.formControl}>
                  <TextField
                    required
                    margin="dense"
                    id="jobName"
                    name="name"
                    onChange={e => onChange(e, "name")}
                    // onChange={event => setParamValue(event.target.value)}
                    label="Name"
                    type="text"
                    variant="outlined"
                    fullWidth
                  />
                </FormControl>
                </div>
                <div>
                <FormControl className={classes.formControl2}>
                  <TextField
                    required
                    margin="dense"
                    id="standard-multiline-static"
                    name="desc"
                    onChange={e => onChange(e, "desc")}
                    label="Description"
                    rows={3} 
                    rowsMax={5}
                    placeholder="Job Description"
                    fullWidth
                    variant="outlined"
                    multiline
                  />
                </FormControl>
              </div>
              <Divider/>
              <div>
                <FormLabel component="legend">
                  Diag
                </FormLabel>
              </div>
              <div>
                <FormControl className={classes.formControl}>
                  <TextField
                    required
                    margin="dense"
                    id="scheme"
                    name="scheme"
                    onChange={e => onChange(e, "diag.scheme")}
                    // onChange={event => setParamValue(event.target.value)}
                    label="Scheme"
                    type="text"
                    variant="outlined"
                    fullWidth
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    required
                    margin="dense"
                    id="ip"
                    name="ip"
                    onChange={e => onChange(e, "diag.ip")}
                    // onChange={event => setParamValue(event.target.value)}
                    label="Ip"
                    type="text"
                    variant="outlined"
                    fullWidth
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    required
                    margin="dense"
                    id="port"
                    name="port"
                    onChange={e => onChange(e, "diag.port")}
                    // onChange={event => setParamValue(event.target.value)}
                    label="Port"
                    type="number"
                    variant="outlined"
                    fullWidth
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    required
                    margin="dense"
                    id="service"
                    name="service"
                    onChange={e => onChange(e, "diag.service")}
                    // onChange={event => setParamValue(event.target.value)}
                    label="Service"
                    type="text"
                    variant="outlined"
                    fullWidth
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <TextField
                    required
                    margin="dense"
                    id="service-key"
                    name="serviceKey"
                    onChange={e => onChange(e, "diag['service-key']")}
                    // onChange={event => setParamValue(event.target.value)}
                    label="Service Key"
                    type="text"
                    variant="outlined"
                    fullWidth
                  />
                </FormControl>
              </div>
              <div>
                <FormControl className={classes.freeSolo}>
                  <Autocomplete
                    multiple
                    required
                    id="containers"
                    options={[]}
                    defaultValue={[]}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} variant="filled" label="Containers" placeholder="Containers" />
                    )}
                    onChange={(e,values) => onAutoCompleteChange("diag.containers", values)}
                  />
                </FormControl>
                <FormControl className={classes.freeSolo}>
                  <Autocomplete
                    multiple
                    required
                    id="services"
                    options={[]}
                    defaultValue={[]}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} variant="filled" label="Services" placeholder="Services" />
                    )}
                    onChange={(e,values) => onAutoCompleteChange("diag.services", values)}
                  />
                </FormControl>
                <FormControl className={classes.freeSolo}>
                  <Autocomplete
                    multiple
                    required
                    id="ports"
                    options={[]}
                    defaultValue={[]}
                    freeSolo
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                      ))
                    }
                    renderInput={(params) => (
                      <TextField {...params} variant="filled" label="Ports" placeholder="Ports" />
                    )}
                    onChange={(e,values) => onAutoCompleteChange("diag.ports", values)}
                  />
                </FormControl>
              </div>
              <Divider/>
              <div>
                <FormLabel component="legend">
                  Connect
                </FormLabel>
              </div>
              <div>
                <FormControl className={classes.formControl}>
                  <AddableInputItems
                    key="connect" 
                    itemName="diag.connect"
                    defaultInputList={{"ip":'',"port":''}}
                    handleInputListChange={handleAddableInputItemChange} 
                  />
                </FormControl>
              </div>
              <Divider/>
              <div>
                <FormLabel component="legend">
                  Exist
                </FormLabel>
              </div>
              <div>
                <FormControl className={classes.formControl}>
                  <AddableInputItems
                    key="exist"
                    itemName="diag.exist" 
                    defaultInputList={{name:'',work_dir:'', type: ''}}
                    handleInputListChange={handleAddableInputItemChange} 
                    />
                </FormControl>
              </div>
              <Divider/>
              <div>
                <FormLabel component="legend">
                  Commands
                </FormLabel>
              </div>
              <div>
                <FormControl className={classes.formControl}>
                <AddableInputItems
                  key="commands"
                  itemName="diag.commands" 
                  defaultInputList={{command:'',work_dir:'', response: ''}} 
                  handleInputListChange={handleAddableInputItemChange}
                  />
                </FormControl>
              </div>
                
              <Divider/>
              <FormLabel component="legend">
                Policy
              </FormLabel>
              <div>
                <FormControl className={classes.formControl}>
                  <TextField
                    required
                    margin="dense"
                    id="policyName"
                    name="policyName"
                    onChange={e => onChange(e, "policy.name")}
                    // onChange={event => setParamValue(event.target.value)}
                    label="Policy Name"
                    type="text"
                    variant="outlined"
                    fullWidth
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                    <TextField
                      required
                      margin="dense"
                      id="retryCount"
                      name="retryCount"
                      onChange={e => onChange(e, "policy.retryCount")}
                      // onChange={event => setParamValue(event.target.value)}
                      label="Retry Count"
                      type="number"
                      variant="outlined"
                      fullWidth
                    />
                  </FormControl>
                  <FormControl className={classes.formControl}>
                      <TextField
                        required
                        margin="dense"
                        id="timeout"
                        name="timeout"
                        onChange={e => onChange(e, "policy.timeout")}
                        // onChange={event => setParamValue(event.target.value)}
                        label="Timeout"
                        type="number"
                        variant="outlined"
                        fullWidth
                      />
                  </FormControl>
                </div>
                <div>
                  <FormControl className={classes.formControl}>
                    <TextField
                      required
                      margin="dense"
                      id="scheduleInterval"
                      name="scheduleInterval"
                      onChange={e => onChange(e, "policy.schedule.interval")}
                      // onChange={event => setParamValue(event.target.value)}
                      label="Schedule Interval"
                      type="number"
                      variant="outlined"
                      fullWidth
                    />
                  </FormControl>
                  <FormControl className={classes.formControl}>
                    <TextField
                      required
                      margin="dense"
                      id="scheduleUnit"
                      name="scheduleUnit"
                      onChange={e => onChange(e, "policy.schedule.unit")}
                      // onChange={event => setParamValue(event.target.value)}
                      label="Schedule Unit"
                      type="text"
                      variant="outlined"
                      fullWidth
                    />
                  </FormControl>
              </div>
            </DialogContent>
          {/* <DialogActions>
            <Button onClick={handleAddJobDialogClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Save
            </Button>
          </DialogActions> */}
          </form>
        </Dialog>
      </div>
    );
  }