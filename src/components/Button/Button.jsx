import styles from "./Button.module.css";

const Button = (props) => {
    return (
        <div className={styles.buttonContainer}>
            <div className={styles.Button} onClick={props.onClick}>
                {props.children}
            </div>
        </div>
    )
}

export default Button;