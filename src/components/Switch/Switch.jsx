import React from "react";
import styles from "./Switch.module.css";

const Switch = (props) => {

    return (
        <div id={styles.Switch}>
            <div className={styles.label}>{props.label}:</div>
            <div className={styles.buttonsContainer}>
                <div className={props.value ? styles.option : styles.optionActive} onClick={() => props.setter(false)}>{props.tagA}</div>
                <div className={props.value ? styles.optionActive : styles.option} onClick={() => props.setter(true)}>{props.tagB}</div>
            </div>
        </div>
    )
}

export default Switch;