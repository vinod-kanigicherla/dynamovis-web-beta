import { useState } from "react";
import styles from "./PropertiesSelector.module.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons'

const PropertiesSelector = (props) => {
    const [toggled, setToggled] = useState(false);
    const [colorSync, setColorSync] = useState(false);

    const selectGradient = (tag) => {
        props.setTag(tag);
        setToggled(false);
        if (props.tag !== props.idTagName) {
            props.setColorSync(true);
          }
    }


    if (props.tag) {
        return <div className={styles.PropertiesSelector}>
            {toggled && <div className={styles.background} onClick={() => setToggled(false)} />}
            <div className={styles.label}>{props.label}:</div>
            <div className={styles.Selector}>
                <div className={styles.selected} onClick={() => setToggled(!toggled)}>
                    <div>{props.tag.name}</div>
                    <FontAwesomeIcon icon={toggled ? faAngleDown : faAngleRight} />
                </div>
                {toggled && <div className={styles.tagMatrix}>
                    {props.tagsMatrix.map((tag, i) => {
                    
                        return <div key={i} onClick={() => selectGradient(tag) } className={tag.name == props.idTagName ? styles.boldOption : styles.option}>
                            {tag.name}
                        </div>
                    })}
                </div>}
            </div>
        </div>
    } else {
        return null;
    }
}

export default PropertiesSelector;