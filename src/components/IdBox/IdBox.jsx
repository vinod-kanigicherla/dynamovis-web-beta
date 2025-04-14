import styles from "./IdBox.module.css";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faClock } from '@fortawesome/free-solid-svg-icons';
import ColorPicker from "../ColorPicker/ColorPicker";
import Row from "react-bootstrap/Row";

const IdBox = (props) => {
    const timeRange = props.idTimeRanges[props.id];
    const [isTimeRangeVisible, setIsTimeRangeVisible] = useState(false);

    const displayTimeRange = timeRange ? (
        <div>
          <p className="font-bold text-sm">Start:</p> {new Date(timeRange.initial).toLocaleString()}<br />
          <p className="font-bold text-sm">End:</p> {new Date(timeRange.end).toLocaleString()}
        </div>
      ) : 'Time Range Not Available';
      

    let active = props.displayingIds[props.i];
    return <div className={styles.idContainer}>
        
        <div onClick={props.onClick}>{props.id}</div>
        <div className={`${styles.padding} d-flex align-items-center`}>
                <FontAwesomeIcon onClick={props.onClick} icon={props.displayingIds[props.i] ? faEye : faEyeSlash} className={active ? styles.activeId : styles.inactiveId}/>
                <FontAwesomeIcon
                    icon={faClock}
                    className={`${active ? styles.activeId : styles.inactiveId} ml-2`}
                    onClick={() => setIsTimeRangeVisible(!isTimeRangeVisible)}
                />
                {isTimeRangeVisible && (
                    <div className={styles.time_range_box}>
                        {displayTimeRange}
                    </div>
                )}
                
        </div>
        <div className={styles.colorPickerContainer}>
            <ColorPicker color={props.color} />
        </div>
        {/* <p className="ml-3">{displayTimeRange}</p> */}
        
    </div>

}

export default IdBox;