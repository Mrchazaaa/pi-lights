/* global Plotly:true */

import React, { useEffect, useState } from 'react'
import { Link, useParams } from "react-router-dom";
import createPlotlyComponent from 'react-plotly.js/factory'

const Plot = createPlotlyComponent(Plotly);
 
function formatDataPointsJson(unformattedDataPoints) {
	var formattedDataPoints = {x: [], y: []};

	Object.keys(unformattedDataPoints).forEach(key => {
		var x = Number(key);

		var date = new Date(x).toLocaleTimeString();

		formattedDataPoints.x.push(date);

		var y = Number(unformattedDataPoints[key]);

		formattedDataPoints.y.push(y);
	});

	return formattedDataPoints;
}


// Create async function for fetching graph file data
async function fetchFileData(graphName, setdataPoints) {
	// Use Fetch API to fetch '/api' endpoint
	var fileData = await fetch(`/api/graph/${graphName}`)
	.then(res => res.json()) // process incoming data
	
	fileData = formatDataPointsJson(fileData);

	setdataPoints(fileData)
}

function LineChart() {

	let { graphName } = useParams();

	const [dataPoints, setdataPoints] = useState({x: [], y: []})

	// Use useEffect to call fetchFileNames() on initial render
	useEffect(() => {
		fetchFileData(graphName, setdataPoints)
	}, [graphName])

	return (
		<div style={{height: '100vh'}}>
	        <ul>
				<li className="btn-link"><Link to='/'>back</Link></li>
				<li className="btn-link"><Link onClick={() => fetchFileData(graphName, setdataPoints)} className="btn-link">refresh</Link></li>
				{/* <li onClick={() => fetchFileData(graphName, setdataPoints)} className="btn-link"><a >refresh</a></li> */}
			</ul>

			<Plot
				data={[
				{
					x: dataPoints.x,
					y: dataPoints.y,
					type: 'scatter',
					mode: 'lines+markers',
					marker: {color: 'red'},
				},
				]}
				layout={{
					title: 'Light Levels by Time (UTC)',
				}}
				style={{
					width: '100%', 
					height: '85%',
				}}
			/>
		</div>
	);
}

export default LineChart;