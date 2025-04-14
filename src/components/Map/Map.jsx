import { MapContainer, TileLayer, useMap, Circle } from 'react-leaflet';
import React, { useState, useEffect, useMemo } from 'react';
import styles from "./Map.module.css";
import { Hotline } from "../Hotline/Hotline";
import { formatDate, singularToGradient } from '../../utils/color';
import { colorFunction } from "../../utils/color";
import { Polyline } from 'react-leaflet';


function Map(props) {
    const [lineGradient, setLineGradient] = useState({ 0.0: '#000000', 0.5: '#ffff00', 1.0: '#ff0000' });
    const [pointsGradient, setPointsGradient] = useState({ 0.0: '#000000', 0.5: '#ffff00', 1.0: '#ff0000' });

    useEffect(() => {
        if (props.displayPoints) {
            props.setDisplayPoints(false);

            const timer = setTimeout(() => {
                props.setDisplayPoints(true);
            }, 10);
            return () => clearTimeout(timer);
        }
    }, [lineGradient, pointsGradient]);

    useEffect(() => {
        setLineGradient(
            {
                0.0: colorFunction(0, props.gradientLine),
                1.0: colorFunction(1, props.gradientLine)
            }
        );
    }, [props.gradientLine]);

    useEffect(() => {
        setPointsGradient(
            {
                0.0: colorFunction(0, props.gradientPoints),
                1.0: colorFunction(1, props.gradientPoints)
            }
        );
    }, [props.gradientPoints]);

    const InteractivePolyLine = () => {
        const map = useMap();
        useEffect(() => {
            if (props.center.length > 1 && props.polylines[0].length > 1) {
                if (props.zoom > 0) {
                    map.setView(props.center, props.zoom);
                    //props.setZoom(-1);
                } else {
                    map.setView(props.center);
                }
            }
        }, props.polylines);

        return (
            <div>
                {props.polylines.map((polyline, i) => {

                   
                    if (props.displayingIds[i]) {
                
                        let fadedCoords = [];
                        let coords = [];

                        polyline.forEach(c => {
                            if (c.time < props.time) {
                                if (props.fade) {
                                    if (c.time > (props.time - props.fade)) {
                                        coords.push(c);
                                    } else {
                                        fadedCoords.push(c);
                                    }

                                }else{
                                coords.push(c);
                                }
                            }})
                            let palette;
                            let identifier = props.tagForLineColor.name == props.idTagName;
                            if (identifier) palette = { 0.0: props.colors[i] };
                            else palette = lineGradient;



                        return props.fade ? <div>
                            <Hotline
                               
                                //pathOptions={props.lineConfig}
                                positions={coords.map(pos => {
                                    if (0 < pos.time) return [pos[props.latTag], pos[props.longTag], pos[props.tagForLineColor.name]]
                                    return null;
                                }
                                )}
                                palette={palette}
                                color={props.colors[i]}
                                outlineWidth={0}
                                min={props.tagForLineColor.min}
                                max={props.tagForLineColor.max}
                                weight={props.lineWidth}
                            />

                            <Polyline
                               
                                //pathOptions={props.lineConfig}
                                positions={fadedCoords.map(pos => {
                                    if (0 < pos.time) return [pos[props.latTag], pos[props.longTag], pos[props.tagForLineColor.name]]
                                    return null;
                                }
                                )}
                               color="rgba(255,255,255,0.5)"
                                opacity={0.3}
                                outlineWidth={0}
                                min={props.tagForLineColor.min}
                                max={props.tagForLineColor.max}
                                weight={2}
                            />

                        </div> : <Hotline
                            
                            pathOptions={props.lineConfig}
                            positions={coords.map(pos => {
                                if (0 < pos.time) return [pos[props.latTag], pos[props.longTag], pos[props.tagForLineColor.name]]
                                return null;
                            }
                            )}
                            palette={palette}
                            color={props.colors[i]}
                            outlineWidth={0}
                            min={props.tagForLineColor.min}
                            max={props.tagForLineColor.max}
                            // weight={coords.map(pos => {
                            //     return ((parseFloat(pos[props.tagForLineColor.name]) - props.tagForLineColor.min) / (props.tagForLineColor.max - props.tagForLineColor.min) * 10)
                            // })}
                            // weight={(parseFloat(coords[i][props.tagForLineColor.name]) - props.tagForLineColor.min) / (props.tagForLineColor.max - props.tagForLineColor.min) * 10}
                            weight = {props.lineWidth}
                        />


                    }



                    // if(props.displayingIds[i] && props.fade){
                    //     console.log("DISPLAYING");
                    //     let fadedCoords = [];

                    //     polyline.forEach(c => {if (c.time < props.time - props.fade) fadedCoords.push(c)});
                    //     console.log(fadedCoords.toString());
                    //     return <Hotline
                    //     key={i}
                    //     pathOptions={props.lineConfig}
                    //     positions={fadedCoords.map(pos => {
                    //         if (0 < pos.time) return [pos[props.latTag], pos[props.longTag], pos[props.tagForLineColor.name]]
                    //         return null;
                    //     }
                    //     )}
                    //     palette={palette}
                    //     outlineWidth={0}
                    //     min={props.tagForLineColor.min}
                    //     max={props.tagForLineColor.max}
                    //     weight={props.lineWidth}
                    // />
                    // }

                })}
            </div>
        )
    }

    return (
        <div id={props.preconf ? styles.MapPreconf : styles.Map}>
            {props.tagForLineColor && <div className={styles.dateTag}>local-time: {formatDate(new Date(props.time))}</div>}

            <MapContainer center={props.center} zoom={props.zoom} scrollWheelZoom={true} zoomControl={false}>
                <TileLayer key={props.baseMap.url} url={props.baseMap.url} />
                {
                    props.displayPoints && props.polylines.map((polyline, i) => {
                        if (props.displayingIds[i]) {
                            return polyline.map((coord, j) => {
                                if (props.time > coord.time && (props.fade ? (coord.time > props.time - props.fade) : true)) {
                                    let r = (coord[props.tagForPointSize.name] - props.tagForPointSize.min) / (props.tagForPointSize.max - props.tagForPointSize.min);
                                    let c = (coord[props.tagForPointColor.name] - props.tagForPointColor.min) / (props.tagForPointColor.max - props.tagForPointColor.min);

                                    let identifier = props.tagForPointColor.name == props.idTagName;
                                    let color = identifier ? props.colors[i] : colorFunction(c, props.gradientPoints);

                                    return (
                                        <Circle
                                            key={`${i},${j},${c}`}
                                            center={[coord[props.latTag], coord[props.longTag]]}
                                            radius={r * 30000}
                                            stroke={false}
                                            fillColor={[color]}
                                            fillOpacity={1}
                                        />
                                    )
                                } else return null;

                            })
                        } else return null;
                    })
                }
                {props.displayLine && props.polylines.length > 0 && <InteractivePolyLine/>}
            </MapContainer>
        </div>
    );
}

export default Map;