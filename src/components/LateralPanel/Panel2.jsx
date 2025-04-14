import React, { useState, useEffect } from 'react';
import styles from './LateralPanel.module.css';
import CSVFile from '../../public_data/albatross-normal-tracks-9track-tailcrosswind.csv';
import datasetIndex from '../../assets/datasetIndex';
import TimeBar from "../TimeBar/TimeBar";
import { propertiesToString } from '../../utils/urlParser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faCode, faPaintBrush, faMap, faFile, faGlobe, faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import StyleSection from './sections/StyleSection';
import IDSection from './sections/IDSection';
import Section from "./sections/Section";
import BackgroundSection from './sections/BackgroundSection';
import FileLoader from '../FileLoader/FileLoader';
import * as Icon from 'react-bootstrap-icons';
import './Panel2.css';



const menu = [
    { id: "MENU", title: "Menu", icon: <Icon.GlobeAmericas/>, active: false},
    { id: "FILE", title: "File", icon: <Icon.FileEarmarkBinary/>, active: true },
    { id: "BG", title: "Background", icon: <Icon.Map/>, active: true },
    { id: "STYLE", title: "Properties", icon: <Icon.Sliders/>, active: false },
    // { id: "SHARE", title: "Share", icon: <Icon.Link/>, active: false },
    { id: "BACK", title: "Back", icon: <Icon.ArrowLeft/>, active: false }
]

