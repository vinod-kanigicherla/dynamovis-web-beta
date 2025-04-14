import { useState, useEffect } from "react";
import styles from "./FadeSelector.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import * as Icon from 'react-bootstrap-icons';

const speeds = [
    {
        name: "no fade",
        value: false
    },
    {
        name: "1 minute",
        value: 60000
    },
    {
        name: "1 hour",
        value: 3600000
    },
    {
        name: "1 day",
        value: 86400000
    },
    {
        name: "1 week",
        value: 604800000
    },
    {
        name: "1 month",
        value: 2678400000
    },
    {
        name: "1 year",
        value: 31536000000
    }
]

const FadeSelector = (props) => {
    const [selected, setSelected] = useState(speeds.findIndex(n => n.value == props.fade));

    useEffect(() => {
        props.setFade(speeds[selected].value);
    }, [selected]);

    useEffect(() => {
        let index = selected; 
        console.log("INDEX" + index);
        if (index >= 0) setSelected(index);
    }, [props.fade]);

    const up = () => { setSelected((selected + 1) % speeds.length) }
    const down = () => {
        let n = selected - 1;
        if (n < 0) n += speeds.length;
        setSelected(n);
    };

    return <div className={styles.wrapper}>
        <Icon.HourglassSplit size="25px"/>
        <div className={styles.label}>Fade:</div>
        <div id={styles.Fade}>
            <FontAwesomeIcon className={styles.icon} icon={faAngleUp} onClick={up} />
            <div className={styles.name}>{speeds[selected].name }</div>
            <FontAwesomeIcon className={styles.icon} icon={faAngleDown} onClick={down} />
        </div>
    </div>
}

export default FadeSelector;