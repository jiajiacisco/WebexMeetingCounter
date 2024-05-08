import React from "react";
import { parse } from "papaparse";
import './readCsv.css';
import { useNavigate } from 'react-router-dom';
import './readCsv.css';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@mui/material/Box';
import { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SendIcon from '@mui/icons-material/Send';
import useStyles from './mui.jsx'
import axios from 'axios';
import {useLocation} from 'react-router-dom';
import loading from '../assets/load.gif'


function ReadCSV() {


const navigate = useNavigate();
const classes = useStyles()
const [highlighted, setHighlighted] = React.useState(false);
const [contacts, setContacts] = React.useState(
  [
]);

let [startDateTime, setstartDateTime]= useState('');
let [endDateTime, setendDateTime]= useState('');
const [isdata, setIsData ] = useState(false);
let [message, setmessage] = useState('');
const [spinner, setSpinner] = useState(false);    

const location = useLocation();
const token = location.state.APIToken

const handleSubmit = async (e) => {
  e.preventDefault();
  if (startDateTime==="" ||  endDateTime === ""){
    console.log("Date Range is empty")
  }
  else{
      let emailData = []
      contacts.forEach(function(contact) {
       let container = {} 
       container["email"] = contact
       emailData.push(container)
    });

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

  console.log("InputFields", contacts);
  console.log("start", startDateTime);
  console.log("end", endDateTime);
};


const changePage = (e) => {
  navigate("/user",
  {state:{APIToken:token}}
  )
}


    return (

      <div className="read">
        
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
        label: { color: "white" },
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


    <h2>Drop User CSV File</h2>
        <div
          className={`p-6 my-2 mx-auto max-w-md border-2 bg-sky-300 ${
            highlighted ? "border-grey-600 bg-sky-600" : "border-gray-300"
          }`}
          onDragEnter={() => {
            setHighlighted(true);
       
          }}
          onDragLeave={() => {
            setHighlighted(false);
          }}
          onDragOver={(e) => {
            e.preventDefault();
          }}
          onDrop={(e) => {
            e.preventDefault();
            setHighlighted(false);
  
            Array.from(e.dataTransfer.files)
              .filter((file) => file.type === "text/csv")
              .forEach(async (file) => {
                const text = await file.text();
                const result = parse(text, { header: true });
                console.log(result)
                setContacts((existing) => [...result.data.map((e,i)=>(
                  e.email
                ))]);
                setIsData(true)
              });
          }}
        >
          <CloudUploadIcon ></CloudUploadIcon>
        </div>
        {isdata && 
        <div>
        <p>Submiting the following emails</p>
        <p className="emails"> {contacts.slice(0, 10).join(', ')} .... </p>
        </div>}
  
        <Box>
       <Button
          className={classes.button}
          variant="contained" 
          color="primary" 
          type="submit" 
          onClick={changePage}
          > Input User Manually
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
      <img src={loading} alt="loading..." style={{ width:"30%",height:"30%", position: "absolute", top: "80%",  left: "50%",   marginRight: "-50%",
      transform: "translate(-50%, -50%)",overflowX:"hidden" }}/>
      }

        </form>
        </Container>
      </div>


    );

}

export default ReadCSV;