function Panel2(props) {
    const [url, setUrl] = useState("");
    const [showingBaseMaps, setShowingBaseMaps] = useState(false);
    const [displayingSection, setDisplayingSection] = useState("BG");

    let loaded = false;
    //for every dataset, id has a different name, bring this point to professor

    function reset(){
        props.setMapCubeToggle(false);
        props.setData([]);
    }

    useEffect(() => {
        if (props.showIds) {
            props.setTagForLineColor({"name": props.idTagName});
            props.setTagForPointColor({"name": props.idTagName});
        } else {
            props.setTagForLineColor(props.tagsMatrix[0])
            props.setTagForPointColor(props.tagsMatrix[0]);

        }
        props.setTagForPointSize(props.tagsMatrix[0]);
    }, [props.tagsMatrix, props.showIds]);

    /* TODO: Make this work: */
    const setDatasetFromList = (name) => {
        /*
        fetch(name)
            .then((r) => {
                console.log(r);
                return r.text()
            })
            .then(text => {
                if (!loaded) {
                    console.log(text);
                    csvFileToArray(text);
                    loaded = true;
                }
            })
            */
    }

    useEffect(() => {
        if (props.dataset) setDatasetFromList(CSVFile);
    }, []);

    useEffect(() => {
        let tagIndex = props.tagsMatrix.findIndex((tag) => tag.name == props.tagForLineColor.name);
        let _url = propertiesToString(props.displayingIds, tagIndex, props.speed);
        setUrl(_url);
    }, [props.displayingIds, props.tagForLineColor, props.speed]);

    const copyUrl = () => {
        navigator.clipboard.writeText(url);
    }

    const copyIframe = () => {
        let iframe = `<iframe src="${url}" width="1200" height="600"></iframe>`;
        navigator.clipboard.writeText(iframe);
    }

    const [isHidden, setIsHidden] = useState(false);
    const [isSlim, setIsSlim] = useState(true);
    const [isSlimCollapsed, setIsSlimCollapsed] = useState(true);

    return (
        
        <div className={!(displayingSection == "MENU") && styles.Panel2}>
            
            {/* <div id={styles.menu}>
                {menu.map((item, i) => {
                    return <div
                        key={i}
                        className={item.active || props.data.length > 0 ? (displayingSection == item.id ? styles.menuSelected : styles.menuItem) : styles.disabled}
                        onClick={() => { if (item.active || props.data.length > 0) setDisplayingSection(item.id) }}
                    >
                        <FontAwesomeIcon className={styles.icon} icon={item.icon} />
                        <p className="text-sm mx-2">{item.title}</p>
                    </div>
                })}
            </div> */}
            
            <div id={styles.menu}>
                <nav
                    id="sidenav-4"
                    className={`group fixed left-0 top-0 z-[9999] h-screen w-60 bg-white shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] ${isSlim && isSlimCollapsed ? 'w-[77px]' : 'w-[63px]'}`}
                >
                    <ul>
                        {menu.map((item, i) => {
                            return <li
                                key={i}
                                className={`px-2.5 py-2.5 text-black hover:bg-gray-300 ${displayingSection == item.id ? 'backdrop' : ''} ${displayingSection == "Back" ? '' : ''}`}
                                onClick={() => { if (item.active || props.data.length > 0) setDisplayingSection(item.id) }}
                            >
                                <div className = "px-2.5 py-2.5 mt-1 "> {item.icon} </div>
                                {/* <FontAwesomeIcon className="px-2 py-2 mt-2 text-black hover:bg-gray-300 text-lg" icon={item.icon} /> */}
                            </li>
                        })}
                    </ul>
                </nav>
            </div>


            {displayingSection == "BG" && <BackgroundSection
                setBaseMap={props.setBaseMap}
            />}

            <Section title="File" if={displayingSection == "FILE"} class="flex">
                <h1 className='text-2xl font-bold'> File </h1>
                <h6>Click the button below to load a new dataset:</h6>
                <FileLoader
                    setIdTagName={props.setIdTagName}
                    setIdTimeRanges = {props.setIdTimeRanges}
                    setIds={props.setIds}
                    setColors={props.setColors}
                    dataset={props.dataset}
                    setDisplayingIds={props.setDisplayingIds}
                    setTagsMatrix={props.setTagsMatrix}
                    setTagForLineColor={props.setTagForLineColor}
                    tagForLineColorIndex={props.tagForLineColorIndex}
                    setZoom={props.setZoom}
                    setCenter={props.setCenter}
                    setData={props.setData}
                    setLatTag={props.setLatTag}
                    setLongTag={props.setLongTag}
                    setPolylines={props.setPolylines}
                    setInitialTime={props.setInitialTime}
                    setEndingTime={props.setEndingTime}
                />

                {/*datasetIndex.map((dataset, i) => {
                    return <div key={i} onClick={() => setDatasetFromList(dataset.url)}>{dataset.name}</div>
                })*/}
   
            </Section>
            
            <div class="overflow-y-scroll pb-10">
                <IDSection
                    if={props.ids.length > 0 && displayingSection == "STYLE"}
                    ids={props.ids}
                    colors={props.colors}
                    alignAroundId={props.alignAroundId}
                    setAlignAroundId={props.setAlignAroundId}
                    displayingIds={props.displayingIds}
                    tagForLineColor={props.tagForLineColor}
                    tagForPointsColor={props.tagForPointColor}
                    setDisplayingIds={props.setDisplayingIds}
                    setShowIds={props.setShowIds}
                    tagsMatrix={props.tagsMatrix}
                    idTimeRanges={props.idTimeRanges}
                />

                <StyleSection
                    if={props.tagsMatrix.length > 0 && displayingSection == "STYLE"}
                    showingBaseMaps={showingBaseMaps}
                    setShowingBaseMaps={setShowingBaseMaps}
                    baseMap={props.baseMap}
                    idTagName={props.idTagName}

                    setLineWidth={props.setLineWidth}
                    setLineWidth3D={props.setLineWidth3D}
                    setDisplayLine={props.setDisplayLine}
                    displayLine={props.displayLine}
                    setDisplay3DLine={props.setDisplay3DLine}
                    display3DLine={props.display3DLine}
                    setDisplayPoints={props.setDisplayPoints}
                    displayPoints={props.displayPoints}
                    tagsMatrix={props.tagsMatrix}
                    tagForLineColor={props.tagForLineColor}
                    setTagForLineColor={props.setTagForLineColor}
                    tagForLineSize={props.tagForLineSize}
                    setTagForLineSize={props.setTagForLineSize}

                    tagForPointSize={props.tagForPointSize}
                    setTagForPointSize={props.setTagForPointSize}
                    tagForPointColor={props.tagForPointColor}
                    setTagForPointColor={props.setTagForPointColor}
                    gradientLine={props.gradientLine}
                    setGradientLine={props.setGradientLine}
                    gradientPoints={props.gradientPoints}
                    setGradientPoints={props.setGradientPoints}
                    setColorScheme={props.setColorScheme}
                    setLineColorScheme={props.setLineColorScheme}
                    pointsColorScheme={props.pointsColorScheme}
                    lineColorScheme={props.lineColorScheme}
                    setPointsColorScheme={props.setPointsColorScheme}

                    timeMode={props.timeMode}
                    setTimeMode={props.setTimeMode}
                    showBox={props.showBox}
                    setShowBox={props.setShowBox}

                    showMapIn3d={props.showMapIn3d}
                    setShowMapIn3d={props.setShowMapIn3d}
                />
            </div>

            {/* <Section title="Share" if={props.data.length > 0 && displayingSection == "SHARE"} class="flex">
                <h1 className='text-2xl font-bold'> Share </h1>
                <div className="mb-4 mx-4">Click below to copy url or iframe links:</div>
                
                <div>
                    {/* <div className={styles.urlButton} onClick={copyUrl}>
                        <FontAwesomeIcon className={styles.icon} icon={faLink} />
                        <div>url</div>
                    </div>
                    <div className={styles.iframeButton} onClick={copyIframe}>
                        <FontAwesomeIcon className={styles.icon} icon={faCode} />
                        <div>i-frame</div>
                    </div> */}
                    {/* <button onClick={copyUrl} class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mt-4">
                        <FontAwesomeIcon icon={faLink} className='mr-2'></FontAwesomeIcon>
                        <span>Copy URL</span>
                    </button>
                    <button onClick={copyIframe} class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mt-4">
                        <FontAwesomeIcon icon={faCode} className='mr-2'></FontAwesomeIcon>
                        <span>Copy Iframe</span>
                    </button>
                </div>
            </Section> */}

            {displayingSection == "BACK" && reset()};
        </div >
    
    ); 
}



export default Panel2;
