import styles from '../LateralPanel.module.css';
// h-screen bootstrap
const Section = (props) => {
    if (props.if) {
        return <div className={styles.Section}> 
            {props.children}
        </div>
    }
}

export default Section;