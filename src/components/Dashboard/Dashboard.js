import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from "react-router";
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import PlayCircleFilledTwoToneIcon from '@material-ui/icons/PlayCircleFilledTwoTone';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import AddIcon from '@material-ui/icons/AddTwoTone';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Tooltip from '@material-ui/core/Tooltip';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction'; 

import { TooleService as appService } from "components/_services/Toole.service";
import AddJobDialog from './components/AddJobDialog';
import DeleteJob from 'components/DeleteJob';

const useStyles = makeStyles((theme)=>({
  root: {
    width: '100%',
    height: '100%',
  },
  container: {
    maxHeight: 780, 
  },
  table: {
    minWidth: 650,
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 10,
    color: '#fff',
  },
  exampleWrapper: {
    position: 'relative',
    marginTop: theme.spacing(1),
    height: 0,
  },
  speedDial: {
    position: 'absolute',
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },
  },
  headcol2: {
    position: 'sticky',
    left: 0,
    // top: 'auto',
    background:'#fafafa',
    zIndex: theme.zIndex.drawer + 1
	  // visibility:'visible',
  },

  headcol3: {
    position: 'sticky',
    left: 0,
    // top: 'auto',
    background:'#fafafa',
    // visibility:'visible',
    zIndex: theme.zIndex.drawer + 2
  },
}));

const actions = [
  { icon: <AddIcon />, name: 'Add New Job' },
];

export default function Dashboard(props) {
  const history = useHistory();
  const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [tableData, setTableData] = useState([]);
  const [jobsStatus, setJobsStatus] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = React.useState(false);
  //speed dial
  const [open, setOpen] = React.useState(false);
  const [openJobDialog, setOpenJobDialog] = React.useState(false);

  const handleSpeedDialClose = () => {
    setOpen(false);
  };

  const handleSpeedDialOpen = () => {
    setOpen(true);
  };

  const columns = [
    { id: 'id', label: 'ID'},
    { id: 'name', label: 'Job'},
    { id: 'desc', label: 'Description'},
    { 
      id: 'status',
      label: 'Status',
      format: (value, jobName) => {
          return value ? 
          (
            <ListItemIcon>
              {loading ? 
                <CircularProgress color="inherit" size={20} /> :
                <CheckCircleIcon style={{fill: "green"}} />
              }
              
              <Tooltip
                title="checking job"
              >
                <PlayCircleFilledTwoToneIcon
                  onClick={(event) => {
                    checkJob(event, jobName);
                  }}
                  value={jobName}
                ></PlayCircleFilledTwoToneIcon>
              </Tooltip> 
            </ListItemIcon>
          )
          :
          (
            <ListItemIcon>
              {loading ? 
                <CircularProgress color="inherit" size={20} /> :
                <CancelIcon color="secondary"></CancelIcon>
              }
              <Tooltip
                title="checking job"
              >
                <PlayCircleFilledTwoToneIcon
                onClick={(event) => {
                  checkJob(event, jobName);
                }}
                value={jobName}
                >
              </PlayCircleFilledTwoToneIcon>
              </Tooltip>
            </ListItemIcon>
          )
       }
    },
  ];
  // Using useEffect to call the API once mounted and set the data
  useEffect(() => {
    (async () => {
        setLoading(true);
        try {
          const result = await appService.getAllJob();
          let data = result.data.result.map((item)=> ({...item, status:true}))
          setTableData(data);
        }
        catch(err){
            console.log(err);
        }
        monitor();
        const interval = setInterval(() => {
            monitor();
          }, 60000);
        
        return () => {
          clearInterval(interval);
          setLoading(false);
        }
    })();
  }, [reload]);

  const monitor = async() => {
    try {
        setLoading(true);
        let result = await appService.monitor();
        result = result.data.result;
        const jobsStatusTemp = [];
        for (const job of result){
          // jobsStatusTemp[job.name] = job.results.every((item)=>{return item.result === 0});
          setTableData((prevState)=>{
              let objIndex = prevState.findIndex((obj => obj.name === job.name));
              if (objIndex !== -1){
                  prevState[objIndex].status = job.results.every((item)=>{return item.result === 0});
              }
              return prevState;
          });  
        }
        setJobsStatus(jobsStatusTemp); 
        // setMonitorData();
      }
      catch(err){
          console.log(err);
      }
      setLoading(false);
  };

  const checkJob = async(event, jobName) => {
    event.preventDefault();
    event.stopPropagation();
    setLoading(true);
    try {
      let result = await appService.checkJob(jobName);
      setTableData((prevState)=>{
        let objIndex = prevState.findIndex((obj => obj.name === jobName));
        if (objIndex !== -1 && result.data.result.results){
          prevState[objIndex].status = result.data.result.results.every((item)=>{return item.result === 0});
        }
        return prevState;
    });

    }
    catch(err){
      console.log(err);
    };
    setLoading(false);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const redirectToJobPage = (event) => {
    // event.preventDefault(); 
    // event.stopPropagation();
    let jobName = event.target.getAttribute('value');
    if (jobName) {
      const AppUrl = `/job/`+ jobName;
    history.push(AppUrl);
    return <Redirect to={AppUrl}/>
    }
  }

  const handleReloadJobList = () => {
    setReload(!reload);

  };

  const openAddJobDialog = () => {
    setOpenJobDialog(true);
  };

  const handleAddJobDialogClose = () => {
    setOpenJobDialog(false);
  };
  

  const handleAddJob = async(jobData) => {
    setOpenJobDialog(false);
    setLoading(true);
    try {
      await appService.addJob(jobData);
      handleReloadJobList(); 
    } catch (error) {
      console.log('error');
    }
    setLoading(false);
  };

  return (
    <div>
      <Backdrop className={classes.backdrop} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell 
                  align="left" 
                  // className={classes.headcol3}
                />
                {columns.map((column, index) => (
                  <TableCell
                    key={index}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}  onClick={redirectToJobPage} value={row.id}>
                    <TableCell width={10} 
                    // className={classes.headcol2}
                    >
                        <ListItemIcon>
                          <DeleteJob
                            jobName={row.name}
                            jobId={row.id}
                            reloadJobList={handleReloadJobList}
                          />
                        </ListItemIcon>                      
                    </TableCell>
                    {columns.map((column, index) => {
                      const value = row[column.id];
                      return (
                        <TableCell 
                          key={index} 
                          align={column.align} 
                          value={row.name}
                          style={
                            { minWidth: column.minWidth, 
                              whiteSpace: 'normal',
                              wordWrap: 'break-word' 
                            }
                          }
                        >
                          {column.format ? column.format(value, row['name']) : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TableFooter>
            <TableRow>
              <TableCell>
                <TablePagination
                  rowsPerPageOptions={[10, 25, 100]}
                  component="div"
                  count={tableData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                />
              </TableCell>
            </TableRow>
        </TableFooter>
      </Paper>
      <div className={classes.exampleWrapper}>
        <SpeedDial
          ariaLabel="SpeedDial example"
          className={classes.speedDial}
          icon={<SpeedDialIcon />}
          onClose={handleSpeedDialClose}
          onOpen={handleSpeedDialOpen}
          open={open}
          direction={"up"}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={openAddJobDialog}
            />
          ))}
        </SpeedDial>
      </div>
      <AddJobDialog
        openJobDialog={openJobDialog}
        handleAddJob={handleAddJob}
        handleAddJobDialogClose={handleAddJobDialogClose}
      />
    </div>
  );
}
