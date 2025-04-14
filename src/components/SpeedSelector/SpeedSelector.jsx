import { useState, useEffect } from "react";
import styles from "./SpeedSelector.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Icon from 'react-bootstrap-icons';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons'

const speeds = [
    {
        name: "minute/frame",
        value: 60000
    },
    {
        name: "hour/frame",
        value: 3600000
    },
{
        name: "6hours/frame",
        value: 21600000
    },  
    {
        name: "12hours/frame",
        value: 43200000
    },  
    {
        name: "day/frame",
        value: 86400000
    },
    {
        name: "week/frame",
        value: 604800000
    }
]

let savedSpeed;

const SpeedSelector = (props) => {
   
    const [selected, setSelected] = useState(speeds.findIndex(n => n.value == props.speed));

    useEffect(() => {
        props.setSpeed(speeds[selected].value);
    }, [selected]);

    useEffect(() => {
        let index = selected; 
        console.log("INDEX" + index);
        if (index >= 0) setSelected(index);
    }, [props.speed]);

    const up = () => { setSelected((selected + 1) % speeds.length)
     }
    const down = () => {
        let n = selected - 1;
        if (n < 0) n += speeds.length;
        setSelected(n);
        
    };

  

    return <div className={styles.wrapper}>
        <Icon.Speedometer2 size="25px"/>
        <div className={styles.label}>Speed:</div>
        <div id={styles.Selector}>
            <FontAwesomeIcon className={styles.icon} icon={faAngleUp} onClick={up} />
            <div className={styles.name}>{speeds[selected].name}</div>
            <FontAwesomeIcon className={styles.icon} icon={faAngleDown} onClick={down} />
        </div>
    </div>
}

export default SpeedSelector;