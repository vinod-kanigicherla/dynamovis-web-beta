import { useEffect, useState } from "react";
import { lat2tile, long2tile } from '../../utils/mapUtils';
import { hueToHex } from '../../utils/color';
import { faFileCsv, faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import styles from "./FileLoader.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Albatross from "../../public_data/albatross-normal-tracks-9track-tailcrosswind.csv";
import Tiger from "../../public_data/tigers/Cub1_Cub2.csv";
import TurkeyVulture from "../../public_data/Turkey-Vulture-Acopian-Center-USA-GPS-flagged-newUplift-Dec2013.csv";
import IdSelect from "./IdSelect";

const latNames = ["location-lat", "location.lat", "latitude"];
const longNames = ["location-long", "location.long", "longitude"];
const idNames = ["tag.local.identifier", "idcollar", "tag-local-identifier"];



function getMax(arr) {
    let len = arr.length;
    let max = -Infinity;

    while (len--) {
        max = arr[len] > max ? arr[len] : max;
    }
    return max;
}

function getMin(arr) {
    let len = arr.length;
    let max = Infinity;

    while (len--) {
        max = arr[len] < max ? arr[len] : max;
    }
    return max;
}

const FileLoader = (props) => {

    const [showIdSelect, setShowIdSelect] = useState(false);
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

        let _tagsMatrix = [];

        let _data = csvRows.map((i) => {
            const values = i.split(",");
            // /console.log("VALUES " + values);
            const obj = csvHeader.reduce((object, header, index) => {
               
                object[header] = values[index];
                return object;
                
            }, {});


            if (obj["timestamp"]) {

                

                //let timestamp = obj["timestamp"].replace('/[A-Za-z]+/','');
               // console.log("Time" + obj["timestamp"].toString())
               // console.log(new Date(obj["timestamp"]).toDateString());
                obj.time = new Date(obj["timestamp"]).valueOf();
               
               
            }
            else obj.time = (new Date(obj["year"], obj["month"], obj["day"], obj["hour"])).valueOf();
            let id = obj[_idTag];
            if (!ids.includes(id) && id != undefined) {
                ids.push(id);
            }
            return obj;
        });

        for (let id in id_to_time_range) {
            if (id_to_time_range.hasOwnProperty(id)) {
                id_to_time_range[id].initial = new Date(id_to_time_range[id].initial).toLocaleString();
                id_to_time_range[id].end = new Date(id_to_time_range[id].end).toLocaleString();
            }
        }

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

                tags.forEach((tag) => {
           
            if(_data[0][tag] != null){
             
            if (!isNaN(_data[0][tag])) {
               // console.log("IS NOT NAN");
                // Filter out objects where the value of tag is NaN
                _data = _data.filter(obj => !isNaN(parseFloat(obj[tag])));

                let min = Number.POSITIVE_INFINITY;
                let max = Number.NEGATIVE_INFINITY;

                _data.forEach(obj => {
                        let v = parseFloat(obj[tag]);
                        if (v < min) min = v;
                        if (v > max) max = v;
                        if (isNaN(v)) {
                            console.log("isNan")
                            console.log(obj)
                        }
                    });

                _tagsMatrix.push({
                        "name": tag,
                        "min": min,
                        "max": max
                    });
            }
        }
        });

        props.setIdTimeRanges(id_to_time_range);
        console.log(id_to_time_range);

      
        console.log(_data)
        props.setTagsMatrix(_tagsMatrix);
        console.log(_tagsMatrix)
        
        props.setTagForLineColor(_tagsMatrix[props.tagForLineColorIndex]);

        let min_lat = 0;
        let max_lat = 0;
        let min_long = 0;
        let max_long = 0;

        // Find min and max, and split the data depending on id 
        let paths = [];
        ids.forEach(id => paths.push([]));
        
        let initialTime =   new Date(_data[0].time).valueOf();
        let endingTime = 0;

        //global collection of lats and longs to use to calculate broad center
        let global_lats = [];
        let global_longs = [];
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

                global_lats.push(lat);
                global_longs.push(long);
            
            }
        }

        min_lat = getMin(global_lats);
        max_lat = getMax(global_lats);

        min_long = getMin(global_longs);
        max_long = getMax(global_longs);
        console.log(initialTime);

        // Calculate zoom
        let tileDistance = 0;
        let count = 0;
        while (tileDistance < 2 && count < 100) {
            console.log("MAX LONG" + max_long);
            console.log("MAX LAT" + max_lat);
            var min_x = Math.floor(long2tile(min_long, count));
            var min_y = Math.floor(lat2tile(min_lat, count));
            var max_x = Math.floor(long2tile(max_long, count));
            var max_y = Math.floor(lat2tile(max_lat, count));

            tileDistance = Math.sqrt(Math.pow(min_x - max_x, 2) + Math.pow(min_y - max_y, 2));

            count++;
        }


        //calcaulting id specific centers
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

        let zoom = count - 2;

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


    return (
        <div>
            <label htmlFor="file-upload" className="hover:bg-gray-100 text-gray-800 text-md mb-4 px-2 py-2 border border-gray-400 rounded shadow">
                <FontAwesomeIcon className={styles.icon} icon={faFileCsv} />
                Load CSV file
            </label>
            <input id="file-upload" className={styles.hide} type="file" onChange={(e) => changeFile(e)}></input>
        </div>
    )
}

export default FileLoader;