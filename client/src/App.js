import React, { useEffect, useState } from 'react'
import './App.css';
import LineChart from './components/LineChart';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function App() {

  const [graphNames, setgraphNames] = useState([])

  // Create async function for fetching graph file names
  const fetchFileNames = async () => {
    // Use Fetch API to fetch '/api' endpoint
    const fileNames = await fetch('/api/listdata')
      .then(res => res.json()) // process incoming data
    // Update welcomeMessage state
    setgraphNames(fileNames)
  }

  // Use useEffect to call fetchFileNames() on initial render
  useEffect(() => {
    fetchFileNames()
  }, [])

  return (
    <Router>
      <Switch>
        <Route path="/graph/:graphName" children={<LineChart/>} />
        <Route path="/">
        <ul>
          {graphNames.map((graphName, i) => {     
            return (
              <li>
                <Link to={`/graph/${graphName}`} key={i} >{graphName}</Link>
              </li>
            )})}
        </ul>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
