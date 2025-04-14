import styles from '../LateralPanel.module.css';
import Section from "./Section";
import IdBox from "../../IdBox/IdBox";
import { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ListGroup from 'react-bootstrap/ListGroup';

const IDSection = (props) => {
    const toggleDisplayingId = (id) => {
        let newArray = [...props.displayingIds];
        newArray[id] = !newArray[id];
        props.setDisplayingIds(newArray);
        console.log("ID: " + id);
        props.setAlignAroundId(id);
        

    }

    const [idToggle, setIdToggle] = useState(true);

    useEffect(() => {
        props.setShowIds(idToggle)
    }, [idToggle])

    const handleIdCheckboxChange = () => {
        setIdToggle(!idToggle)
  }

    return <Section title="IDs" if={props.if}>
       
        <h1 className='text-2xl'> Properties </h1>
       
        <div className='flex flex-row items-center'>
            <>
                <p className='text-black font-semibold mr-1 mt-2 mb-1 text-xs'> Color by Properties </p>
                <label className='flex cursor-pointer select-none items-center'>
                    <div className='relative'>
                    <input
                        type='checkbox'
                        checked={setIdToggle}
                        onChange={handleIdCheckboxChange}
                        className='sr-only'
                    />
                    
                    <div
                        className={`box block h-5 w-8 rounded-full ${
                        idToggle ? 'bg-blue-200' : 'bg-gray-400'
                        }`}
                    >
                    </div>
                    <div
                        className={`absolute left-1 top-1 flex h-3 w-3 mr-4 items-center justify-center rounded-full bg-white transition ${
                        idToggle ? 'translate-x-full' : ''
                        }`}
                    ></div>
                    </div>
                </label>
                <p className='text-black font-semibold ml-2 mt-1 mb-0.5 text-xs'>
                    Color by ID
                </p>
            </>
        </div>
        

        <div className={styles.displayingIdsContainer}>
            <Dropdown className={styles.dropdownStyle} >
                <Dropdown.Toggle className={styles.dropDown}>
                    Select Visible Animal Ids
                </Dropdown.Toggle>
            <Dropdown.Menu>
            <ListGroup className = {styles.listGroup}>
          
            {props.ids.map((id, i) => {
                return (
                    <ListGroup.Item>
                    <IdBox
                        key={i}
                        color={props.colors[i]}
                        id={id}
                        i={i}
                        tagsMatrix={props.tagsMatrix}
                        onClick={() => toggleDisplayingId(i)} displayingIds={props.displayingIds}
                        tagForLineColor={props.tagForLineColor}
                        tagForPointsColor={props.tagForPointsColor}
                        idTimeRanges = {props.idTimeRanges}
                    />
                    </ListGroup.Item>
                )
            })}
              </ListGroup>
              </Dropdown.Menu>

            </Dropdown>
           
            <div className={styles.flexFiller} />
        </div>
        
    </Section>
}

export default IDSection;