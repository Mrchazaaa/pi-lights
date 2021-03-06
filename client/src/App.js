import React, { useEffect, useState } from 'react'
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
        <Route path="/data/:graphName" children={<LineChart/>} />
        <Route path="/">
        <ul>
          {graphNames.sort().reverse().map((graphName, i) => {     
            return (
              <li className="btn-link">
                <Link to={`/data/${graphName}`} key={i} >{graphName}</Link>
              </li>
            )})}
        </ul>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
