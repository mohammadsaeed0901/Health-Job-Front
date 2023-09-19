import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from "@material-ui/icons/DeleteOutline";
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import {IconButton} from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';

import { TooleService as appService } from "components/_services/Toole.service";

const useStyles = makeStyles((theme) => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 10,
    color: '#fff',
  },
}));

export default function DeleteJob(props) {
    const classes = useStyles();
    const { jobId, jobName, reloadJobList } = props;
    const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const handleDeleteClick = async() => {
      setOpenConfirmDelete(true);
    };


    const closeDeleteConfirm = () => {
      setOpenConfirmDelete(false);
    };

    const handleDeleteJob = async() => {
      try {
        setLoading(true);
        await appService.deleteJob(jobId);
        reloadJobList(); 
      } catch (error) {
        console.log(error);
      }
      setOpenConfirmDelete(false);
      setLoading(false);
    };
  
    return (
      <>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <IconButton
        aria-label="delete"
        onClick={handleDeleteClick}
      >
        <DeleteIcon fontSize="small"/>
      </IconButton>
      <Dialog
        open={openConfirmDelete}
        onClose={closeDeleteConfirm}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Warning!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {"Are you sure you want to delete this job?"}
          </DialogContentText>
          <DialogContentText style={{"fontWeight":"bold"}}>  
            {jobName}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteJob} color="primary">
            Yes
          </Button>
          <Button onClick={closeDeleteConfirm} color="primary"  autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
      </>
    );
  }