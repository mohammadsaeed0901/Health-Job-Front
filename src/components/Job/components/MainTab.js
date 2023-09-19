import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views'; 
import { makeStyles, useTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Input from "@material-ui/core/Input";
import CircularProgress from '@material-ui/core/CircularProgress';
import lodash from 'lodash'

// acardion
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Brightness1Icon from '@material-ui/icons/Brightness1';
import { green, red } from '@material-ui/core/colors';
import { AddableInputItems } from 'components/AddableInputItems';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Chip, List, ListItem, ListItemText, TextField } from '@material-ui/core';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={4}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    height: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  fiftyColumn: {
    flexBasis: '50%',
  },
  onThirdColumn: {
    flexBasis: '33%',
  },
  helper: {
    borderLeft: `2px solid ${theme.palette.divider}`,
    padding: theme.spacing(1, 2),
  },
  input: {
    width: 300,
    height: 40
  },
}));

export default function MainTab(props) {
  const {jobData, jobMonitorResult, editMode, onChange, onAutoCompleteChange} = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mainTabvalue, setMainTabvalue] = useState(0);
  const [subTabvalue, setSubTabvalue] = useState(0);

  const handleMainTabChange = (event, newValue) => {
    setMainTabvalue(newValue);
  };

  const handleMainTabChangeIndex = (index) => {
    setMainTabvalue(index);
  };

  const handleSubTabChange = (event, newValue) => {
    setSubTabvalue(newValue);
  };

  const handleSubTabChangeIndex = (index) => {
    setSubTabvalue(index);
  };

  const itemMonitorStatus = (jobMonitorResult, item) => {
    let result = {};
    let index = jobMonitorResult.results.findIndex((obj=>(obj.address.indexOf(item) !== -1)));
    result = index !== -1 ? jobMonitorResult.results[index] : {};
    
    if (result) {
      if (!result.result){
        return (<Brightness1Icon style={{ color: green[400] }} fontSize="small"></Brightness1Icon>);
      }
      else {
        return (<Brightness1Icon style={{ color: red[400] }} fontSize="small"></Brightness1Icon>);
      }
    }
    return;
  };
  const tabStatus = (jobMonitorResult, item) => {
    let result = {};
    let tabMonitorResult = jobMonitorResult.results.filter((obj=>(obj.address.indexOf(item) !== -1)));
    result = tabMonitorResult.every((item)=>{return item.result === 0})
    // result = index !== -1 ? jobMonitorResult.results[index] : {};
    
    if (result) {
      return (<Brightness1Icon style={{ color: green[300] }} fontSize="small"></Brightness1Icon>);
    }
    else {
      return (<Brightness1Icon style={{ color: red[300] }} fontSize="small"></Brightness1Icon>);
    }
  };

  const itemMonitorResult = (jobMonitorResult, item) => {
    let result = {};
    // let containerIndex = jobMonitorResult.results.findIndex((obj=>(obj.address.substring(obj.address.lastIndexOf("/") + 1) === item)));
    let itemIndex = jobMonitorResult.results.findIndex((obj=>(obj.address.indexOf(item) !== -1)));
    result = itemIndex !== -1 ? jobMonitorResult.results[itemIndex] : {};
    if (! lodash.isEmpty(result)) {
      return (
      <>
        <AccordionDetails>
          <Typography component={'span'} variant="subtitle2" gutterBottom align= "left">
              <b>{"Status Code: "}</b>
              {result.statusCode}
          </Typography>
        </AccordionDetails>
        <Divider />
        <AccordionDetails>
          <Typography component={'span'} variant="subtitle2" gutterBottom align= "left">
              <b>{"Message: "}</b>
              {result.message.replace(/\\|\"/g, "")}
              {/* {JSON.stringify(containerResult.message.replace(/\\|\"/g, ""),null, 2)} */}
              {/* {containerResult.message.replace(/\\/g, "")} */}
          </Typography>
        </AccordionDetails>
        <Divider />
        <AccordionDetails>
          <Typography component={'span'} variant="subtitle2" gutterBottom align= "left">
              <b>{"Response: "}</b>
              {result.response}
              {/* <div><pre>{JSON.stringify(JSON.parse(containerResult.response.replace(/\\|\"/g, "")),null, 2)}</pre></div> */}
          </Typography>
        </AccordionDetails>
      </>
      )
    }
    else {
      return "...";
    }
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default">
        <Tabs
          value={mainTabvalue}
          onChange={handleMainTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Overview" {...a11yProps(0)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={mainTabvalue}
        onChangeIndex={handleMainTabChangeIndex}
      >
        <TabPanel value={mainTabvalue} index={0} dir={theme.direction}>
          {/* <div> */}
          <Typography variant="subtitle2" gutterBottom align= "left">
            <b>{"Scheme: "}</b> 
            {
              jobData &&
              typeof(jobData.diag) !== 'undefined' && 
              typeof(jobData.diag.scheme) !== 'undefined' ? 
              (editMode ?
                (
                  <Input
                    defaultValue={jobData.diag.scheme}
                    name="jobDiagScheme"
                    onChange={e => onChange(e, "diag.scheme")}
                    className={classes.input}
                  /> 
                ) : 
                (
                jobData.diag.scheme
                )
              )  
              :
              <CircularProgress size={10} />
            }
          </Typography>
          <Typography variant="subtitle2" gutterBottom align= "left">
            <b>{"IP: "}</b> 
            {
              jobData &&
              typeof(jobData.diag) !== 'undefined' && 
              typeof(jobData.diag.ip) !== 'undefined' ? 
              (editMode ?
                (
                  <Input
                    key="jobDiagIp"
                    defaultValue={jobData.diag.ip}
                    name="jobDiagIp"
                    onChange={e => onChange(e, "diag.ip")}
                    className={classes.input}
                  /> 
                ) : 
                (
                jobData.diag.ip
                )
              )  
              :
              <CircularProgress size={10} />
            }
          </Typography>
          <Typography variant="subtitle2" gutterBottom align= "left">
              <b>{"Port: "}</b> 
              {
              jobData &&
              typeof(jobData.diag) !== 'undefined' && 
              typeof(jobData.diag.port) !== 'undefined' ? 
              (editMode ?
                (
                  <Input
                    key= "jobDiagPort"
                    defaultValue={jobData.diag.port}
                    name="jobDiagPort"
                    onChange={e => onChange(e, "diag.port")}
                    className={classes.input}
                  /> 
                ) : 
                (
                jobData.diag.port
                )
              )  
              :
              <CircularProgress size={10} />
            }
          </Typography>
          <Typography variant="subtitle2" gutterBottom align= "left">
              <b>{"Service: "}</b> 
              {
              jobData &&
              typeof(jobData.diag) !== 'undefined' && 
              typeof(jobData.diag.service) !== 'undefined' ? 
              (editMode ?
                (
                  <Input
                    key="jobDiagService"
                    defaultValue={jobData.diag.service}
                    name="jobDiagService"
                    onChange={e => onChange(e, "diag.service")}
                    className={classes.input}
                  /> 
                ) : 
                (
                jobData.diag.service
                )
              )  
              :
              <CircularProgress size={10} />
            }
          </Typography>    
          <Typography variant="subtitle2" gutterBottom align= "left">
              <b>{"Service Key: "}</b> 
              {
              jobData &&
              typeof(jobData.diag) !== 'undefined' && 
              typeof(jobData.diag["service-key"]) !== 'undefined' ? 
              (editMode ?
                (
                  <Input
                    key="jobDiagServiceKey"
                    defaultValue={jobData.diag["service-key"]}
                    name="jobDiagServiceKey"
                    onChange={e => onChange(e, "diag['service-key']")}
                    className={classes.input}
                  /> 
                ) : 
                (
                jobData.diag["service-key"]
                )
              )  
              :
              <CircularProgress size={10} />
            }
          </Typography>    
          <Typography variant="subtitle2" gutterBottom align= "left">
              <b>{"Description: "}</b> 
              {
              jobData &&
              typeof(jobData.desc) !== 'undefined' ? 
              (editMode ?
                (
                  <Input
                    defaultValue={jobData.desc}
                    name="desc"
                    onChange={e => onChange(e, "desc")}
                    className={classes.input}
                  /> 
                ) : 
                (
                jobData.desc
                )
              )  
              :
              <CircularProgress size={10} />
            }
          </Typography>
          <Divider />

          <div className={classes.root}>
              <AppBar position="static" color="default">
                  <Tabs
                  value={subTabvalue}
                  onChange={handleSubTabChange}
                  indicatorColor="primary"
                  textColor="primary"
                  variant="fullWidth"
                  aria-label="full width tabs example">
                    <Tab 
                      label="Containers" 
                      icon={
                        (typeof(jobMonitorResult) !== 'undefined' &&
                        typeof(jobMonitorResult.results) !== 'undefined' &&
                        jobMonitorResult.results) ? 
                        tabStatus(jobMonitorResult, '/container') : 
                          <CircularProgress size={10} />
                      }
                      {...a11yProps(0)}
                    >
                    
                    </Tab>
                    <Tab 
                      label="Services" 
                      {...a11yProps(1)}
                      icon={
                        (typeof(jobMonitorResult) !== 'undefined' &&
                        typeof(jobMonitorResult.results) !== 'undefined' &&
                        jobMonitorResult.results) ? 
                        tabStatus(jobMonitorResult, '/service') : 
                          <CircularProgress size={10} />
                      } 
                    />
                    <Tab 
                      label="Ports" 
                      {...a11yProps(2)}
                      icon={
                        (typeof(jobMonitorResult) !== 'undefined' &&
                        typeof(jobMonitorResult.results) !== 'undefined' &&
                        jobMonitorResult.results) ? 
                        tabStatus(jobMonitorResult, '/port') : 
                          <CircularProgress size={10} />
                      } 
                    />
                    <Tab 
                      label="Logs" 
                      {...a11yProps(3)}
                      icon={
                        (typeof(jobMonitorResult) !== 'undefined' &&
                        typeof(jobMonitorResult.results) !== 'undefined' &&
                        jobMonitorResult.results) ? 
                        tabStatus(jobMonitorResult, 'log/docker/10') : 
                          <CircularProgress size={10} />
                      } 
                    />
                    <Tab label="Connect" {...a11yProps(4)} />
                    <Tab label="Exist" {...a11yProps(5)} />
                    <Tab label="Commands" {...a11yProps(6)} />
                  </Tabs>
              </AppBar>
              <SwipeableViews
                  axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                  index={subTabvalue}
                  onChangeIndex={handleSubTabChangeIndex}
              >
                  <TabPanel value={subTabvalue} index={0} dir={theme.direction}>
                  {/* <Typography className={classes.root}> */}
                  <div className={classes.root}>
                      {
                          typeof(jobData.diag) !== 'undefined' && 
                          typeof(jobData.diag.containers) !== 'undefined' && 
                          jobData.diag.containers ? 
                          (
                            editMode ? 
                              <Autocomplete
                              multiple
                              required
                              id="containers"
                              options={[]}
                              defaultValue={jobData.diag.containers}
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
                          :
                          jobData.diag.containers.map((item)=>{
                              return (
                                <Accordion key={item}>
                                    <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                    >
                                    <div className={classes.fiftyColumn} align="left" >
                                      {
                                        item
                                      }
                                    </div>
                                    {/* <Typography component={'span'} className={classes.heading}>
                                    </Typography> */}
                                    <div className={classes.fiftyColumn} align="right">
                                      {
                                        (typeof(jobMonitorResult) !== 'undefined' &&
                                        typeof(jobMonitorResult.results) !== 'undefined' &&
                                        jobMonitorResult.results) ? 
                                          itemMonitorStatus(jobMonitorResult, 'container/' + item) : 
                                          <CircularProgress size={10} />
                                      }
                                    </div>
                                    </AccordionSummary>
                                      {
                                        (typeof(jobMonitorResult) !== 'undefined' &&
                                        typeof(jobMonitorResult.results) !== 'undefined' &&
                                        jobMonitorResult.results) ? 
                                          itemMonitorResult(jobMonitorResult, 'container/' + item) : 
                                          <CircularProgress size={10} />
                                      }
                                </Accordion>
                              );
                          })):
                          <Typography component={'span'} align="left" variant="subtitle2" gutterBottom>
                            no container
                          </Typography>
                      }
                  </div>
                  {/* </Typography>   */}
                  </TabPanel>
                  <TabPanel value={subTabvalue} index={1} dir={theme.direction}>
                    <div className={classes.root}>
                      {(typeof(jobData.diag) !== 'undefined' && 
                        typeof(jobData.diag.services) !== 'undefined' &&
                        jobData.diag.services) 
                        ?
                        (
                          editMode ? 
                            <Autocomplete
                            multiple
                            required
                            id="containers"
                            options={[]}
                            defaultValue={jobData.diag.services}
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
                        :
                        jobData.diag.services.map((item) => 
                          (
                            <Accordion  key={item}>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                >
                                <div className={classes.fiftyColumn} align="left" >
                                  {
                                    item
                                  }
                                </div>
                                <div className={classes.fiftyColumn} align="right">
                                  {
                                    (typeof(jobMonitorResult) !== 'undefined' &&
                                    typeof(jobMonitorResult.results) !== 'undefined' &&
                                    jobMonitorResult.results) ? 
                                      itemMonitorStatus(jobMonitorResult, 'service/'+ item) : 
                                      <CircularProgress size={10} />
                                  }
                                </div>
                                </AccordionSummary>
                                  {
                                    (typeof(jobMonitorResult) !== 'undefined' &&
                                    typeof(jobMonitorResult.results) !== 'undefined' &&
                                    jobMonitorResult.results) ? 
                                      itemMonitorResult(jobMonitorResult, 'service/'+ item) : 
                                      <CircularProgress size={10} />
                                  }
                            </Accordion>
                          ))) : 
                        <Typography align="left" variant="subtitle2" gutterBottom>
                          no services
                        </Typography>
                      }
                    </div>
                  </TabPanel>
                  <TabPanel key={2} value={subTabvalue} index={2} dir={theme.direction}>
                    {(typeof(jobData.diag) !== 'undefined' && 
                      typeof(jobData.diag.ports) !== 'undefined' &&
                      jobData.diag.ports) 
                      ?
                      (
                        editMode ? 
                          <Autocomplete
                          multiple
                          required
                          id="containers"
                          options={[]}
                          defaultValue={jobData.diag.ports}
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
                      :
                      jobData.diag.ports.map(item => (
                        <Accordion  key={item}>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            >
                            <div className={classes.fiftyColumn} align="left" >
                              {
                                item
                              }
                            </div>
                            <div className={classes.fiftyColumn} align="right">
                              {
                                (typeof(jobMonitorResult) !== 'undefined' &&
                                typeof(jobMonitorResult.results) !== 'undefined' &&
                                jobMonitorResult.results) ? 
                                  itemMonitorStatus(jobMonitorResult, 'port/'+ item) : 
                                  <CircularProgress size={10} />
                              }
                            </div>
                            </AccordionSummary>
                              {
                                (typeof(jobMonitorResult) !== 'undefined' &&
                                typeof(jobMonitorResult.results) !== 'undefined' &&
                                jobMonitorResult.results) ? 
                                  itemMonitorResult(jobMonitorResult, 'port/'+ item) : 
                                  <CircularProgress size={10} />
                              }
                        </Accordion>
                      ))) : 
                      <Typography align="left" variant="subtitle2" gutterBottom>
                        no ports
                      </Typography>
                    }
                  </TabPanel>
                  <TabPanel key={3} value={subTabvalue} index={3} dir={theme.direction}>
                    <Accordion>
                      <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      >
                      <div className={classes.fiftyColumn} align="left" >
                        log docker - 10 last request
                      </div>
                      <div className={classes.fiftyColumn} align="right">
                        {
                          (typeof(jobMonitorResult) !== 'undefined' &&
                          typeof(jobMonitorResult.results) !== 'undefined' &&
                          jobMonitorResult.results) ? 
                            itemMonitorStatus(jobMonitorResult, 'log/docker/10') : 
                            <CircularProgress size={10} />
                        }
                      </div>
                      </AccordionSummary>
                        {
                          (typeof(jobMonitorResult) !== 'undefined' &&
                          typeof(jobMonitorResult.results) !== 'undefined' &&
                          jobMonitorResult.results) ? 
                            itemMonitorResult(jobMonitorResult, 'log/docker/10') : 
                            <CircularProgress size={10} />
                        }
                    </Accordion>
                  </TabPanel>
                  <TabPanel key={4} value={subTabvalue} index={4} dir={theme.direction}>
                  {(typeof(jobData.diag) !== 'undefined' && 
                      typeof(jobData.diag.connect) !== 'undefined' &&
                      jobData.diag.connect) 
                      ?
                      jobData.diag.connect.map(item => (
                        <List dense>
                          <ListItem>
                            <ListItemText
                              primary="ip"
                              secondary={item.ip}
                            >
                            </ListItemText>
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Port"
                              secondary={item.port}
                            >
                          </ListItemText>
                          </ListItem>
                        </List>
                        // <Accordion>
                        //     <AccordionSummary
                        //     expandIcon={<ExpandMoreIcon />}
                        //     aria-controls="panel1a-content"
                        //     id="panel1a-header"
                        //     >
                        //     <div className={classes.fiftyColumn} align="left" >
                        //       {
                        //         item
                        //       }
                        //     </div>
                        //     <div className={classes.fiftyColumn} align="right">
                        //       {
                        //         (typeof(jobMonitorResult) !== 'undefined' &&
                        //         typeof(jobMonitorResult.results) !== 'undefined' &&
                        //         jobMonitorResult.results) ? 
                        //           itemMonitorStatus(jobMonitorResult, 'connect/'+ item) : 
                        //           <CircularProgress size={10} />
                        //       }
                        //     </div>
                        //     </AccordionSummary>
                        //       {
                        //         (typeof(jobMonitorResult) !== 'undefined' &&
                        //         typeof(jobMonitorResult.results) !== 'undefined' &&
                        //         jobMonitorResult.results) ? 
                        //           itemMonitorResult(jobMonitorResult, 'connect/'+ item) : 
                        //           <CircularProgress size={10} />
                        //       }
                        // </Accordion>
                      )) : 
                      <Typography component={'span'} align="left" variant="subtitle2" gutterBottom>
                        no data
                      </Typography>
                      }
                  </TabPanel>
                  <TabPanel key={5} value={subTabvalue} index={5} dir={theme.direction}>
                  {(typeof(jobData.diag) !== 'undefined' && 
                      typeof(jobData.diag.exist) !== 'undefined' &&
                      jobData.diag.exist) 
                      ?
                      jobData.diag.exist.map(item => (
                        <List dense>
                          <ListItem>
                            <ListItemText
                              primary="Name"
                              secondary={item.name}
                            >
                            </ListItemText>
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Work Directory"
                              secondary={item['work-dir']}
                            >
                          </ListItemText>
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Type"
                              secondary={item.type}
                            >
                          </ListItemText>
                          </ListItem>
                        </List>
                        // <Accordion key={item}>
                        //   <AccordionSummary
                        //   expandIcon={<ExpandMoreIcon />}
                        //   aria-controls="panel1a-content"
                        //   id="panel1a-header"
                        //   >
                        //   <div className={classes.fiftyColumn} align="left" >
                        //     {
                        //       item
                        //     }
                        //   </div>
                        //   <div className={classes.fiftyColumn} align="right">
                        //     {
                        //       (typeof(jobMonitorResult) !== 'undefined' &&
                        //       typeof(jobMonitorResult.results) !== 'undefined' &&
                        //       jobMonitorResult.results) ? 
                        //         itemMonitorStatus(jobMonitorResult, 'exist/'+ item) : 
                        //         <CircularProgress size={10} />
                        //     }
                        //   </div>
                        //   </AccordionSummary>
                        //     {
                        //       (typeof(jobMonitorResult) !== 'undefined' &&
                        //       typeof(jobMonitorResult.results) !== 'undefined' &&
                        //       jobMonitorResult.results) ? 
                        //         itemMonitorResult(jobMonitorResult, 'exist/'+ item) : 
                        //         <CircularProgress size={10} />
                        //     }
                        // </Accordion>
                      )) : 
                      <Typography component={'span'} align="left" variant="subtitle2" gutterBottom>
                        no data
                      </Typography>
                  }
                  </TabPanel>
                  <TabPanel key={6} value={subTabvalue} index={6} dir={theme.direction}>
                    {(typeof(jobData.diag) !== 'undefined' && 
                      typeof(jobData.diag.commands) !== 'undefined' &&
                      jobData.diag.commands) 
                      ?
                      jobData.diag.commands.map(item => (
                        <List dense>
                          <ListItem>
                            <ListItemText
                              primary="Command"
                              secondary={item.command}
                            >
                            </ListItemText>
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Work Directory"
                              secondary={item['work-dir']}
                            >
                          </ListItemText>
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              primary="Response"
                              secondary={item.type}
                            >
                          </ListItemText>
                          </ListItem>
                        </List>
                      //   <Accordion  key={item}>
                      //     <AccordionSummary
                      //     expandIcon={<ExpandMoreIcon />}
                      //     aria-controls="panel1a-content"
                      //     id="panel1a-header"
                      //     >
                      //     <div className={classes.fiftyColumn} align="left" >
                      //       {
                      //         item
                      //       }
                      //     </div>
                      //     <div className={classes.fiftyColumn} align="right">
                      //       {
                      //         (typeof(jobMonitorResult) !== 'undefined' &&
                      //         typeof(jobMonitorResult.results) !== 'undefined' &&
                      //         jobMonitorResult.results) ? 
                      //           itemMonitorStatus(jobMonitorResult, 'execute/'+ item) : 
                      //           <CircularProgress size={10} />
                      //       }
                      //     </div>
                      //     </AccordionSummary>
                      //       {
                      //         (typeof(jobMonitorResult) !== 'undefined' &&
                      //         typeof(jobMonitorResult.results) !== 'undefined' &&
                      //         jobMonitorResult.results) ? 
                      //           itemMonitorResult(jobMonitorResult, 'execute/'+ item) : 
                      //           <CircularProgress size={10} />
                      //       }
                      // </Accordion>
                      )) : 
                      <Typography component={'span'} align="left" variant="subtitle2" gutterBottom>
                        no data</Typography>
                    }
                  </TabPanel>
              </SwipeableViews>
          </div>
          
          {/* <Divider /> */}
          <Typography 
            align="left" 
            variant="h3" 
            color="textSecondary" 
            gutterBottom
            paragraph
          >
              Policy
          </Typography>
          {/* <Grid> */}
            <Typography align="left" variant="subtitle2" gutterBottom>
                <b>{"Name: "}</b> 
                {
                  typeof(jobData.policy) !== 'undefined' && 
                  typeof(jobData.policy.name) !== 'undefined' ? 
                  (editMode ?
                    (
                      <Input
                        defaultValue={jobData.policy.name}
                        name="jobPolicyName"
                        onChange={e => onChange(e, "policy.name")}
                        className={classes.input}
                      /> 
                    ) : 
                    (
                      jobData.policy.name
                    )
                  )  
                  :
                  <CircularProgress size={10} />
                }
            </Typography>
            <Typography align="left" variant="subtitle2" gutterBottom>
                <b>{"Retry Count: "}</b> 
                {
                  typeof(jobData.policy) !== 'undefined' && 
                  typeof(jobData.policy.retryCount) !== 'undefined' ? 
                  (editMode ?
                    (
                      <Input
                        defaultValue={jobData.policy.retryCount}
                        name="jobPolicyRetryCount"
                        onChange={e => onChange(e, "policy.retryCount")}
                        className={classes.input}
                      /> 
                    ) : 
                    (
                      jobData.policy.retryCount
                    )
                  )  
                  :
                  <CircularProgress size={10} />
                }
            </Typography>
            <Typography align="left" variant="subtitle2" gutterBottom>
                <b>{"Timeout: "}</b> 
                {
                  typeof(jobData.policy) !== 'undefined' && 
                  typeof(jobData.policy.timeout) !== 'undefined' ? 
                  (editMode ?
                    (
                      <Input
                        defaultValue={jobData.policy.timeout}
                        name="jobPolicyTimeout"
                        onChange={e => onChange(e, "policy.timeout")}
                        className={classes.input}
                      /> 
                    ) : 
                    (
                      jobData.policy.timeout
                    )
                  )  
                  :
                  <CircularProgress size={10} />
                }
            </Typography>
            <Typography align="left" variant="subtitle2" gutterBottom>
                <b>{"Interval: "}</b> 
                {
                  typeof(jobData.policy) !== 'undefined' &&
                  typeof(jobData.policy.schedule) !== 'undefined' && 
                  typeof(jobData.policy.schedule.interval) !== 'undefined' ? 
                  (editMode ?
                    (
                      <Input
                        defaultValue={jobData.policy.schedule.interval}
                        name="jobPolicyScheduleInterval"
                        onChange={e => onChange(e, "policy.schedule.interval")}
                        className={classes.input}
                      /> 
                    ) : 
                    (
                      jobData.policy.schedule.interval
                    )
                  )  
                  :
                  <CircularProgress size={10} />
                }
            </Typography> 
            <Typography align="left" variant="subtitle2">
              <b>{"Unit: "}</b>
              {
                typeof(jobData.policy) !== 'undefined' &&
                typeof(jobData.policy.schedule) !== 'undefined' && 
                typeof(jobData.policy.schedule.unit) !== 'undefined' ? 
                (editMode ?
                  (
                    <Input
                      defaultValue={jobData.policy.schedule.unit}
                      name="jobPolicyScheduleUnit"
                      onChange={e => onChange(e, "policy.schedule.unit")}
                      className={classes.input}
                    /> 
                  ) :
                  (
                    jobData.policy.schedule.unit
                  )
                )  
                :
                <CircularProgress size={10} />
              }
          </Typography>                         
          {/* </Grid> */}
        </TabPanel>
      </SwipeableViews>
    </div>
  );
}
