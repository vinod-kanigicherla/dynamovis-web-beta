import styles from "./GradientPicker.module.css";
import { colorFunction, RGBArrayToHex } from "../../utils/color";
import { useState, useEffect } from "react";
import cross from "../../assets/cross.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp } from "@fortawesome/free-solid-svg-icons";
import Dropdown from 'react-bootstrap/Dropdown';


const arr = [0, 0, 0, 0, 0, 0, 0, 0, 0];
// const colors = [
//   [94, 231, 223],
//   [42, 245, 152],
//   [213, 88, 200],
//   [1, 112, 154],
//   [254, 225, 64],
//   [36, 210, 146],
//   [0, 158, 253],
//   [180, 144, 202]
// ];

// const colors2 = [
//   [32, 0, 44],
//   [52, 232, 158],
//   [67, 198, 172],
//   [248, 255, 174],
//   [15, 52, 67],
//   [203, 180, 212],
// ];


const fixedColorGradients = [
    ['#f7fbff', '#deebf7', '#c6dbef', '#9ecae1', '#6baed6', '#4292c6', '#2171b5', '#08519c', '#08306b'],
    ['#f7fcf5', '#e5f5e0', '#c7e9c0', '#a1d99b', '#74c476', '#41ab5d', '#238b45', '#006d2c', '#00441b'],
    ['#ffffff', '#f0f0f0', '#d9d9d9', '#bdbdbd', '#969696', '#737373', '#525252', '#252525', '#000000'],
    ['#fcfbfd', '#efedf5', '#dadaeb', '#bcbddc', '#9e9ac8', '#807dba', '#6a51a3', '#54278f', '#3f007d'],
    ['#fff5f0', '#fee0d2', '#fcbba1', '#fc9272', '#fb6a4a', '#ef3b2c', '#cb181d', '#a50f15', '#67000d'],
    ['#8c510a','#bf812d','#dfc27d','#f6e8c3','#f5f5f5','#c7eae5','#80cdc1','#35978f',"#01665e"],
    ['#c51b7d','#de77ae','#f1b6da','#fde0ef','#f7f7f7','#e6f5d0','#b8e186','#7fbc41',"#4d9221"],
    ['#762a83','#9970ab','#c2a5cf','#e7d4e8','#f7f7f7','#d9f0d3','#a6dba0','#5aae61',"#1b7837"],
    ['#b35806','#e08214','#fdb863','#fee0b6','#f7f7f7','#d8daeb','#b2abd2','#8073ac',"#542788"],
    ['#b2182b','#d6604d','#f4a582','#fddbc7','#f7f7f7','#d1e5f0','#92c5de','#4393c3',"#2166ac"],
    ['#b2182b','#d6604d','#f4a582','#fddbc7','#ffffff','#e0e0e0','#bababa','#878787',"#4d4d4d"],
    ['#d73027','#f46d43','#fdae61','#fee090','#ffffbf','#e0f3f8','#abd9e9','#74add1',"#4575b4"],
    ['#d73027','#f46d43','#fdae61','#fee08b','#ffffbf','#d9ef8b','#a6d96a','#66bd63',"#1a9850"],
];

