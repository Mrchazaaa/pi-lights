/* global Plotly:true */

import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import createPlotlyComponent from 'react-plotly.js/factory';
import Logs from './Logs';

const Plot = createPlotlyComponent(Plotly);

function formatDataPointsJson(unformattedDataPoints) {
	var formattedDataPoints = {light: {x: [], y: []}, threshold: {x: [], y: []}};

	Object.keys(unformattedDataPoints).forEach(key => {
		var x = Number(key);

		var date = new Date(x).toLocaleTimeString();

		formattedDataPoints.light.x.push(date);
		formattedDataPoints.threshold.x.push(date);

		formattedDataPoints.light.y.push(Number(unformattedDataPoints.light[key]));
		formattedDataPoints.threshold.y.push(Number(unformattedDataPoints.threshold[key]));
	});

	return formattedDataPoints;
}


// Create async function for fetching graph file data
async function fetchFileData(graphName, setdataPoints) {
	// Use Fetch API to fetch '/api' endpoint
	var fileData = await fetch(`/api/data/${graphName}`)
	.then(res => res.json()) // process incoming data

	fileData = formatDataPointsJson(fileData);

	setdataPoints(fileData)
}

function LineChart() {

	let { graphName } = useParams();

	const [dataPoints, setdataPoints] = useState({light: {x: [], y: [], threshold: {x: [], y: []}}})

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
					x: dataPoints.threshold.x,
					y: dataPoints.threshold.y,
					type: 'scatter',
					mode: 'lines+markers',
					marker: {color: 'blue'},
				},
				{
					x: dataPoints.light.x,
					y: dataPoints.light.y,
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
			<Logs/>
		</div>
	);
}

export default LineChart;