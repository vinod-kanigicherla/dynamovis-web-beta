import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function IdSelect(props) {
    //Selecting Id
    const [selectedIds, setSelectedIds] = useState(
        new Array(props.ids.length).fill(true)
    )

    useEffect(() => {
        // This code will run whenever props.ids changes
        setSelectedIds(new Array(props.ids.length).fill(true));
      }, [props.ids]);

    const handleOnChange = (idx) => {
        const updatedSelectedIds  = selectedIds.map((state, map_idx) => 
            idx == map_idx ? !state : state
        );
        setSelectedIds(updatedSelectedIds)
        
    }


    const filterIds = () => {
        // if ids < 20 make this disappear by  class properties or app

        const updatedSelectedIds = props.ids.filter((name, name_idx) => 
             selectedIds[name_idx]
        );
        if (updatedSelectedIds.length > 20) {
            alert("You still have more than 20 IDs selected. Try again!")
        }
        props.setIds(updatedSelectedIds)
        setSelectedIds(new Array(updatedSelectedIds.length).fill(true))
        
    }


    // Called EVERYTIME React State Above Updates
    // useEffect(() => {
    //     const updatedSelectedIds = localIds.filter((name, name_idx) => 
    //         selectedIds[name_idx]
    //     );
    //     setLocalIds(updatedSelectedIds);
    //     console.log(localIds)
    // }, [selectedIds]);


    const generateIds = (ids, selectedIds) => {
        let content = []
        for (let i in ids) {
            content.push(
                <div class="flex items-center pl-4 border border-gray-200 rounded dark:border-gray-400 w-auto mt-2">
                        <input 
                                id="bordered-checkbox" 
                                type="checkbox"
                                value={ids[i]}
                                name={ids[i]}
                                class="text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                onChange={() => handleOnChange(i)}
                                checked={selectedIds[i]}
                            />
                        <label for="bordered-checkbox-1" class="ml-2 text-sm font-medium text-black">{ids[i]}</label>
                </div>
            )
        }
        return content
    }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${props.ids.length <= 20 ? "hidden": ""}`}> 
        <div class="bg-white rounded-lg shadow-lg max-w-md w-full overflow-scroll h-3/5">
            <div class="items-center p-4 border-b dark:border-gray-600">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-black">Select IDs</h3>
                <p class="text-sm text-black font-semibold">The chosen dataset has more than 20 IDs. Please select at most 20 IDs you would like to visualize: </p>
                {
                    generateIds(props.ids, selectedIds)
                }
                 <button
                        className="my-5 rounded-md bg-gray-500 px-4 py-2 text-sm hover:bg-gray-600 font-semibold shadow-sm text-white"
                        onClick={filterIds}
                 >
                    Done
                </button>
                <label className='text-white text-sm font-semibold mr-50'>Done</label>
            </div>
        </div>
    </div>
  );
}

export default IdSelect;