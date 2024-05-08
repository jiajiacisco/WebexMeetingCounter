/*
Copyright (c) 2023 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.1 (the "License"). You may obtain a copy of the
License at
https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied.
__author__ = "Jiade Lian <jiadlian@cisco.com>, Rey Diaz <rediaz@cisco.com>"
__copyright__ = "Copyright (c) 2023 Cisco and/or its affiliates."
__license__ = "Cisco Sample Code License, Version 1.1"
*/
import './user.css';
import { useNavigate } from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import * as React from 'react';
import { useState } from 'react';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import { v4 as uuidv4 } from 'uuid';
import Box from '@mui/material/Box';
import SendIcon from '@mui/icons-material/Send';
import InputAdornment from '@mui/material/InputAdornment';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { makeStyles } from '@material-ui/core/styles';
import useStyles from './mui.jsx'
import axios from 'axios';
import loading from '../assets/load.gif'

function User() {

  const classes = useStyles()
  let [inputFields, setInputFields] = useState([
    { id: uuidv4(), userName: '' },
  ]);

  let [startDateTime, setstartDateTime]= useState('');
  let [endDateTime, setendDateTime]= useState('');
  let [message, setmessage] = useState('');

  const [spinner, setSpinner] = useState(false);    


  const navigate = useNavigate();
  const location = useLocation();
  const token = location.state.APIToken
  console.log(token)

  const changePage = (e) => {
  navigate("/readcsv",  {state:{APIToken:token}})
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    if (startDateTime==="" ||  endDateTime === ""){
      console.log("Date Range is empty")
      console.log(inputFields.length)
    }else{

      const emailData = inputFields.map(item => {
        const container = {};
        container["email"] = item.userName;
        return container;
    })
    console.log("emaildata",emailData)
      setSpinner(true);
      axios.get('/meetingdata',{
        params: {
          start:startDateTime,
          end: endDateTime,
          Token: token,
          email: JSON.stringify(emailData)
        },
      }).then(function (response) {
        console.log("meeting statistics",response.data.meetingData);
        setSpinner(false);
        navigate("/meetingTable",
        {state:{meetingData:response.data}}
        )
      }).catch(error => {
        setmessage("Invalid Inputs Please Change them" )
      })
    }

    console.log("InputFields", inputFields);
    console.log("start", startDateTime);
    console.log("end", endDateTime);
  };

  const handleChangeInput = (id, event) => {
    const newInputFields = inputFields.map(i => {
      if(id === i.id) {
        i[event.target.name] = event.target.value
      }
      return i;
    })
    setInputFields(newInputFields);
  }

  const handleAddFields = () => {
    setInputFields([...inputFields, { id: uuidv4(),  userName: '' }])
  }

  const handleRemoveFields = id => {
    const values  = [...inputFields];
    values.splice(values.findIndex(value => value.id === id), 1);
    setInputFields(values);
  }

  return (

    <div className='user' >
    <Container>
      <form className={classes.root} onSubmit={handleSubmit}>  
      <div>
        <h2>Select your Time Range</h2>
     </div>

     <div className='date'>

     <Box
          sx={{
            alignItems:"center",
            justifyContent:"center",
            display: 'flex',
            gap: 5,
            gridTemplateColumns: 'repeat(2, 1fr)',
       }}>   
      <TextField
      id="datetime-local"
      label="From"
      type="datetime-local"
      className={classes.textField}
      variant="outlined"
      sx={{
        svg: { color: "white"},
        input: { color: "white" },
        label: { color: "white" }
      }}
      inputProps={ { style: { color: "white" } } }
      InputLabelProps={{
        shrink: true,
      }}
      onChange={(e) =>  setstartDateTime(e.target.value)}
    />

    <TextField
      id="datetime-local"
      label="To"
      type="datetime-local"
      className={classes.textField}
      variant="outlined"
      inputProps={{ style: { color: "white" } }}
      InputLabelProps={{
        shrink: true,
      }}
      onChange={(e) =>  setendDateTime(e.target.value)}
    />  
    </Box>
    </div>


        <h2>Add User Email</h2>
        <div className='userInput'>
        { inputFields.map(inputField => (
          <div key={inputField.id}>  

            <TextField
              name="userName"              
              variant="standard"
              className={classes.textFieldEmail}
              value={inputField.userName}
              inputProps={{ style: { color: "white" } }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle sx={{color:"white"}} />
                  </InputAdornment>
                ),
              }}
              
              onChange={event => handleChangeInput(inputField.id, event)}
            />

            <IconButton disabled={inputFields.length === 1} onClick={() => handleRemoveFields(inputField.id)}
            >
              <RemoveIcon  style={{ fill: 'whitesmoke' }}/>
            </IconButton>
            <IconButton
              onClick={handleAddFields}
            >
              <AddIcon style={{ fill: 'whitesmoke' }} />
            </IconButton>
    
          </div>
        )) }
        </div>

       <Box>
       <Button
          className={classes.button}
          variant="contained" 
          color="primary" 
          type="submit" 
          onClick={changePage}
          > Upload CSV
        </Button>

       <Button
          className={classes.button}
          variant="contained" 
          type="submit" 
          color="primary" 
          endIcon={<SendIcon />}
          onClick={handleSubmit}
          > Send
        </Button>
        </Box>


      {spinner && 
      <img src={loading} alt="loading..." style={{ width:"30%",height:"30%", position: "absolute", top: "75%",  left: "50%",   marginRight: "-50%",
      transform: "translate(-50%, -50%)", overflowX:"hidden"}}/>
      }



      </form>

     
    </Container>


       
      
    </div>
  );
}

export default User;