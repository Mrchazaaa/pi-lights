/* global Plotly:true */

import React, { useEffect, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import createPlotlyComponent from 'react-plotly.js/factory';
import Logs from './Logs';

const Plot = createPlotlyComponent(Plotly);

function formatDataPointsJson(graphName, unformattedDataPoints) {
	var formattedDataPoints = {x: [], y: []};

	Object.keys(unformattedDataPoints).sort().forEach(key => {
		var x = Number(key);

		var date = graphName + ' ' + new Date(x).toLocaleTimeString();

		formattedDataPoints.x.push(date);

		var y = Number(unformattedDataPoints[key]);

		formattedDataPoints.y.push(y);
	});

	return formattedDataPoints;
}


// Create async function for fetching graph file data
async function fetchFileData(graphName, setLuxDataPoints, setThresholdDataPoints, setLightsDataPoints) {
	// Use Fetch API to fetch '/api' endpoint
	var fileData = await fetch(`/api/data/${graphName}`)
        .then(res => res.json()); // process incoming data

	setLuxDataPoints(formatDataPointsJson(graphName, fileData.lux));
	setThresholdDataPoints(formatDataPointsJson(graphName, fileData.threshold));

    let lightsDataPoints = {};
    Object.keys(fileData.lights).forEach(x => {
        lightsDataPoints[x] = formatDataPointsJson(graphName, fileData.lights[x])
    });

    setLightsDataPoints(lightsDataPoints);
}

function LineChart() {

	let { graphName } = useParams();

	const [luxDataPoints, setLuxDataPoints] = useState({x: [], y: []})
	const [thresholdDataPoints, setThresholdDataPoints] = useState({x: [], y: []})
	const [lightsDataPoints, setLightsDataPoints] = useState({})

	// Use useEffect to call fetchFileNames() on initial render
	useEffect(() => {
		fetchFileData(graphName, setLuxDataPoints, setThresholdDataPoints, setLightsDataPoints)
	}, [graphName])

	return (
		<div style={{height: '100vh'}}>
	        <ul>
				<li className="btn-link"><Link to='/'>back</Link></li>
				<li className="btn-link"><Link onClick={() => fetchFileData(graphName, setLuxDataPoints, setThresholdDataPoints, setLightsDataPoints)} className="btn-link">refresh</Link></li>
				{/* <li onClick={() => fetchFileData(graphName, setdataPoints)} className="btn-link"><a >refresh</a></li> */}
			</ul>

			<Plot
				data={[
                    {
                        x: luxDataPoints.x,
                        y: luxDataPoints.y,
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: {color: 'red'},
                        name: 'Lux',
                    },
                    {
                        x: thresholdDataPoints.x,
                        y: thresholdDataPoints.y,
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: {color: 'blue'},
                        name: 'Threshold',
                        line: {"shape": 'hv'},
                    },
                    ...Object.keys(lightsDataPoints).map(x => {
                        return {
                            x: lightsDataPoints[x].x,
                            y: lightsDataPoints[x].y,
                            type: 'scatter',
                            mode: 'lines+markers',
                            marker: {color: 'green'},
                            name: x,
                            line: {"shape": 'hv'},
                        }
                    })
				]}
				layout={{
					title: 'Light Levels by Time (UTC)',
                    xaxis: {
                        tickformat: '%H:%M:%S',
                        type: 'date'
                    },
				}}
                useResizeHandler={true}
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