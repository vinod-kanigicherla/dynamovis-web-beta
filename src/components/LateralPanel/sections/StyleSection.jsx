import styles from '../LateralPanel.module.css';
import { useState, useEffect } from "react";
import PropertiesSelector from '../../PropertiesSelector/PropertiesSelector';
import Section from "./Section";
import GradientPicker from '../../GradientPicker/GradientPicker';
import Switch from '../../Switch/Switch';
import Form from 'react-bootstrap/Form';


const StyleSection = (props) => {

    return <Section title="Style" if={props.if}>

        

        <div className={props.displayLine ? styles.subsection : styles.subsectionOff}>
            <div className={styles.tag}>
                Line:
                <Form.Check
                    name='isGoing'
                    type='checkbox'
                    className = 'ml-2'
                    checked = {props.displayLine}
                    onChange={() => props.setDisplayLine(!props.displayLine)}
                    />
                
            </div>
            {props.displayLine && <div>
                <PropertiesSelector idTagName={props.idTagName} label="Size" tagsMatrix={props.tagsMatrix} tag={props.tagForLineSize} setTag={props.setTagForLineSize} />
                <PropertiesSelector idTagName={props.idTagName} label="Color" tagsMatrix={props.tagsMatrix} tag ={props.tagForLineColor} setTag={props.setTagForLineColor} />

                {props.tagForLineColor && props.tagForLineColor.name != props.idTagName ? <GradientPicker
                    tag={props.tagForLineColor}
                    gradient={props.gradientLine}
                    setGradient={props.setGradientLine}
                    setColorScheme={props.setLineColorScheme}
                    colorScheme={props.lineColorScheme}
                /> : <div></div>}
            </div>}
           
        </div>

        <div className={props.displayPoints ? styles.subsection : styles.subsectionOff}>

            <div className={styles.tag}>
                Points:
                <Form.Check
                    name='isGoing'
                    type='checkbox'
                    className = 'ml-2'
                    checked = {props.displayPoints}
                    onChange={() => props.setDisplayPoints(!props.displayPoints)}
                    />
                {/* <input
                    name="isGoing"
                    type="checkbox"
                    class="ml-2"
                    checked={props.displayPoints}
                    onChange={() => props.setDisplayPoints(!props.displayPoints)} />*/} 
               
            </div>

            {props.displayPoints && <div>
                <PropertiesSelector idTagName={props.idTagName} label="Size" tagsMatrix={props.tagsMatrix} tag={props.tagForPointSize} setTag={props.setTagForPointSize} />
                <PropertiesSelector idTagName={props.idTagName} label="Color" tagsMatrix={props.tagsMatrix} tag={props.tagForPointColor} setTag={props.setTagForPointColor} />

                {props.tagForPointColor && props.tagForPointColor.name != props.idTagName && <GradientPicker
                    tag={props.tagForPointColor}
                    gradient={props.gradientPoints}
                    setGradient={props.setGradientPoints}
                    setColorScheme={props.setPointsColorScheme}  
                    colorScheme = {props.pointsColorScheme}             
                 />}
            </div>}
        </div>

        <Switch label="Time mode" tagA="Absolute" tagB="Relative" value={props.timeMode} setter={props.setTimeMode} />
        <Switch label="Time cube" tagA="Hidden" tagB="Visible" value={props.showBox} setter={props.setShowBox} />
        <Switch label="Map" tagA="Hidden" tagB="Visible" value={props.showMapIn3d} setter={props.setShowMapIn3d} />

        {/* <div className={props.displayLine ? styles.subsection : styles.subsectionOff}>
            <div className={styles.tag}>
                3D Line:
                <input
                    name="isGoing"
                    type="checkbox"
                    checked={props.display3DLine}
                    onChange={() => props.setDisplay3DLine(!props.display3DLine)}
                    class="ml-2"
                />
            </div>
            {props.displayLine && <div>
                <div className={styles.selector}>
                <div className={styles.selectorLabel}>Size:</div> <input type="range" min={2} max={20} value={props.lineWidth3D} onChange={(e) => props.setLineWidth3D(e.target.value)} />
                 </div>
            </div>}
        </div> */}

    </Section>
}

export default StyleSection;