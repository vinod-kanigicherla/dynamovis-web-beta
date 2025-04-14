import styles from "./TimeBar.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from "react";
import { faPlay, faStop, faPause, faRotateLeft } from '@fortawesome/free-solid-svg-icons'
import SpeedSelector from "../SpeedSelector/SpeedSelector";
import * as Icon from 'react-bootstrap-icons';
import FadeSelector from '../FadeSelector/FadeSelector';
import Modal from 'react-bootstrap/Modal';
import { formatDate, hextoRGB } from '../../utils/color';
import Legend from "../Legend/Legend.jsx";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


const TimeBar = (props) => {

    let ratio = 100 * (props.time - props.initialTime) / (props.endingTime - props.initialTime);

    const clickPad = (e) => {
        const element = document.getElementById(styles.pad);
        var rect = element.getBoundingClientRect();
        let ratio = (e.screenX - rect.left) / (rect.right - rect.left);
        let newTime = props.initialTime + ratio * (props.endingTime - props.initialTime);
        props.setTime(newTime);
        props.pause();
    }

    const [show, setShow] = useState(false);

    const handleClose = () => {
        // console.log("handling close" + props.fade + props.speed);
        //  props.setFade(props.fade);
        //  props.setSpeed(props.speed);
        setShow(false);
    }
    const handleShow = () => setShow(true);

    console.log("BEFORE MODAL" + props.speed);


    return <div className={styles.TimeBar}>
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title> <h1> Settings</h1></Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className={styles.wrapper}>
                    <SpeedSelector setSpeed={props.setSpeed} speed={props.speed} />

                    {/* <div
                    className={props.loop ? styles.activeLoop : styles.nonActiveLoop}
                    onClick={() => props.setLoop(!props.loop)}
                >
                    <FontAwesomeIcon className={styles.loopIcon} icon={faRotateLeft} />
                    Loop
                </div> */}
                    <FadeSelector setFade={props.setFade} fade={props.fade} />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleClose} className={styles.dropDown}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose} className={styles.dropDown}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
        <Container>
            <Col>
            <div className={styles.dateTag}>
                local-time: {formatDate(new Date(props.time))}

            </div>
            <div className={styles.legendContainer}>
                
                <Legend tagForLineSize={props.tagForLineSize} />
            </div>
            </Col>
        </Container>
        <div className={styles.line}>
            <div className={styles.Ball} style={{ marginLeft: `${ratio}%` }} />
            <div id={styles.pad} onClick={(e) => clickPad(e)} />
        </div>

        <div className={styles.buttons}>
            {!props.playing && <div className={styles.btn} onClick={() => props.setPlaying(true)}>
                <FontAwesomeIcon className={styles.playIcon} icon={faPlay} />
            </div>}
            {props.playing && <div className={styles.btn} onClick={props.pause}>
                <FontAwesomeIcon className={styles.playIcon} icon={faPause} />
            </div>}
            <div className={styles.btn} onClick={props.stop}>
                <FontAwesomeIcon className={styles.playIcon} icon={faStop} />
            </div>
        </div>

        <div className={styles.toggle}>
          <p className={styles.toggleFont}>
            2D Only
          </p>

          <>
            <label className='flex cursor-pointer select-none items-center'>
              <div className='relative'>
                <input
                  type='checkbox'
                  checked={props.setMapCubeToggle}
                  onChange={props.handleCheckboxChange}
                  className='sr-only'
                />
                <div
                  className={`box block h-8 w-14 rounded-full ${props.mapCubeToggle ? 'bg-blue-200' : 'bg-gray-400'
                    }`}
                >
                </div>
                <div
                  className={`absolute left-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white transition ${props.mapCubeToggle ? 'translate-x-full' : ''
                    }`}
                ></div>
              </div>
            </label>
          </>

          <p className={styles.toggleFont}>
            2D and 3D
          </p>
        </div>

        <div className={styles.splitRow}>

            <Icon.Gear size={35} className={styles.settings} onClick={handleShow} />
            {/* 
            <SpeedSelector setSpeed={props.setSpeed} speed={props.speed} />

            <div
                className={props.loop ? styles.activeLoop : styles.nonActiveLoop}
                onClick={() => props.setLoop(!props.loop)}
            >
                <FontAwesomeIcon className={styles.loopIcon} icon={faRotateLeft} />
                Loop
            </div>
            <FadeSelector setFade={props.setFade} /> */}
        </div>
    </div>
}

export default TimeBar;