import React, { useState, useEffect } from 'react';
import styles from './SpaceTimeCube.module.css';
import Sketch from "react-p5";
import Roboto from "../../assets/Roboto-Medium.ttf";
import { MINUTE, HOUR, DAY, WEEK, MONTH, YEAR } from '../../utils/constants';
import { colorFunction } from '../../utils/color';
import { lat2tile, long2tile } from '../../utils/mapUtils';
import { hextoRGB } from '../../utils/color';

function SpaceTimeCube(props) {
    const [latObj, setLatObj] = useState();
    const [longObj, setLongObj] = useState();
    const [font, setFont] = useState();
    const [nDivisions, setNDivisions] = useState(1);
    const [img, setImg] = useState();
    const [imgA, setImgA] = useState();
    const [imgB, setImgB] = useState();
    const [imgC, setImgC] = useState();
    const [imgD, setImgD] = useState();
    const [imgE, setImgE] = useState();
    const [imgF, setImgF] = useState();
    const [imgG, setImgG] = useState();
    const [imgH, setImgH] = useState();
    const [imgI, setImgI] = useState();
    const [imgJ, setImgJ] = useState();
    const [imgK, setImgK] = useState();
    const [imgL, setImgL] = useState();
    const [imgM, setImgM] = useState();
    const [imgN, setImgN] = useState();
    const [imgO, setImgO] = useState();
    const [imgP, setImgP] = useState();
    const [imgQ, setImgQ] = useState();
    const [imgR, setImgR] = useState();
    const [imgS, setImgS] = useState();
    const [imgT, setImgT] = useState();
    const [imgU, setImgU] = useState();
    const [imgV, setImgV] = useState();
    const [imgW, setImgW] = useState();
    const [imgX, setImgX] = useState();

    const [currentMap, setCurrentMap] = useState();
    const [currentCenter, setCurrentCenter] = useState();
    const [timeTag, setTimeTag] = useState();

    // The tiles are not really centered to the center of the data,
    // so we need to calculate which is actually the displayed center:
    const [actualCenter, setActualCenter] = useState();
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

    function coord2tile(coord, zoom) {
        var x = Math.floor(long2tile(coord[1], zoom)); // get x long2tile
        var y = Math.floor(lat2tile(coord[0], zoom));  // get y lat2tile
        return [x, y, zoom];
    }

    function getColorFromPalette(value, palette, p5) {
        const color1 = p5.color(palette[0.0]);
        const color2 = p5.color(palette[1.0]);
        const colorGradient = p5.lerpColor(color1, color2, value);
        return colorGradient;

    }

    function tile2coord(x, y, z) {
        var longitude = x / Math.pow(2, z) * 360 - 180;
        var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
        var latitude = 180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)));
        return [latitude, longitude];
    }

    const getUrl = (x, y, z) => {
        let tile = coord2tile(props.center, Math.floor(props.zoom));

        let url = props.baseMap.forCube;
        url = url.replace("{x}", tile[0] + x);
        url = url.replace("{y}", tile[1] + y);
        url = url.replace("{z}", tile[2] + z);
        return url;
    }

    const ratioToDate = (ratio) => {
        let now = props.initialTime + ratio * (props.endingTime - props.initialTime)
        return (new Date(now)).toISOString().split('T')[0];
    }


    useEffect(() => {
        var _latObj = props.tagsMatrix.filter(obj => {
            return obj.name === props.latTag
        })[0];
        var _longObj = props.tagsMatrix.filter(obj => {
            return obj.name === props.longTag
        })[0];

        setLatObj(_latObj);
        setLongObj(_longObj);

        let dif = props.endingTime - props.initialTime;

        let unit;
        if (dif < HOUR) {
            unit = MINUTE;
            setTimeTag("Minute");
        } else if (dif < DAY) {
            unit = HOUR;
            setTimeTag("Hour");
        } else if (dif < WEEK) {
            unit = DAY;
            setTimeTag("Day");
        } else if (dif < MONTH) {
            unit = WEEK;
            setTimeTag("Week");
        } else if (dif < YEAR) {
            unit = MONTH;
            setTimeTag("Month");
        } else {
            unit = MONTH;
            setTimeTag("Time");
        }
        let n = dif / unit;
        setNDivisions(n);

    }, [props.tagsMatrix]);

    const setup = (p5, canvasParentRef) => {

        p5.disableFriendlyErrors = true;
        let w = window.screen.width * 0.35;
        let h = window.innerHeight;
        p5.createCanvas(w, h, p5.WEBGL).parent(canvasParentRef);
        p5.background(0);



    };

    let zoom = 20;
    const boxSize = 400;

    const preload = (p5) => {
        let _font = p5.loadFont(Roboto);

        setImages(p5);

        setCurrentMap(props.baseMap);
        setCurrentCenter(props.center);
        setFont(_font);
    }

    function setImages(p5) {
        setImg(p5.loadImage(getUrl(0, 0, 0)));
        setImgA(p5.loadImage(getUrl(0, -1, 0)));
        setImgB(p5.loadImage(getUrl(1, -1, 0)));
        setImgC(p5.loadImage(getUrl(1, 0, 0)));
        setImgD(p5.loadImage(getUrl(1, 1, 0)));
        setImgE(p5.loadImage(getUrl(0, 1, 0)));
        setImgF(p5.loadImage(getUrl(-1, 1, 0)));
        setImgG(p5.loadImage(getUrl(-1, 0, 0)));
        setImgH(p5.loadImage(getUrl(-1, -1, 0)));

        setImgI(p5.loadImage(getUrl(-1, -2, 0)));
        setImgJ(p5.loadImage(getUrl(0, -2, 0)));
        setImgK(p5.loadImage(getUrl(1, -2, 0)));
        setImgL(p5.loadImage(getUrl(2, -2, 0)));
        setImgM(p5.loadImage(getUrl(2, -1, 0)));
        setImgN(p5.loadImage(getUrl(2, 0, 0)));
        setImgO(p5.loadImage(getUrl(2, 1, 0)));
        setImgP(p5.loadImage(getUrl(2, 2, 0)));
        setImgQ(p5.loadImage(getUrl(1, 2, 0)));
        setImgR(p5.loadImage(getUrl(0, 2, 0)));
        setImgS(p5.loadImage(getUrl(-1, 2, 0)));
        setImgT(p5.loadImage(getUrl(-2, 2, 0)));
        setImgU(p5.loadImage(getUrl(-2, 1, 0)));
        setImgV(p5.loadImage(getUrl(-2, 0, 0)));
        setImgW(p5.loadImage(getUrl(-2, -1, 0)));
        setImgX(p5.loadImage(getUrl(-2, -2, 0)));
    }

    function coordToPosition(coord, zoom, refTile) {
        let x = (long2tile(coord[1], zoom) - refTile[0]) * boxSize;
        let y = (lat2tile(coord[0], zoom) - refTile[1]) * boxSize;
        return [x, y];
    }

    const draw = (p5) => {
        if (props.baseMap != currentMap || props.center != currentCenter) {

            setImages(p5);


            setCurrentMap(props.baseMap);
            setCurrentCenter(props.center);
        }

        p5.cursor(p5.HAND);
        p5.orbitControl();

        p5.background(255);
        p5.textFont(font);




        p5.stroke(0);
        p5.noFill();
        p5.rotateY(-0.3);
        p5.strokeWeight(0.5);
        if (props.showBox) p5.box(boxSize);
        p5.stroke(0);
        p5.fill(0);

        p5.imageMode(p5.CENTER)

        p5.push();
        p5.rotateX(p5.HALF_PI);
        p5.translate(0, 0, -boxSize / 2);



        if (props.ids.length > 0 && props.showMapIn3d) {
            p5.image(img, 0, 0, boxSize, boxSize);
            p5.image(imgA, 0, -boxSize, boxSize, boxSize);
            p5.image(imgB, boxSize, -boxSize, boxSize, boxSize);
            p5.image(imgC, boxSize, 0, boxSize, boxSize);
            p5.image(imgD, boxSize, boxSize, boxSize, boxSize);
            p5.image(imgE, 0, boxSize, boxSize, boxSize);
            p5.image(imgF, -boxSize, boxSize, boxSize, boxSize);
            p5.image(imgG, -boxSize, 0, boxSize, boxSize);
            p5.image(imgH, -boxSize, -boxSize, boxSize, boxSize);

            p5.image(imgI, -boxSize, -boxSize * 2, boxSize, boxSize);
            p5.image(imgJ, 0, -boxSize * 2, boxSize, boxSize);
            p5.image(imgK, boxSize, -boxSize * 2, boxSize, boxSize);
            p5.image(imgL, boxSize * 2, -boxSize * 2, boxSize, boxSize);
            p5.image(imgM, boxSize * 2, -boxSize, boxSize, boxSize);
            p5.image(imgN, boxSize * 2, 0, boxSize, boxSize);
            p5.image(imgO, boxSize * 2, boxSize, boxSize, boxSize);
            p5.image(imgP, boxSize * 2, boxSize * 2, boxSize, boxSize);
            p5.image(imgQ, boxSize, boxSize * 2, boxSize, boxSize);
            p5.image(imgR, 0, boxSize * 2, boxSize, boxSize);
            p5.image(imgS, -boxSize, boxSize * 2, boxSize, boxSize);
            p5.image(imgT, -boxSize * 2, boxSize * 2, boxSize, boxSize);
            p5.image(imgU, -boxSize * 2, boxSize, boxSize, boxSize);
            p5.image(imgV, -boxSize * 2, 0, boxSize, boxSize);
            p5.image(imgW, -boxSize * 2, -boxSize, boxSize, boxSize);
            p5.image(imgX, -boxSize * 2, -boxSize * 2, boxSize, boxSize);

            // References
            p5.push();
            p5.translate(0, -1, 0);
            p5.stroke(100);
            p5.strokeWeight(2);
            p5.line(-boxSize * 2.5, boxSize * -1.5, boxSize * 2.5, boxSize * -1.5);
            p5.line(-boxSize * 2.5, boxSize * -0.5, boxSize * 2.5, boxSize * -0.5);
            p5.line(-boxSize * 2.5, boxSize * 0.5, boxSize * 2.5, boxSize * 0.5);
            p5.line(-boxSize * 2.5, boxSize * 1.5, boxSize * 2.5, boxSize * 1.5);
            p5.rotateZ(p5.HALF_PI);
            p5.line(-boxSize * 2.5, boxSize * -1.5, boxSize * 2.5, boxSize * -1.5);
            p5.line(-boxSize * 2.5, boxSize * -0.5, boxSize * 2.5, boxSize * -0.5);
            p5.line(-boxSize * 2.5, boxSize * 0.5, boxSize * 2.5, boxSize * 0.5);
            p5.line(-boxSize * 2.5, boxSize * 1.5, boxSize * 2.5, boxSize * 1.5);
            p5.pop();
        }
        p5.pop();

        if (props.showBox) {
            const numDivisions = Math.min(5, nDivisions);
            for (let i = 1; i < numDivisions; i++) {
                let y = + 0.5 - i / numDivisions;
                let k = 10;

                p5.push();
                p5.translate(10 + boxSize / 2, y * boxSize, boxSize / 2);
                p5.textSize(10);
                p5.text(props.timeMode ? (timeTag + " " + i) : ratioToDate(i / numDivisions), 0, 0);
                p5.pop();

                p5.line(-boxSize / 2, y * boxSize, -boxSize / 2, -boxSize / 2 + k, y * boxSize, -boxSize / 2);
                p5.line(-boxSize / 2, y * boxSize, -boxSize / 2, -boxSize / 2, y * boxSize, -boxSize / 2 + k);

                p5.line(boxSize / 2, y * boxSize, -boxSize / 2, boxSize / 2 - k, y * boxSize, -boxSize / 2);
                p5.line(boxSize / 2, y * boxSize, -boxSize / 2, boxSize / 2, y * boxSize, -boxSize / 2 + k);

                p5.line(boxSize / 2, y * boxSize, boxSize / 2, boxSize / 2 - k, y * boxSize, boxSize / 2);
                p5.line(boxSize / 2, y * boxSize, boxSize / 2, boxSize / 2, y * boxSize, boxSize / 2 - k);

                p5.line(-boxSize / 2, y * boxSize, boxSize / 2, -boxSize / 2 + k, y * boxSize, boxSize / 2);
                p5.line(-boxSize / 2, y * boxSize, boxSize / 2, -boxSize / 2, y * boxSize, boxSize / 2 - k);
            }
        }

        p5.textAlign(p5.LEFT, p5.CENTER);
        if (latObj) {
            p5.push();
            p5.translate(5 + boxSize / 2, boxSize / 2, boxSize / 2);
            p5.rotateX(p5.HALF_PI);
            p5.text(latObj?.min, 0, 0);
            p5.pop();

            p5.push();
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.translate(15 + boxSize / 2, boxSize / 2, 0);
            p5.rotateX(p5.HALF_PI);
            p5.rotateZ(-p5.HALF_PI);
            p5.text("Latitude", 0, 0);
            p5.pop();

            p5.push();
            p5.translate(5 + boxSize / 2, boxSize / 2, -boxSize / 2);
            p5.rotateX(p5.HALF_PI);
            p5.text(latObj?.max, 0, 0);
            p5.pop();
        }

        if (latObj) {
            p5.push();
            p5.textAlign(p5.RIGHT, p5.CENTER);
            p5.translate(boxSize / 2, boxSize / 2, boxSize / 2);
            p5.push();
            p5.rotateY(p5.PI / 2);
            p5.rotateX(p5.HALF_PI);
            p5.text(longObj?.max, -10, 0);
            p5.pop();
            p5.pop();

            p5.push();
            p5.textAlign(p5.CENTER, p5.CENTER);
            p5.translate(0, boxSize / 2, 20 + boxSize / 2);
            p5.rotateY(-p5.HALF_PI);
            p5.rotateZ(-p5.HALF_PI);
            p5.push();
            p5.rotateY(p5.PI / 2);
            p5.text("Longitude", 0, 0);
            p5.pop();
            p5.pop();

            p5.push();
            p5.textAlign(p5.RIGHT, p5.CENTER);
            p5.translate(-5 + - boxSize / 2, boxSize / 2, boxSize / 2);
            p5.push();
            p5.rotateY(p5.PI / 2);
            p5.rotateX(p5.HALF_PI);
            p5.text(longObj?.min, -10, 0);
            p5.pop();
            p5.pop();
        }

        p5.translate(-boxSize / 2, 0, -boxSize / 2);
        //p5.strokeWeight(4);   


        if (props.polylines.length > 0) {

            props.polylines.forEach((polyline, i) => {
                if (props.displayingIds[i]) {
                    let coords = [];
                    let fadedCoords = [];



                    polyline.forEach((coord, j) => {
                        if (coord.time < props.time) {
                            if (props.fade) {
                                if (coord.time > (props.time - props.fade)) {
                                    coords.push(coord);
                                } else {
                                    fadedCoords.push(coord);
                                }

                            } else {
                                coords.push(coord);
                            }
                        }
                    });

                    if (props.fade) {





                        let previousCoord = null;

                        //actual line
                        coords.map(coord => {


                            let value = (coord[props.tagForLineColor.name] - props.tagForLineColor.min) / (props.tagForLineColor.max - props.tagForLineColor.min);
                            let identifier = props.tagForLineColor.name == props.idTagName;

                            let lineColor;
                            if (identifier) { lineColor = props.colors[i] }
                            else { lineColor = getColorFromPalette(value, lineGradient, p5); }

                            let x = coord[props.longTag] * zoom;
                            let ratio = (coord.time - props.initialTime) / (props.endingTime - props.initialTime);
                            let y = -boxSize * (ratio - 0.5);
                            let z = -coord[props.latTag] * zoom;

                            let r = (coord[props.tagForPointSize.name] - (props.tagForPointSize.min)) / (props.tagForPointSize.max - (props.tagForPointSize.min));
                            let c = (coord[props.tagForPointColor.name] - props.tagForPointColor.min) / (props.tagForPointColor.max - props.tagForPointColor.min);

                            let line_scale_factor = (coord[props.tagForLineSize.name] - (props.tagForLineSize.min)) / (props.tagForLineSize.max - (props.tagForLineSize.min));



                            coord = [coord[props.latTag] * 1., coord[props.longTag] * 1.];

                            let refTile = coord2tile(props.center, Math.floor(props.zoom));

                            // TODO: This could be more eficient. Instead of calculating the position in the sketch everytime a node
                            // is drawn, we could do it when the file is loaded.
                            let pos = coordToPosition(coord, Math.floor(props.zoom), refTile);
                            x = pos[0];
                            z = pos[1];
                            p5.push();

                            // Translate the system to have the top-left corner of the central tile as the (0, 0) coordinate.

                            if (previousCoord && props.display3DLine) {
                                p5.beginShape();    
                                p5.fill(lineColor);
                                p5.noStroke();

                            
                                p5.vertex(previousCoord.x, previousCoord.y, previousCoord.z);
                                p5.vertex(previousCoord.x, previousCoord.y, previousCoord.z);
                                p5.vertex(x, y, z);


                                p5.vertex(x, y - (line_scale_factor * 15), z);

                                p5.vertex(previousCoord.x, previousCoord.y - (previousCoord.line_scale_factor * 15), previousCoord.z);
                                p5.vertex(previousCoord.x, previousCoord.y - (previousCoord.line_scale_factor * 15), previousCoord.z);




                                
                                p5.endShape();
                            }

                            p5.translate(-boxSize / 2, 0, -boxSize / 2);
                            if (props.displayPoints) {
                                p5.translate(boxSize / 2, 0, boxSize / 2);
                                p5.translate(x, y, z);
                                let identifier = props.tagForPointColor.name == props.idTagName;
                                p5.fill(identifier ? props.colors[i] : colorFunction(c, props.gradientPoints));
                                p5.noStroke();
                                p5.sphere(1 + r * 2);
                            }



                            p5.pop();
                            previousCoord = { x, y, z, line_scale_factor };
                        });

                        //fade line
                        previousCoord = null;
                        fadedCoords.map(coord => {

                            let value = (coord[props.tagForLineColor.name] - props.tagForLineColor.min) / (props.tagForLineColor.max - props.tagForLineColor.min);
                            let identifier = props.tagForLineColor.name == props.idTagName;

                            let lineColor;
                            var rgb = hextoRGB(props.colors[i]);

                            //lineColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.25)`
                            lineColor = "rgba(255,255,255,0.1)";


                            let x = coord[props.longTag] * zoom;
                            let ratio = (coord.time - props.initialTime) / (props.endingTime - props.initialTime);
                            let y = -boxSize * (ratio - 0.5);
                            let z = -coord[props.latTag] * zoom;

                            let r = (coord[props.tagForPointSize.name] - props.tagForPointSize.min) / (props.tagForPointSize.max - props.tagForPointSize.min);
                            let c = (coord[props.tagForPointColor.name] - props.tagForPointColor.min) / (props.tagForPointColor.max - props.tagForPointColor.min);



                            coord = [coord[props.latTag] * 1., coord[props.longTag] * 1.];

                            let refTile = coord2tile(props.center, Math.floor(props.zoom));

                            // TODO: This could be more eficient. Instead of calculating the position in the sketch everytime a node
                            // is drawn, we could do it when the file is loaded.
                            let pos = coordToPosition(coord, Math.floor(props.zoom), refTile);
                            x = pos[0];
                            z = pos[1];
                            p5.push();

                            // Translate the system to have the top-left corner of the central tile as the (0, 0) coordinate.
                            if (previousCoord && props.display3DLine) {
                                p5.stroke(lineColor);
                                //linewidth3D before
                                //p5.strokeWeight(identifier ?  props.lineWidth : value * 15);
                                p5.strokeWeight(props.lineWidth);

                                p5.line(previousCoord.x, previousCoord.y, previousCoord.z, x, y, z);
                            }



                            p5.pop();
                            previousCoord = { x, y, z };




                        });


                    } else {



                        // default line with no fade

                        // This coordinates are the coordinates in the sketch, not the (lat, long) coordinates
                        // or the tile coordinates.
                        let previousCoord = null;
                        p5.noFill()


                        coords.map(coord => {

                            let value = (coord[props.tagForLineColor.name] - props.tagForLineColor.min) / (props.tagForLineColor.max - props.tagForLineColor.min);
                            let identifier = props.tagForLineColor.name == props.idTagName;

                            let lineColor;
                            if (identifier) { lineColor = props.colors[i] }
                            else { lineColor = getColorFromPalette(value, lineGradient, p5); }

                            let x = coord[props.longTag] * zoom;
                            let ratio = (coord.time - props.initialTime) / (props.endingTime - props.initialTime);
                            let y = -boxSize * (ratio - 0.5);
                            let z = -coord[props.latTag] * zoom;

                            let r = (coord[props.tagForPointSize.name] - (props.tagForPointSize.min)) / (props.tagForPointSize.max - (props.tagForPointSize.min));
                            let c = (coord[props.tagForPointColor.name] - props.tagForPointColor.min) / (props.tagForPointColor.max - props.tagForPointColor.min);

                            let line_scale_factor = (coord[props.tagForLineSize.name] - (props.tagForLineSize.min)) / (props.tagForLineSize.max - (props.tagForLineSize.min)) + 0.1 ;


                            coord = [coord[props.latTag] * 1., coord[props.longTag] * 1.];

                            let refTile = coord2tile(props.center, Math.floor(props.zoom));

                            // TODO: This could be more eficient. Instead of calculating the position in the sketch everytime a node
                            // is drawn, we could do it when the file is loaded.
                            let pos = coordToPosition(coord, Math.floor(props.zoom), refTile);
                            x = pos[0];
                            z = pos[1];
                            p5.push();

                            // Translate the system to have the top-left corner of the central tile as the (0, 0) coordinate.
                            if (previousCoord && props.displayLine) {

                                p5.beginShape();
                                p5.fill(lineColor);
                                p5.noStroke();

                                p5.vertex(previousCoord.x, previousCoord.y, previousCoord.z);
                                p5.vertex(previousCoord.x, previousCoord.y, previousCoord.z);
                                p5.vertex(x, y, z);
                                p5.vertex(x, y - (line_scale_factor * 15), z);
                                p5.vertex(previousCoord.x, previousCoord.y - (previousCoord.line_scale_factor * 15), previousCoord.z);
                                p5.vertex(previousCoord.x, previousCoord.y - (previousCoord.line_scale_factor * 15), previousCoord.z);

                                p5.endShape();
                                


                            }

                            p5.translate(-boxSize / 2, 0, -boxSize / 2);
                            if (props.displayPoints) {
                                p5.translate(boxSize / 2, 0, boxSize / 2);
                                p5.translate(x, y, z);
                                let identifier = props.tagForPointColor.name == props.idTagName;
                                p5.fill(identifier ? props.colors[i] : colorFunction(c, props.gradientPoints));
                                p5.noStroke();
                                p5.sphere(1 + r * 4);
                            }

                            p5.pop();
                            previousCoord = { x, y, z, line_scale_factor };


                        });


                    }





                }
            })
        }
    };

    return (
        <div id={props.preconf ? styles.SpaceTimeCubePreconf : styles.SpaceTimeCube}>
            <Sketch setup={setup} draw={draw} preload={preload} />
        </div>
    );
};


export default SpaceTimeCube;