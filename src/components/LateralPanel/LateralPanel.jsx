import React, { useState, useEffect } from 'react';
import styles from './LateralPanel.module.css';
import CSVFile from '../../public_data/albatross-normal-tracks-9track-tailcrosswind.csv';
import datasetIndex from '../../assets/datasetIndex';
import TimeBar from "../TimeBar/TimeBar";
import { propertiesToString } from '../../utils/urlParser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLink, faCode, faFileCsv, faPaintBrush, faShareNodes, faMap, faHashtag } from '@fortawesome/free-solid-svg-icons';
import StyleSection from './sections/StyleSection';
import IDSection from './sections/IDSection';
import Section from "./sections/Section";
import BackgroundSection from './sections/BackgroundSection';
import FileLoader from '../FileLoader/FileLoader';



const menu = [
    { id: "FILE", title: "File", icon: faFileCsv, active: true },
    { id: "BG", title: "Background", icon: faMap, active: true },
    { id: "STYLE", title: "Style", icon: faPaintBrush, active: false },
    { id: "SHARE", title: "Share", icon: faShareNodes, active: false }
]

function LateralPanel(props) {

    const [url, setUrl] = useState("");
    const [showingBaseMaps, setShowingBaseMaps] = useState(false);
    const [displayingSection, setDisplayingSection] = useState("BG");

    let loaded = false;

    useEffect(() => {
        props.setTagForLineColor(props.idTagName);
        props.setTagForLineSize(props.tagsMatrix[0]);
        props.setTagForPointSize(props.tagsMatrix[0]);
        props.setTagForPointColor(props.tagsMatrix[0]);
    }, [props.tagsMatrix]);

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

    return (
        <div className={styles.LateralPanel}>


            

            {props.data.length > 0 && <div className={styles.timeContainer}>
                <TimeBar
                    setMapCubeToggle={props.setMapCubeToggle}
                    handleCheckboxChange={props.handleCheckboxChange}
                    mapCubeToggle={props.mapCubeToggle}
                    time={props.time}
                    setTime={props.setTime}
                    initialTime={props.initialTime}
                    tagForLineSize={props.tagForLineSize}
                    endingTime={props.endingTime}
                    setPlaying={props.setPlaying}
                    playing={props.playing}
                    pause={props.pause}
                    stop={props.stop}
                    speed={props.speed}
                    setSpeed={props.setSpeed}
                    loop={props.loop}
                    
                    setLoop={props.setLoop}
                    setFade={props.setFade}
                    fade={props.fade}
                />
            </div>
            }
        </div >
    );
}

export default LateralPanel;