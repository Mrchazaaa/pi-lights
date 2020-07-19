  
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
		<div>
			<Link to='/'>back</Link>

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
				layout={{title: 'Light Levels by Time (UTC)'}}
			/>
		</div>
	);
}

export default LineChart;