// Convert hex codes to RGB values
const convertedColors = fixedColorGradients.map(colorSet => (
    colorSet.map(hex => {
        // Remove '#' from the hex code and convert to RGB
        const bigint = parseInt(hex.slice(1), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return [r, g, b];
    })
));


const colorSchemeKey = [
    {idx: 0, color: "Blue"},
    {idx: 1, color: "Green"},
    {idx: 2, color: "Black"},
    {idx: 3, color: "Purple"},
    {idx: 4, color: "Red"},
    {idx: 5, color: "Green-Brown"},
    {idx: 6, color: "Green-Pink"},
    {idx: 7, color: "Green-Purple"},
    {idx: 8, color: "Purple-Orange"},
    {idx: 9, color: "Blue-Red"},
    {idx: 10, color: "Black-Red"},
    {idx: 11, color: "Light Blue-Red"},
    {idx: 12, color: "Green-Red"},
    {idx: 13, color: "Divergent 8"},
    {idx: 14, color: "Divergent 9"},
]

const Button = (props) => {
  const [showingDropdown, setShowingDropdown] = useState(false);


  return (
    <div
      className={styles.button}
    >
      {showingDropdown && (
        <div className={styles.buttonDropdown}>
          {props.blank && (
            <div
              className={styles.colorPicker}
              style={{ background: "white" }}
              onClick={() => props.setter(null)}
            >
              <img src={cross} className={styles.cross} />
            </div>
          )}
          {convertedColors[0].map((color, i) => {
            return (
              <div
                key={i}
                className={styles.colorPicker}
                onClick={() => props.setter(color)}
                style={{ background: RGBArrayToHex(color) }}
              />
            );
          })}
        </div>
      )}
      {showingDropdown && (
        <div
          className={styles.dropdownBackground}
          onClick={() => setShowingDropdown(false)}
        />
      )}
    </div>
  );
};

const GradientPicker = (props) => {
    //Dropdown Code:

    const colors = ['Blue', 'Green', 'Black', 'Purple', 'Red', 'Green-Brown', 'Green-Pink', 'Green-Purple', 'Purple-Orange', 'Blue-Red', 'Black-Red', 'Light Blue-Red', 'Green-Red'];

    const [selectedColor, setSelectedColor] = useState(colors[props.colorScheme]);
    const [isOpen, setIsOpen] = useState(false);


    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectColor = (color) => {
        const selectedColorItem = colorSchemeKey.find((item) => item.color === color);

        if (selectedColorItem) {
          const selectedIdx = selectedColorItem.idx;
          setSelectedColor(color);
          setIsOpen(false);
          props.setColorScheme(selectedIdx)
          console.log(selectedColorItem.idx)
        }
    };
  const setColorA = (color) => {
    let newGradient = {
      b: props.gradient.b,
      c: props.gradient.c,
    };
    newGradient.a = color;
    props.setGradient(newGradient);
  };

  const setColorB = (color) => {
    let newGradient = {
      a: props.gradient.a,
      c: props.gradient.c,
    };
    newGradient.b = color;
    props.setGradient(newGradient);
  };

  const setColorC = (color) => {
    let newGradient = {
      a: props.gradient.a,
      b: props.gradient.b,
    };
    newGradient.c = color;
    props.setGradient(newGradient);
  };

  const Triangle = () => {
    return (
      <div className={styles.triangle}>
        <FontAwesomeIcon icon={faCaretUp} />
      </div>
    );
  };

  return (
    <div className={styles.palettePicker}>
      {/* <button
        type="button"
        className="px-2 py-1 text-gray-700 border rounded-lg focus:outline-none mb-5 text-xs"
        onClick={toggleDropdown}
      >
        {selectedColor}
      </button>
      {isOpen && (
        
        <div className="bg-white border rounded-lg shadow-lg mb-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => selectColor(color)}
              className="text-xs block w-full px-2 py-1 text-gray-700 hover:bg-blue-500 hover:text-white focus:outline-none mb-1"
            >
              {color}
            </button>
          ))}
        </div>
      )} */}
      <div className={styles.palette}>

          {convertedColors[props.colorScheme].map((item, j) => {
                return <div key={j} className={styles.colorSample} style={{ background: colorFunction(j / arr.length, props.gradient) }} />
            })} 
          
          

          <div className={styles.minTag}>{props.tag.min}</div>
          <div className={styles.maxTag}>{props.tag.max}</div> 
      </div>
      <Dropdown className={styles.dropdownStyle} >
            <Dropdown.Toggle className={styles.btnSuccess}>
              {selectedColor}
            </Dropdown.Toggle>

            <Dropdown.Menu className={styles.dropdownMenuStyle}>
            {colors.map((color, i) => {
                return (
                  
                    <Dropdown.Item key={i} onClick={() => selectColor(color)} className={styles.dropdownItem}>{color}</Dropdown.Item>
                )
            })}
              
            </Dropdown.Menu>
        </Dropdown>
    </div>
  );
};

export default GradientPicker;
