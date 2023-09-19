import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Brightness1Icon from '@material-ui/icons/Brightness1';
import { green, red } from '@material-ui/core/colors';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Input from "@material-ui/core/Input";
import { ListItemIcon, IconButton } from '@material-ui/core';
import EditIcon from "@material-ui/icons/EditOutlined";
import SaveIcon from '@material-ui/icons/Save';
import CancelIcon from "@material-ui/icons/Cancel";
import lodash from 'lodash'
import { TooleService as appService } from "components/_services/Toole.service";
import { MainTab } from "./components";


const useStyles = makeStyles((theme)=>({
  root: {
    width: '100%',
    height: '100%',
  },
  container: {
    maxHeight: 790,
  },
  table: {
    minWidth: 650,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 10,
    color: '#fff',
  },
  fiftyColumn: {
    flexBasis: '50%',
  },
  editButton: {
    // position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    color: theme.palette.common.white,
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[600],
    },
  },
  saveButton: {
    // position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    color: theme.palette.common.white,
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[600],
    },
  },
  cancelButton: {
    // position: 'absolute',
    bottom: theme.spacing(2),
    right: theme.spacing(2),
    color: theme.palette.common.white,
    backgroundColor: red[600],
    '&:hover': {
      backgroundColor: red[700],
    },
  },
}));

export default function Job() {

  const classes = useStyles();
  const [jobData, setJobData] = useState({});
  const [editedJobData, setEditedJobData] = useState({});
  const [jobMonitorResult, setJobMonitorResult] = useState({});
  const [loading, setLoading] = React.useState(false);
  const [jobsStatus, setJobsStatus] = useState();
  const [editMode, setEditMode] = useState();
  const [reload, setReload] = useState(false);
  const {jobName} = useParams();
  
  // Using useEffect to call the API once mounted and set the data
  useEffect(() => {
    (async () => {
        setLoading(true);
        try {
          // get job data
          const result = await appService.getSpecificJob(jobName);
          let tempResult = result.data.result[0];
          setJobData(tempResult);

          delete tempResult.policy.schedule.startTime;
          delete tempResult.policy.schedule.sec;
          setEditedJobData(tempResult);
        
        }
        catch(err){
            console.log(err);
        }

        // job monitor
        monitor();
        const interval = setInterval(() => {
          monitor();
        }, 60000);
        return () => {
          clearInterval(interval);
          setLoading(false);
        }
    })();
  }, []);

  const monitor = async() => {
    try {
        setLoading(true);
        let monitorResult = await appService.monitor();
        monitorResult = (monitorResult && monitorResult.data && monitorResult.data.result) ? monitorResult.data.result : [];
        let jobMonitorIndex = monitorResult.findIndex((obj => obj.name === jobName));
        let jobMonitorResultTemp = jobMonitorIndex !== -1 ? monitorResult[jobMonitorIndex] : {};
        setJobMonitorResult(jobMonitorResultTemp);
        if(jobMonitorResultTemp.results){
          setJobsStatus(jobMonitorResultTemp.results.every((item)=>{return item.result === 0})); 
        }
      }
      catch(err){
          console.log(err);
      }
      setLoading(false);
  };

  const onChange = async(e, path) => {
    lodash.set(editedJobData, path, e.target.value);
  };

  const onAutoCompleteChange = async(path, values) => {
    lodash.set(editedJobData, path, values);
  };

  const onToggleEditButton = () => {
    setEditMode(true);
  };

  const onToggleCancelButton = () => {
    setEditedJobData(jobData);
    setEditMode(false);
  };

  const onToggleSaveButton = async() => {
    setLoading(true);
    try {
      let result = await appService.updateJob(jobData.id, editedJobData);
      setJobData(result.data.result);
      setEditedJobData(result.data.result);
      // setReload(!reload);
      
    }
    catch(err){
      console.log(err);
    };
    setEditMode(false);
    setLoading(false);
  };

  return (
    <div>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Container component="main" className={classes.container}>
        <Typography variant="overline" gutterBottom align= "left">
            <b>Job Monitoring </b>
        </Typography>
        <div className={classes.fiftyColumn} align="left">
        <Typography variant="subtitle2" gutterBottom align= "left">
          <b>Job Id: {jobData.id} </b>
        </Typography>
        <Typography variant="subtitle2" gutterBottom align= "left">
        <b>Job Name: </b>
        {editMode ? 
            (
              <Input
                defaultValue={jobData.name}
                name="jobName"
                onChange={e => onChange(e, "name")}
                className={classes.input}
              /> 
            ) : 
            (
              jobData.name
            )
          }
        </Typography>
        <Typography variant="subtitle2" gutterBottom align= "left">
          <b>Job Status: </b> 
          { loading ?
          <CircularProgress size={10} /> :
          (jobsStatus ? 
            (<Brightness1Icon style={{ color: green[500] }} fontSize="inherit"></Brightness1Icon>) : 
            (<Brightness1Icon style={{ color: red[500] }} fontSize="inherit"></Brightness1Icon>)
          )
          }
        </Typography>
        </div>
        <div className={classes.fiftyColumn} align="right">
          {!editMode ? 
            <IconButton
              aria-label="edit"
              className={classes.editButton}
              onClick={onToggleEditButton}
            >
              <EditIcon />
            </IconButton>
            :
            <ListItemIcon>
              <IconButton
                aria-label="save"
                className={classes.saveButton}
                onClick={onToggleSaveButton}
              >
                <SaveIcon />
              </IconButton>
              <IconButton
                aria-label="revert"
                className={classes.cancelButton}
                onClick={onToggleCancelButton}
              >
                <CancelIcon />
              </IconButton>
            </ListItemIcon>
          }
          
        </div>
        
        <MainTab
          key="mainTab" 
          jobData={jobData} 
          jobMonitorResult={jobMonitorResult} 
          onChange={onChange}
          onAutoCompleteChange={onAutoCompleteChange}
          editMode={editMode}
        />
        
      </Container>
      {/* <Fab aria-label='Edit' className={classes.fab} color="inherit">
        <EditIcon />
      </Fab> */}
    </div>
  );
}
