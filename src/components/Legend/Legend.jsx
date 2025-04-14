import Sketch from "react-p5";
import styles from "./Legend.module.css";
import { getGradientColor } from "../../utils/color";

const Legend = (props) => {

    const setup = (p5, canvasParentRef) => {
        let canvas = p5.createCanvas(200, 15).parent(canvasParentRef);
    }

    var changed = false;
    var curr = props.tagForLineSize;
    const draw = (p5) => {
     
        p5.clear();
        let nBoxes = 10;
        let boxSize = p5.width / nBoxes;
     
       
        for (let i = 0; i < p5.width / nBoxes; i++) {

            var boxHeight = (Math.abs(props.tagForLineSize.max/((p5.width/nBoxes) - i)) / (props.tagForLineSize.max - (props.tagForLineSize.min))) + 0.1;
            //p5.fill(props.gradientLine(i * boxSize / p5.width, [255, 0, 0], [0, 255, 0]));
            //p5.line(i, 0, i, p5.height);
            p5.rect(i * boxSize, 0, boxSize, boxHeight*15);
        }
    }

    const Line = () => <div className={styles.line} />

    return <div id={styles.Legend}>
        {props.tagForLineSize ? (
            <div>
                <div className={styles.minMax}>


                    <div className={styles.min}>{props.tagForLineSize.min} <Line /></div>
                    <div className={styles.max}>{props.tagForLineSize.max} <Line /></div>


                </div>  
                <Sketch setup={setup} draw={draw} />
                <div className = {styles.title}>{props.tagForLineSize.name} </div>
            </div>
        ) : <div> </div>
        }
    </div>

}

export default Legend;