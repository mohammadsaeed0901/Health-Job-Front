import { Box, Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/AddCircle';
import RemoveIcon from '@material-ui/icons/RemoveCircle';
import {IconButton} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    }
  }));
  
function AddableInputItems(props) {
  const {defaultInputList, handleInputListChange, itemName} = props;
  const classes = useStyles();
  const [inputList, setInputList] = useState([defaultInputList]);

  // handle input change
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const list = [...inputList];
    list[index][name] = value;
    setInputList(list);
    handleInputListChange(list, itemName);
  };

  // handle click event of the Remove button
  const handleRemoveClick = index => {
    const list = [...inputList];
    list.splice(index, 1);
    setInputList(list);
    handleInputListChange(list, itemName);
  };

  // handle click event of the Add button
  const handleAddClick = () => {
    setInputList([...inputList, defaultInputList]);
    handleInputListChange([...inputList, defaultInputList], itemName);
  };

  return (
    <div className="App">
      {inputList.map((x, i) => {
          const inputItems = [];
          for (const key in x){
            inputItems.push(
              <Box key={key}>
                <TextField
                  variant="outlined"
                  margin="dense"
                  key={key}
                  name={key}
                  label={key}
                  value={x[key]}
                  onChange={e => handleInputChange(e, i)}
                />   
              </Box>
            );       
          }
          inputItems.push(
          inputList.length !== 1 && 
          <IconButton
            color="primary"
            key={"remove" + i}
            onClick={() => handleRemoveClick(i)}>
              <RemoveIcon/>
          </IconButton>
            );
            
          inputItems.push(
            inputList.length - 1 === i && 
            <IconButton
            color="primary"
            key={"remove" + i}
            onClick={() => handleAddClick(i)}
          >
            <AddIcon/>
          </IconButton>);
          
        {/* </div> */}
        return (
          <div key={i} className={classes.formControl}>
              {inputItems}
          </div>
        );
      })}
      {/* <div style={{ marginTop: 20 }}>{JSON.stringify(inputList)}</div> */}
    </div>
  );
}

export default AddableInputItems;