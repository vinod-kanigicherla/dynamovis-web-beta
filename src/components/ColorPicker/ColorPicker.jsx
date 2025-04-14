import styles from "./ColorPicker.module.css";

const ColorPicker = (props) => {
    return <div id={styles.ColorPicker} style={{ backgroundColor: props.color }} />
}

export default ColorPicker;