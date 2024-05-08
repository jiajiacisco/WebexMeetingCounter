import logo from './logo.svg';
import './App.css';
import {Routes ,Route} from "react-router-dom"
import Home from "./components/home.jsx";
import User from "./components/user.jsx"
import ReadCSV from './components/readCsv.jsx'
import MeetingTable from './components/MeetingTable.jsx';
import MeetingDetails from './components/MeetingDetails.jsx';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={ <Home/> } />
        <Route path="/user" element={ <User/> } />
        <Route path="/readCSV" element={ <ReadCSV/> } />
        <Route path="/meetingTable" element={ <MeetingTable/> } />
        <Route path="/meetingDetails" element={ <MeetingDetails/> } />
      </Routes>
    </div>
  );
}

export default App;
