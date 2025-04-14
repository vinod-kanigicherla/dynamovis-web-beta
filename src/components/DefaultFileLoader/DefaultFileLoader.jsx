import { useEffect, useState } from "react";
import { lat2tile, long2tile } from '../../utils/mapUtils';
import { hueToHex } from '../../utils/color';
import { faFileCsv, faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import styles from "./DefaultFileLoader.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Albatross from "../../public_data/albatross-normal-tracks-9track-tailcrosswind.csv";
import Tiger from "../../public_data/tigers/Cub1_Cub2.csv";
import TurkeyVulture from "../../public_data/Turkey-Vulture-Acopian-Center-USA-GPS-flagged-newUplift-Dec2013.csv";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Dropdown from 'react-bootstrap/Dropdown';


const latNames = ["location-lat", "location.lat", "latitude"];
const longNames = ["location-long", "location.long", "longitude"];
const idNames = ["tag.local.identifier", "idcollar", "tag-local-identifier"];



const FileLoader = (props) => {
    const [showList, setShowList] = useState(false);

    const [showIds, setShowIds] = useState(true);
    let idLoc = 0;

    const fileReader = new FileReader();

    const changeFile = (e) => {
        console.log(e.target.files[0]);
        let file = e.target.files[0];
        if (file) {
            setFile(file);
        }
    }

    const setFile = (file) => {
        fileReader.onload = function (event) {
            if (event.target != null) {
                const csvOutput = event.target.result;
                csvFileToArray(csvOutput);
            }
        };
        fileReader.readAsText(file);
    }

    const csvFileToArray = (str) => {
        str = str.replaceAll('"', "");
        const csvHeader = str.slice(0, str.indexOf("\n")).split(",");
        const csvRows = str.slice(str.indexOf("\n") + 1).split("\n");
        const tags = csvHeader;

        let _latTag = "";
        let _longTag = "";
        let _idTag = "";
        latNames.forEach(name => {
            if (tags.includes(name)) _latTag = name;
        });
        longNames.forEach(name => {
            if (tags.includes(name)) _longTag = name;
        });
        idNames.forEach(name => {
            if (tags.includes(name)) _idTag = name;
        });
        props.setIdTagName(_idTag);


        let ids = [];
        let id_to_time_range = {};

        let _data = csvRows.map((i) => {
            const values = i.split(",");
            const obj = csvHeader.reduce((object, header, index) => {
                object[header] = values[index];
                return object;
            }, {});

            if (obj["timestamp"]) obj.time = new Date(obj["timestamp"]).valueOf();
            else obj.time = (new Date(obj["year"], obj["month"], obj["day"], obj["hour"])).valueOf();

            let id = obj[_idTag];
            if (id !== undefined) {
                if (!ids.includes(id)) {
                    ids.push(id);
                    id_to_time_range[id] = { initial: obj.time, end: obj.time };
                    // if (ids.length < 20) {
                    //     ids.push(id);
                    //     id_to_time_range[id] = { initial: obj.time, end: obj.time };
                    // } else {
                    //     alert("Please make sure that your datasets have less than 20 unique IDs.");
                    //     ids.length = 0;
                    // }
                } else {
                    id_to_time_range[id].initial = Math.min(id_to_time_range[id].initial, obj.time);
                    id_to_time_range[id].end = Math.max(id_to_time_range[id].end, obj.time);
                }
            }
            return obj;
        });

        for (let id in id_to_time_range) {
            if (id_to_time_range.hasOwnProperty(id)) {
                id_to_time_range[id].initial = new Date(id_to_time_range[id].initial).toLocaleString();
                id_to_time_range[id].end = new Date(id_to_time_range[id].end).toLocaleString();
            }
        }
        
        props.setIdTimeRanges(id_to_time_range);
        console.log(id_to_time_range);

        // Optionally, if you want to convert this object to a list of objects:
        let time_range_list = Object.entries(id_to_time_range).map(([id, range]) => {
            return { id, initial: range.initial, end: range.end };
        });

        // time_range_list now contains the desired structure

        ids.sort((_a, _b) => {
            let a = parseInt(_a);
            let b = parseInt(_b);
            if (a > b) return 1;
            if (b > a) return -1;
            return 0;
        })
        props.setIds(ids);
        if (!props.dataset) {
            props.setDisplayingIds(ids.map((id, i) => i == 0));
        }

        props.setColors(ids.map((id, i) => hueToHex(i / ids.length)));

        let _tagsMatrix = [];

        tags.forEach((tag, i) => {
            if (tag == "tag.local.identifier") {
                idLoc = i
            }
            //add statement to skip tag.local.identifier
            if (!isNaN(_data[0][tag])) {
                let min = Number.POSITIVE_INFINITY;
                let max = Number.NEGATIVE_INFINITY;
                _data.forEach(obj => {
                    let v = parseFloat(obj[tag]);
                    if (v < min) min = v;
                    if (v > max) max = v;
                });
                _tagsMatrix.push({
                    "name": tag,
                    "min": min,
                    "max": max
                });
            }
        });

        props.setTagsMatrix(_tagsMatrix);
        console.log(_tagsMatrix)
        console.log("INDEX FOR TAGFORLINE " + props.tagForLineColorIndex);
        props.setTagForLineColor(_tagsMatrix[props.tagForLineColorIndex]);

        let min_lat = 1000;
        let max_lat = -1000;
        let min_long = 1000;
        let max_long = -1000;

        // Find min and max, and split the data depending on id 
        let paths = [];


        let lats = [];
        let longs = [];
        ids.forEach(id => paths.push([]));
        let initialTime = new Date(_data[0].time).valueOf();
        console.log("INITIAL " + initialTime.toString());
        let endingTime = 0;
        for (let i = 0; i < _data.length; i++) {
            let obj = _data[i];
            let id = obj[_idTag];
            let time = obj.time;
            if (time < initialTime) initialTime = time;
            else if (time > endingTime) endingTime = time;
            if (id != undefined) paths[ids.indexOf(id)].push(obj);
            let coord = [obj[_latTag], obj[_longTag]];
            if (coord[0] && coord[1]) {
                let lat = parseFloat(coord[0]);
                let long = parseFloat(coord[1]);

                lats.push(lat);
                longs.push(long);
                
            }
        }

        min_lat = Math.min(...lats);
        max_lat = Math.max(...lats);

        min_long = Math.min(...longs);
        max_long = Math.max(...longs);
        // Calculate zoom
        let tileDistance = 0;
        let count = 0;
        while (tileDistance < 2 && count < 100) {
            var min_x = Math.floor(long2tile(min_long, count));
            var min_y = Math.floor(lat2tile(min_lat, count));
            var max_x = Math.floor(long2tile(max_long, count));
            var max_y = Math.floor(lat2tile(max_lat, count));

            tileDistance = Math.sqrt(Math.pow(min_x - max_x, 2) + Math.pow(min_y - max_y, 2));

            count++;
        }

        let local_centers = [];
        for(let i = 0; i < paths.length; i++){
            let local_min_lat = 1000;
            let local_max_lat = -1000;
            let local_min_long = 1000; 
            let local_max_long = -1000;
            let id = "";
            for(let j = 0; j < paths[i].length; j++){
                id = paths[i][j][_idTag];
                    let lat = parseFloat(paths[i][j][_latTag]);
                    let long = parseFloat(paths[i][j][_longTag]);
                    if (lat > local_max_lat) local_max_lat = lat;
                    if (lat < local_min_lat) local_min_lat = lat;
                    if (long > local_max_long) local_max_long = long;
                    if (long < local_min_long) local_min_long = long;

            }
            var obj = {};
            obj["center"] = [(local_min_lat + local_max_lat) / 2, (local_min_long + local_max_long) / 2]
            local_centers.push(obj);
            


        }
       // console.log(local_centers);
        
        props.setLocalCenters(local_centers);

        let zoom = count - 1;

        props.setZoom(zoom);
        props.setCenter([(min_lat + max_lat) / 2, (min_long + max_long) / 2]);

        props.setData(_data);
        props.setLatTag(_latTag);
        props.setLongTag(_longTag);
        props.setPolylines(paths);
        props.setInitialTime(initialTime);
        props.setEndingTime(endingTime);
    };

    const loadDataset = (url) => {
        fetch(url)
            .then(res => res.blob())
            .then(blob => {
                setFile(blob);
            });
    }

    const dataIndex = [
        {
            name: "Albatross",
            onClick: () => loadDataset(Albatross)
        },
        {
            name: "Vulture",
            onClick: () => loadDataset(TurkeyVulture)
        }


    ];


    return (
        <div>
            <div className={styles.publicDatasetsMessage} margin-right="auto" >Demo Public Datasets:</div>
            <Dropdown className={styles.dropdownStyle} >
                <Dropdown.Toggle className={styles.btnSuccess}>
                    Select
                </Dropdown.Toggle>

                <Dropdown.Menu>
                {dataIndex.map((item, i) => {
                    return (
                       
                        <Dropdown.Item key={i} onClick={() => item.onClick()}>{item.name}</Dropdown.Item>
                    )
                })}
                  
                </Dropdown.Menu>
            </Dropdown>
            {/* <div className={styles.datasetsList} margin-right="auto">
                {dataIndex.map((item, i) => {
                    return (
                        <div className={styles.datasetsButtonText} key={i} onClick={() => item.onClick()}>{item.name}</div>
                    )
                })}
            </div> */}  
            <input id="file-upload" className={styles.hide} type="file" onChange={(e) => changeFile(e)}></input>

        </div>
    )
}

export default FileLoader;