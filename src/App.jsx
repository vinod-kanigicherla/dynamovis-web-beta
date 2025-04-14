import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Routes, Route, Link, useParams } from "react-router-dom";
import Map from './components/Map/Map';
import NewMap from './components/Map/NewMap';
import SpaceTimeCube from './components/SpaceTimeCube/SpaceTimeCube';
import LateralPanel from './components/LateralPanel/LateralPanel';
import 'leaflet/dist/leaflet.css';
import { stringToProperties } from './utils/urlParser';
import { useInterval } from './utils/customHooks';
import Landing from './components/Landing/Landing';


import styled from 'styled-components';
import Header from './components/Landing/Header.js'; // Add this import statement
import Panel2 from './components/LateralPanel/Panel2';
import IdSelect from './components/FileLoader/IdSelect';
import Team from './components/NavItems/Team.jsx';


const WindowWrapper = styled.div`
  position: absolute;
  border: 1px solid #ccc;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const WindowContent = styled.div`
  padding: 8px;
`;

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/:dataset/:str" element={<Home />} />
        <Route exact path="/" element={<Home />} />
        <Route exact path="/Team" element={<Team />} />
      </Routes>
    </Router>
  );
}

function Home() {
  let { dataset, str } = useParams();



  const [data, setData] = useState([]);
  const [tagsMatrix, setTagsMatrix] = useState([]);
  const [center, setCenter] = useState([7.098385, -84.79631499999999]);
  const [zoom, setZoom] = useState(9);
  const [polylines, setPolylines] = useState([]);
  const [localCenters, setLocalCenters] = useState([]);
  const [latTag, setLatTag] = useState();
  const [longTag, setLongTag] = useState();
  const [initialTime, setInitialTime] = useState();
  const [endingTime, setEndingTime] = useState();
  const [ids, setIds] = useState([]);
  const [displayingIds, setDisplayingIds] = useState([]);
  const [colors, setColors] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState();
  const [speed, setSpeed] = useState(3600000);
  const [fade, setFade] = useState(false);
  const [loop, setLoop] = useState(true);
  const [tagForLineColorIndex, setTagForLineColorIndex] = useState(0); // Just for the initialization
  const [lineConfig, setLineConfig] = useState({ color: 'red' });
  const [displayPoints, setDisplayPoints] = useState(false);
  const [displayLine, setDisplayLine] = useState(true);
  const [display3DLine, setDisplay3DLine] = useState(true);
  const [idTagName, setIdTagName] = useState();
  const [idTimeRanges, setIdTimeRanges] = useState({});
  const [alignAroundId, setAlignAroundId] = useState(0);

  const fixedColorGradients = [
    ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
    ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
    ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
    ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
    ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
    ['#8c510a', '#bf812d', '#dfc27d', '#f6e8c3', '#f5f5f5', '#c7eae5', '#80cdc1', '#35978f', "#01665e"],
    ['#c51b7d', '#de77ae', '#f1b6da', '#fde0ef', '#f7f7f7', '#e6f5d0', '#b8e186', '#7fbc41', "#4d9221"],
    ['#762a83', '#9970ab', '#c2a5cf', '#e7d4e8', '#f7f7f7', '#d9f0d3', '#a6dba0', '#5aae61', "#1b7837"],
    ['#b35806', '#e08214', '#fdb863', '#fee0b6', '#f7f7f7', '#d8daeb', '#b2abd2', '#8073ac', "#542788"],
    ['#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#f7f7f7', '#d1e5f0', '#92c5de', '#4393c3', "#2166ac"],
    ['#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#ffffff', '#e0e0e0', '#bababa', '#878787', "#4d4d4d"],
    ['#d73027', '#f46d43', '#fdae61', '#fee090', '#ffffbf', '#e0f3f8', '#abd9e9', '#74add1', "#4575b4"],
    ['#d73027', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#d9ef8b', '#a6d96a', '#66bd63', "#1a9850"],
    ['#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#ffffbf', '#e6f598', '#abdda4', '#66c2a5', "#3288bd"]
  ];

  // Convert hex codes to RGB values
  const convertedColors = fixedColorGradients.map(colorSet => (
    colorSet.map(hex => {
      // Remove '#' from the hex code and convert to RGB
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return [r, g, b];
    })
  ));

  const [lineColorScheme, setLineColorScheme] = useState(0);
  const [pointsColorScheme, setPointsColorScheme] = useState(0);

  const [gradientLine, setGradientLine] = useState({
    a: convertedColors[lineColorScheme][convertedColors[lineColorScheme].length - 1],
    c: convertedColors[lineColorScheme][convertedColors[lineColorScheme].length / 2],
    b: convertedColors[lineColorScheme][0]
  });

  useEffect(() => {
    console.log("CHANGING");
    setSpeed(speed);
  }, [speed])

  useEffect(() => {
    setGradientLine({
      a: convertedColors[lineColorScheme][convertedColors[lineColorScheme].length - 1],
      c: convertedColors[lineColorScheme][convertedColors[lineColorScheme].length / 2],
      b: convertedColors[lineColorScheme][0]
    })
  }, [lineColorScheme])

  const [gradientPoints, setGradientPoints] = useState({
    a: convertedColors[pointsColorScheme][convertedColors[pointsColorScheme].length - 1],
    c: convertedColors[pointsColorScheme][convertedColors[pointsColorScheme].length / 2],
    b: convertedColors[pointsColorScheme][0]
  });

  useEffect(() => {
    setGradientPoints({
      a: convertedColors[pointsColorScheme][convertedColors[pointsColorScheme].length - 1],
      c: convertedColors[pointsColorScheme][convertedColors[pointsColorScheme].length / 2],
      b: convertedColors[pointsColorScheme][0]
    })
  }, [pointsColorScheme])

  const [showIds, setShowIds] = useState(false);
  //useEffectStatement here



  const [timer, setTimer] = useState();
  const [timeMode, setTimeMode] = useState(false); // false=relative; true=absolute;
  const [showBox, setShowBox] = useState(true);
  const [showMapIn3d, setShowMapIn3d] = useState(true);

  // Style
  const [tagForLineSize, setTagForLineSize] = useState();   // Line size
  const [tagForLineColor, setTagForLineColor] = useState();   // Line gradient
  const [tagForPointSize, setTagForPointSize] = useState();   // Circle size
  const [tagForPointColor, setTagForPointColor] = useState(); // Circle color
  const [lineWidth, setLineWidth] = useState(3);
  const [lineWidth3D, setLineWidth3D] = useState(2);
  const [baseMap, setBaseMap] = useState({
    name: "Esri.WorldImagery",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    preview: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/9/204/85",
    forCube: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  });

  // Preconf  
  const [preconf, setPreconf] = useState(false);

  // 2D or 2D + 3D panels
  const [mapCubeToggle, setMapCubeToggle] = useState(false);
  const handleCheckboxChange = () => {
    setMapCubeToggle(!mapCubeToggle)
  }

  // Show ID select
  const [showIdSelect, setShowIdSelect] = useState(true);

  useEffect(() => {
    if (str) stringToProperties(str, setDisplayingIds, setTagForLineColorIndex, setSpeed);
  }, [str]);

  useEffect(() => {
    if (dataset) setPreconf(true);
  }, [dataset]);

  useEffect(() => { setTime(initialTime); }, [initialTime]);
  useEffect(() => { if (preconf) setPlaying(true) }, [polylines])

  useInterval(() => {
    if (playing) {
      let count = time + speed;
      if (count >= endingTime) {
        if (loop) {
          count = initialTime;
        } else {
          count = endingTime;
        }
      }
      setTime(count);
    }
  }, [100]);

  const pause = () => {
    window.clearInterval(timer);
    setPlaying(false);
  }

  const stop = () => {
    if (timer) window.clearInterval(timer);
    setPlaying(false);
    setTime(initialTime);
  }

  if (data.length > 0) {
    return (

      <div className="App" id="App">
        {!preconf &&
          <LateralPanel
            setMapCubeToggle={setMapCubeToggle}
            handleCheckboxChange={handleCheckboxChange}
            mapCubeToggle={mapCubeToggle}
            data={data}
            setData={setData}
            timeMode={timeMode}
            setTimeMode={setTimeMode}
            setCenter={setCenter}
            tagsMatrix={tagsMatrix}
            setTagsMatrix={setTagsMatrix}
            setZoom={setZoom}
            setPolylines={setPolylines}
            dataset={dataset}
            latTag={latTag}
            longTag={longTag}
            setLatTag={setLatTag}
            setLongTag={setLongTag}
            initialTime={initialTime}
            setInitialTime={setInitialTime}
            endingTime={endingTime}
            setEndingTime={setEndingTime}
            ids={ids}
            setIds={setIds}
            displayingIds={displayingIds}
            setDisplayingIds={setDisplayingIds}
            playing={playing}
            setPlaying={setPlaying}
            time={time}
            setTime={setTime}
            pause={pause}
            stop={stop}
            preconf={preconf}
            colors={colors}
            setColors={setColors}
            speed={speed}
            setSpeed={setSpeed}
            setFade={setFade}
            fade={fade}
            setLoop={setLoop}
            loop={loop}
            tagForLineColorIndex={tagForLineColorIndex}
            displayPoints={displayPoints}
            setDisplayPoints={setDisplayPoints}
            displayLine={displayLine}
            setDisplayLine={setDisplayLine}
            display3DLine={display3DLine}
            setDisplay3DLine={setDisplay3DLine}
            setIdTagName={setIdTagName}
            idTagName={idTagName}
            gradientLine={gradientLine}
            setGradientLine={setGradientLine}
            gradientPoints={gradientPoints}
            setGradientPoints={setGradientPoints}
            /* Style */
            tagForLineSize={tagForLineSize}
            setTagForLineSize={setTagForLineSize}
            tagForLineColor={tagForLineColor}
            setTagForLineColor={setTagForLineColor}
            tagForPointSize={tagForPointSize}
            setTagForPointSize={setTagForPointSize}
            tagForPointColor={tagForPointColor}
            setTagForPointColor={setTagForPointColor}
            lineWidth={lineWidth}
            setLineWidth={setLineWidth}
            lineWidth3D={lineWidth3D}
            setLineWidth3D={setLineWidth3D}
            baseMap={baseMap}
            setBaseMap={setBaseMap}
            showBox={showBox}
            setShowBox={setShowBox}
            showMapIn3d={showMapIn3d}
            setShowMapIn3d={setShowMapIn3d}
          />
        }


        {!preconf &&
          <Panel2
            data={data}
            setData={setData}
            setMapCubeToggle={setMapCubeToggle}
            timeMode={timeMode}
            setTimeMode={setTimeMode}
            alignAroundId={alignAroundId}
            setAlignAroundId={setAlignAroundId}
            setCenter={setCenter}
            tagsMatrix={tagsMatrix}
            setTagsMatrix={setTagsMatrix}
            setZoom={setZoom}
            setPolylines={setPolylines}
            dataset={dataset}
            latTag={latTag}
            longTag={longTag}
            setLatTag={setLatTag}
            setLongTag={setLongTag}
            initialTime={initialTime}
            setInitialTime={setInitialTime}
            endingTime={endingTime}
            setEndingTime={setEndingTime}
            ids={ids}
            setIds={setIds}
            showIds={showIds}
            setShowIds={setShowIds}
            displayingIds={displayingIds}
            setDisplayingIds={setDisplayingIds}
            playing={playing}
            setPlaying={setPlaying}
            time={time}
            setTime={setTime}
            pause={pause}
            stop={stop}
            preconf={preconf}
            colors={colors}
            setColors={setColors}
            speed={speed}
            setSpeed={setSpeed}
            setFade={setFade}
            setLoop={setLoop}
            loop={loop}
            tagForLineColorIndex={tagForLineColorIndex}
            displayPoints={displayPoints}
            setDisplayPoints={setDisplayPoints}
            displayLine={displayLine}
            setDisplayLine={setDisplayLine}
            display3DLine={display3DLine}
            setDisplay3DLine={setDisplay3DLine}
            setIdTagName={setIdTagName}
            idTagName={idTagName}
            gradientLine={gradientLine}
            setGradientLine={setGradientLine}
            gradientPoints={gradientPoints}
            setGradientPoints={setGradientPoints}
            tagForLineSize={tagForLineSize}
            setTagForLineSize={setTagForLineSize}
            tagForLineColor={tagForLineColor}
            setTagForLineColor={setTagForLineColor}
            pointsColorScheme={pointsColorScheme}
            lineColorScheme={lineColorScheme}
            setPointsColorScheme={setPointsColorScheme}
            setLineColorScheme={setLineColorScheme}
            tagForPointSize={tagForPointSize}
            setTagForPointSize={setTagForPointSize}
            tagForPointColor={tagForPointColor}
            setTagForPointColor={setTagForPointColor}
            lineWidth={lineWidth}
            setLineWidth={setLineWidth}
            lineWidth3D={lineWidth3D}
            setLineWidth3D={setLineWidth3D}
            baseMap={baseMap}
            setBaseMap={setBaseMap}
            showBox={showBox}
            setShowBox={setShowBox}
            showMapIn3d={showMapIn3d}
            setShowMapIn3d={setShowMapIn3d}
            idTimeRanges={idTimeRanges}
            setIdTimeRanges={setIdTimeRanges}
          />
        }
        {
          mapCubeToggle ?
            (<div className='App'>
              <div className='TwoDMap'>
                <NewMap
                  alignAroundId={alignAroundId}
                  setAlignAroundId={setAlignAroundId}
                  polylines={polylines}
                  localCenters={localCenters}
                  setLocalCenters={setLocalCenters}
                  center={center}
                  zoom={zoom}
                  latTag={latTag}
                  longTag={longTag}
                  time={time}
                  initialTime={initialTime}
                  endingTime={endingTime}
                  displayingIds={displayingIds}
                  preconf={preconf}
                  colors={colors}
                  tagsMatrix={tagsMatrix}
                  displayPoints={displayPoints}
                  setDisplayPoints={setDisplayPoints}
                  displayLine={displayLine}
                  fade={fade}
                  display3DLine={display3DLine}
                  ids={ids}
                  // Style
                  tagForLineColor={tagForLineColor}
                  tagForLineSize={tagForLineSize}
                  tagForPointSize={tagForPointSize}
                  tagForPointColor={tagForPointColor}
                  lineWidth={lineWidth}
                  lineWidth3D={lineWidth3D}
                  baseMap={baseMap}
                  gradientLine={gradientLine}
                  gradientPoints={gradientPoints}
                  idTagName={idTagName}
                  mapCubeToggle={mapCubeToggle}
                  timeMode={timeMode}
                  showBox={showBox}
                  showMapIn3d={showMapIn3d}

                />
              </div>

              <SpaceTimeCube
                polylines={polylines}
                center={center}
                zoom={zoom}
                latTag={latTag}
                longTag={longTag}
                time={time}
                initialTime={initialTime}
                endingTime={endingTime}
                displayingIds={displayingIds}
                preconf={preconf}
                colors={colors}
                tagsMatrix={tagsMatrix}
                displayPoints={displayPoints}
                setDisplayPoints={setDisplayPoints}
                displayLine={displayLine}
                fade={fade}
                display3DLine={display3DLine}
                ids={ids}
                // Style
                tagForLineColor={tagForLineColor}
                tagForLineSize={tagForLineSize}
                tagForPointSize={tagForPointSize}
                tagForPointColor={tagForPointColor}
                lineWidth={lineWidth}
                lineWidth3D={lineWidth3D}
                baseMap={baseMap}
                gradientLine={gradientLine}
                gradientPoints={gradientPoints}
                idTagName={idTagName}

                timeMode={timeMode}
                showBox={showBox}
                showMapIn3d={showMapIn3d}

              />

            </div>) :
            (
              <div className='App'>
                <div className='TwoDMapSingle'>
                  <NewMap
                    polylines={polylines}
                    alignAroundId={alignAroundId}
                    setAlignAroundId={setAlignAroundId}
                    center={center}
                    localCenters={localCenters}
                    setLocalCenters={setLocalCenters}
                    zoom={zoom}
                    latTag={latTag}
                    longTag={longTag}
                    time={time}
                    initialTime={initialTime}
                    endingTime={endingTime}
                    displayingIds={displayingIds}
                    preconf={preconf}
                    colors={colors}
                    tagsMatrix={tagsMatrix}
                    displayPoints={displayPoints}
                    setDisplayPoints={setDisplayPoints}
                    displayLine={displayLine}
                    fade={fade}
                    display3DLine={display3DLine}
                    ids={ids}
                    // Style
                    tagForLineColor={tagForLineColor}
                    tagForLineSize={tagForLineSize}
                    tagForPointSize={tagForPointSize}
                    tagForPointColor={tagForPointColor}
                    lineWidth={lineWidth}
                    lineWidth3D={lineWidth3D}
                    baseMap={baseMap}
                    gradientLine={gradientLine}
                    gradientPoints={gradientPoints}
                    idTagName={idTagName}
                    mapCubeToggle={mapCubeToggle}
                    timeMode={timeMode}
                    showBox={showBox}
                    showMapIn3d={showMapIn3d}

                  />
                </div>
              </div>)
        }

        {

          <div></div>
        }

      
      </div>
    )
  } else {
    return (
      <div>
        <Landing
          setIdTagName={setIdTagName}
          setIds={setIds}
          setColors={setColors}
          dataset={dataset}
          setDisplayingIds={setDisplayingIds}
          setTagsMatrix={setTagsMatrix}
          setTagForLineColor={setTagForLineColor}
          tagForLineColorIndex={tagForLineColorIndex}
          setLocalCenters={setLocalCenters}
          localCenters={localCenters}
          setZoom={setZoom}
          setCenter={setCenter}
          setData={setData}
          setLatTag={setLatTag}
          setLongTag={setLongTag}
          setPolylines={setPolylines}
          setInitialTime={setInitialTime}
          setEndingTime={setEndingTime}
          setIdTimeRanges={setIdTimeRanges}
        />
      </div>
    )
  }

}

export default App;