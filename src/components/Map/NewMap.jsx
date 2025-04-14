import React, { useState, useEffect } from 'react';
import styles from './NewMap.module.css';
import Sketch from "react-p5";
import Roboto from "../../assets/Roboto-Medium.ttf";
import { MINUTE, HOUR, DAY, WEEK, MONTH, YEAR } from '../../utils/constants';
import { colorFunction } from '../../utils/color';
import { lat2tile, long2tile } from '../../utils/mapUtils';
import { formatDate, hextoRGB } from '../../utils/color';
import Legend from "../Legend/Legend.jsx";

function NewMap(props) {
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
    let [offset, setOffset] = useState();
    let [currentScale, setCurrentScale] = useState(1);
    let [transformX, setTransformX] = useState(0);
    let [transformY, setTransformY]  = useState(0);
    const [currentMap, setCurrentMap] = useState();
    const [currentCenter, setCurrentCenter] = useState();
    const [timeTag, setTimeTag] = useState();

    // The tiles are not really centered to the center of the data,
    // so we need to calculate which is actually the displayed center:
    const [actualCenter, setActualCenter] = useState([]);
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

    let zoom = 0;
    const boxSize = 300;


    const zoomSensitivity = 0.3;

  
  

    const setup = (p5, canvasParentRef) => {

        p5.disableFriendlyErrors = true;


        let w = props.mapCubeToggle ? window.screen.width * 0.4 : window.screen.width*0.8;
        let h = window.innerHeight;
        let canvas = p5.createCanvas(w, h, p5.P2D).parent(canvasParentRef);
        p5.background(0);
        offset = p5.createVector(0, 0);
        setOffset(p5.createVector(+boxSize, +boxSize));
        console.log("Offset" + offset);

        canvas.mouseWheel(event => {
            console.log("SCROLL" + event.deltaY);
            let scaleFactor = event.deltaY < 0 ? 2 : 1;
            scaleFactor *= currentScale;
            setCurrentScale(scaleFactor);
            console.log("scale" +  currentScale);
    
           // setTransformX(p5.mouseX - (p5.mouseX * scaleFactor) + (transformX * scaleFactor));
            //setTransformY(p5.mouseY - (p5.mouseY * scaleFactor) + (transformY * scaleFactor));
            //console.log(transformX,transformY);
          //  console.log(currentScale);
        });




    };




    const preload = (p5) => {
        let _font = p5.loadFont(Roboto);

        setImages(p5);

        console.log("CENTER" + props.center[0] + props.center[1]);
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
        p5.background(255);
        p5.textFont(font);




        p5.stroke(0);
        p5.noFill();
        //p5.strokeWeight(0.5);

        //p5.stroke(0);
        //p5.fill(0);

        p5.imageMode(p5.CENTER)

        p5.push();

        //console.log(props.alignAroundId);
      



        // Mouse Panning and Movement
        if (p5.mouseIsPressed && (p5.mouseX < window.screen.width * 0.45 && p5.mouseX > 0) && (p5.mouseY < p5.height && p5.mouseY > 0)) {
            const mouse = p5.createVector(p5.mouseX, p5.mouseY);
            const relativeMouse = mouse.copy().sub(offset);
            var new_offset = p5.createVector(p5.pmouseX - p5.mouseX,p5.pmouseY - p5.mouseY)
            new_offset.x = offset.x - new_offset.x;
            new_offset.y = offset.y - new_offset.y;
            console.log("OFFSET" + offset);
            console.log("HEIGHT" + p5.height);
            console.log("WIDTH " + p5.width);
            if((new_offset.y > 0 && new_offset.y < p5.height) && (new_offset.x < boxSize*2 && new_offset.x > 324)){
            offset.x -= p5.pmouseX - p5.mouseX;
            offset.y -= p5.pmouseY - p5.mouseY;  
            setOffset(offset);
            }else{
                console.log("past");
            }

        }
        p5.translate(offset.x, offset.y);

    
        p5.translate(transformX, transformY);
        p5.scale(currentScale);



        




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
        }
        


    

     
        p5.translate(-boxSize / 2, -boxSize / 2);

        if(props.alignAroundId != 0){
            let w = props.mapCubeToggle ? window.screen.width * 0.4 : window.screen.width;
            let h = window.innerHeight;
            console.log( props.localCenters)
            console.log(props.alignAroundId);
            
            let refTile = coord2tile(props.center, Math.floor(props.zoom));
            // console.log(refTile);
            var temp = props.localCenters[props.alignAroundId].center;
            let center = coordToPosition(temp, Math.floor(props.zoom), refTile);
            console.log("CENTER " + center);
            p5.circle(center[0], center[1], 10);
            offset.x = boxSize + center[0];
            offset.y =  boxSize*2 -center[1];
            setOffset(offset);
            setCurrentScale(2);
            //p5.translate(obj.x, obj.y);
            props.setAlignAroundId(0);

        }
       
       
        



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

                        let tooltipText;
                        //actual line
                        coords.map(coord => {


                            let value = (coord[props.tagForLineColor.name] - props.tagForLineColor.min) / (props.tagForLineColor.max - props.tagForLineColor.min);
                            let identifier = props.tagForLineColor.name == props.idTagName;

                            let lineColor;
                            if (identifier) { lineColor = props.colors[i] }
                            else { lineColor = getColorFromPalette(value, lineGradient, p5); }

                            let x = coord[props.longTag] * zoom;
                            let ratio = (coord.time - props.initialTime) / (props.endingTime - props.initialTime);
                            let y = coord[props.latTag] * zoom;

                            let r = (coord[props.tagForPointSize.name] - (props.tagForPointSize.min)) / (props.tagForPointSize.max - (props.tagForPointSize.min));
                            let c = (coord[props.tagForPointColor.name] - props.tagForPointColor.min) / (props.tagForPointColor.max - props.tagForPointColor.min);

                            let line_scale_factor = (coord[props.tagForLineSize.name] - (props.tagForLineSize.min)) / (props.tagForLineSize.max - (props.tagForLineSize.min)) + 0.1;

                              let size_data_value = coord[props.tagForLineSize.name];


                            coord = [coord[props.latTag] * 1., coord[props.longTag] * 1.];

                            let refTile = coord2tile(props.center, Math.floor(props.zoom));

                            // TODO: This could be more eficient. Instead of calculating the position in the sketch everytime a node
                            // is drawn, we could do it when the file is loaded.
                            let pos = coordToPosition(coord, Math.floor(props.zoom), refTile);
                            x = pos[0];
                            y = pos[1];
                          
                            p5.push();

                     

                            if (previousCoord && props.display3DLine) {
                                p5.beginShape();
                                p5.fill(lineColor);
                                p5.noStroke();


                                p5.vertex(previousCoord.x, previousCoord.y);
                                p5.vertex(previousCoord.x, previousCoord.y);
                                p5.vertex(x, y);


                                p5.vertex(x, y - (line_scale_factor * 15));
                                p5.vertex(previousCoord.x, previousCoord.y - (previousCoord.line_scale_factor * 15));
                                p5.vertex(previousCoord.x, previousCoord.y - (previousCoord.line_scale_factor * 15));

                                p5.endShape();

                                let mouseDist = p5.dist(x, y, ((p5.mouseX - offset.x)/currentScale + boxSize / 2), ((p5.mouseY - offset.y)/currentScale + boxSize / 2))
                                if (mouseDist >= 0 && mouseDist <= 6) {

                                    tooltipText = props.tagForLineSize.name + " : " + Number(size_data_value);
                                }
                            }

                            //p5.translate(-boxSize / 2, -boxSize / 2);
                            if (props.displayPoints) {
                              //  p5.translate(boxSize / 2, boxSize / 2);
                                //p5.translate(x, y);
                                let identifier = props.tagForPointColor.name == props.idTagName;
                                p5.fill(identifier ? props.colors[i] : colorFunction(c, props.gradientPoints));
                                p5.noStroke();
                                p5.circle(x, y, r * 2);

                            }



                            p5.pop();
                            previousCoord = { x, y, line_scale_factor };
                        });
                        if (tooltipText) {
                            console.log("DISPLAYING TOOLTIP");
                            // measure the width of the tooltip
                            let w = p5.textWidth(tooltipText);

                            // save the current fill/stroke/textAlign state
                            p5.push();

                            // draw a lightgray rectangle with a dimgray border
                            p5.fill('lightgray');
                            p5.stroke('dimgray');
                            p5.strokeWeight(1);
                            // draw this rectangle slightly below and to the
                            // right of the mouse
                            p5.rect(p5.mouseX - offset.x + 10, p5.mouseY - offset.y + 180, w + 20, 24, 4);
                            p5.textAlign(p5.LEFT, p5.TOP);
                            p5.noStroke();
                            p5.fill('black');
                            p5.text(tooltipText, p5.mouseX - offset.x + 20, p5.mouseY - offset.y + 185);

                            // restore the previous fill/stroke/textAlign state
                            p5.pop();
                        }

                        //fade line
                        previousCoord = null;
                        fadedCoords.map(coord => {

                            let value = (coord[props.tagForLineColor.name] - props.tagForLineColor.min) / (props.tagForLineColor.max - props.tagForLineColor.min);
                            let identifier = props.tagForLineColor.name == props.idTagName;

                            let lineColor;
                            var rgb = hextoRGB(props.colors[i]);

                                
                            lineColor = "rgba(255,255,255,0.1)";


                            let x = coord[props.longTag] * zoom;
                            let ratio = (coord.time - props.initialTime) / (props.endingTime - props.initialTime);
                            let y = -coord[props.latTag] * zoom;

                            let r = (coord[props.tagForPointSize.name] - props.tagForPointSize.min) / (props.tagForPointSize.max - props.tagForPointSize.min);
                            let c = (coord[props.tagForPointColor.name] - props.tagForPointColor.min) / (props.tagForPointColor.max - props.tagForPointColor.min);



                            coord = [coord[props.latTag] * 1., coord[props.longTag] * 1.];

                            let refTile = coord2tile(props.center, Math.floor(props.zoom));
                           
                            // TODO: This could be more eficient. Instead of calculating the position in the sketch everytime a node
                            // is drawn, we could do it when the file is loaded.
                            let pos = coordToPosition(coord, Math.floor(props.zoom), refTile);
                            x = pos[0];
                            y = pos[1];
                            p5.push();

                            // Translate the system to have the top-left corner of the central tile as the (0, 0) coordinate.
                            if (previousCoord && props.display3DLine) {
                                p5.stroke(lineColor);
                                //linewidth3D before
                                //p5.strokeWeight(identifier ?  props.lineWidth : value * 15);
                                p5.strokeWeight(props.lineWidth);

                                p5.line(previousCoord.x, previousCoord.y, x, y);
                            }



                            p5.pop();
                            previousCoord = { x, y };




                        });


                    } else {



                        // default line with no fade

                        // This coordinates are the coordinates in the sketch, not the (lat, long) coordinates
                        // or the tile coordinates.
                        let previousCoord = null;
                        //p5.noFill()


                        let tooltipText;
                        coords.map(coord => {

                            let value = (coord[props.tagForLineColor.name] - props.tagForLineColor.min) / (props.tagForLineColor.max - props.tagForLineColor.min);
                            let identifier = props.tagForLineColor.name == props.idTagName;

                            let lineColor;
                            if (identifier) { lineColor = props.colors[i] }
                            else { lineColor = getColorFromPalette(value, lineGradient, p5); }

                            let x = coord[props.longTag] * zoom;
                            let ratio = (coord.time - props.initialTime) / (props.endingTime - props.initialTime);
                            let y = coord[props.latTag] * zoom;

                            //let z = -coord[props.latTag] * zoom;

                            let r = (coord[props.tagForPointSize.name] - (props.tagForPointSize.min)) / (props.tagForPointSize.max - (props.tagForPointSize.min));
                            let c = (coord[props.tagForPointColor.name] - props.tagForPointColor.min) / (props.tagForPointColor.max - props.tagForPointColor.min);

                            let line_scale_factor = (coord[props.tagForLineSize.name] - (props.tagForLineSize.min)) / (props.tagForLineSize.max - (props.tagForLineSize.min)) + 0.1;

                            let size_data_value = coord[props.tagForLineSize.name];


                            coord = [coord[props.latTag] * 1., coord[props.longTag] * 1.];

                            let refTile = coord2tile(props.center, Math.floor(props.zoom));
                          
                           

                            // TODO: This could be more eficient. Instead of calculating the position in the sketch everytime a node
                            // is drawn, we could do it when the file is loaded.
                            let pos = coordToPosition(coord, Math.floor(props.zoom), refTile);
                          
                            x = pos[0];
                            y = pos[1];
                           
                           
                            p5.push();

                            // Translate the system to have the top-left corner of the central tile as the (0, 0) coordinate.

                            if (previousCoord && props.displayLine) {

                                p5.beginShape();
                                p5.fill(lineColor);
                                p5.stroke(lineColor);
                                p5.noStroke();

                                p5.vertex(previousCoord.x, previousCoord.y);
                                p5.vertex(previousCoord.x, previousCoord.y);
                                p5.vertex(x, y);
                                p5.vertex(x, y - (line_scale_factor * 15));
                                p5.vertex(previousCoord.x, previousCoord.y - (previousCoord.line_scale_factor * 15));
                                p5.vertex(previousCoord.x, previousCoord.y - (previousCoord.line_scale_factor * 15));

                                p5.endShape();


                               
                                let mouseDist = p5.dist(x, y, ((p5.mouseX - offset.x)/currentScale + boxSize / 2), ((p5.mouseY - offset.y)/currentScale + boxSize / 2))
                                if (mouseDist >= 0 && mouseDist <= 6) {

                                    tooltipText = props.tagForLineSize.name + " : " + Number(size_data_value);
                                }


                            }


                            if (props.displayPoints) {
                                // p5.translate(boxSize / 2, boxSize / 2);
                                //p5.translate(x, y);
                                let identifier = props.tagForPointColor.name == props.idTagName;
                                p5.fill(identifier ? props.colors[i] : colorFunction(c, props.gradientPoints));
                                p5.noStroke();
                                p5.circle(x, y, r * 10);
                            }

                            p5.pop();
                            previousCoord = { x, y, line_scale_factor };


                        });


                        if (tooltipText) {
                            console.log("DISPLAYING TOOLTIP");
                            // measure the width of the tooltip
                            let w = p5.textWidth(tooltipText);

                            // save the current fill/stroke/textAlign state
                            p5.push();

                            // draw a lightgray rectangle with a dimgray border
                            p5.fill('lightgray');
                            p5.stroke('dimgray');
                            p5.strokeWeight(1);
                            // draw this rectangle slightly below and to the
                            // right of the mouse
                            p5.rect(p5.mouseX - offset.x + 10, p5.mouseY - offset.y + 180, w + 20, 24, 4);
                            p5.textAlign(p5.LEFT, p5.TOP);
                            p5.noStroke();
                            p5.fill('black');
                            p5.text(tooltipText, p5.mouseX - offset.x + 20, p5.mouseY - offset.y + 185);

                            // restore the previous fill/stroke/textAlign state
                            p5.pop();
                        }


                    }





                }
            })
        }
    };


    return (
        <div id={ props.mapCubeToggle ? styles.Map_split : styles.Map}>
           
          
            <Sketch setup={setup} draw={draw} preload={preload} />
        </div>
    );
};


export default NewMap;