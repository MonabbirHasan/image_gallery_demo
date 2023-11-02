import React, { useState, useEffect, useRef } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import uploadImg from "../assets/upload.png";
import img11 from "../assets/image-11.png";
import img1 from "../assets/image-1.png";
import img2 from "../assets/image-2.png";
import img3 from "../assets/image-3.png";
import img4 from "../assets/image-4.png";
import img5 from "../assets/image-5.png";
import img6 from "../assets/image-6.png";
import img7 from "../assets/image-7.png";
import img8 from "../assets/image-8.png";
import img9 from "../assets/image-9.png";
import img10 from "../assets/watch.jpg";
import Sortable from 'sortablejs';
import './responsive.css';
import './style.css';
/****************************************
* GALLERY STATIC DATA DEFINED HERE
*****************************************/
const DataItems = [
    {
        "id": 1,
        "img": img1,
    },
    {
        "id": 2,
        "img": img2,
    },
    {
        "id": 3,
        "img": img3,
    },
    {
        "id": 4,
        "img": img4,
    },
    {
        "id": 5,
        "img": img5,
    },
    {
        "id": 6,
        "img": img6,
    },
    {
        "id": 7,
        "img": img7,
    },
    {
        "id": 8,
        "img": img8,
    },
    {
        "id": 9,
        "img": img9,
    },
    {
        "id": 10,
        "img": img10,
    },
    {
        "id": 11,
        "img": img11,
    },
]
const Gall = () => {
    /*****************************
    * ALL STATES DEFINED HERE
    ******************************/
    const gridRef = useRef(null);
    const sortableJsRef = useRef(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const [data, setData] = useState(DataItems);
    const [gridHeight, setGridHeight] = useState();
    const [gridWidth, setGridWidth] = useState();
    /**************************************************
    * SHOW ALERT TOAST MESSAGE
    ***************************************************/
    const messages = (text) => toast(text);
    /**************************************************
    * USE SHORTABLEJS IN REACT USEEFFECT()
    ***************************************************/
    useEffect(() => {
        const sortableJsInstance = new Sortable((document.getElementById('sortable-list'), gridRef.current), {
            animation: 500, // Duration of the animation in milliseconds (e.g., 150ms)
            delay: 2,// item if user drag the item
            delayOnTouchOnly: true, // only delay if user is using touch
            sort: true,  // sorting inside list
            emptyInsertThreshold: 5, // px, distance mouse must be from empty sortable to insert drag element into it
            touchStartThreshold: 0, // px, how many pixels the point should move before cancelling a delayed drag event
            swapThreshold: 1, // Threshold of the swap zone
            invertedSwapThreshold: 1, // Threshold of the inverted swap zone (will be set to swapThreshold value by default)
            invertSwap: false, // Will always use inverted swap zone if set to true
            ghostClass: "sortable-ghost",  // Class name for the drop placeholder
            chosenClass: "sortable-chosen",  // Class name for the chosen item
            dragClass: "sortable-drag",  // Class name for the dragging item
            filter: '.disable-drag',
            onEnd: (evt) => {
                // Handle the "end" event when an item is dropped
                const newData = Array.from(data);
                const [movedItem] = newData.splice(evt.oldIndex, 1);
                newData.splice(evt.newIndex, 0, movedItem);

                // Save the updated order to sessionStorage
                sessionStorage.setItem('sortable-data', JSON.stringify(newData));

                // Update the state with the new order
                setData(newData);
            }
        });
        // Load data from sessionStorage when the component mounts
        const storedData = sessionStorage.getItem('sortable-data');
        if (storedData) {
            setData(JSON.parse(storedData));
        }
        return () => {
            sortableJsInstance.destroy();
        };
    }, []);
    /************************************
    * SELECT EACH ITEM USING CHECKBOX
    *************************************/
    const selectItem = (id) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter((item) => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    }
    /*******************************
     * DELETE SELECTED ITEMS
     *******************************/
    const handleDeleteSelectedItems = () => {
        const newData = data.filter((item) => !selectedItems.includes(item.id));
        messages("image delete successfully!");
        setData(newData);
        setSelectedItems([]); // Clear the selected items after deletion
    };
    /************************************************
    * INSERT GALLERY DATA TO THE ARRAY OBJECT
    *************************************************/
    const fileInputRef = useRef(null);
    const handleButtonClick = () => {
        fileInputRef.current.click();
    };
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Handle the selected file here
            const reader = new FileReader();
            reader.onload = (e) => {
                const maxId = Math.max(...data.map((item) => item.id));
                const newId = maxId + 1;
                const newItem = { id: newId, img: e.target.result };
                setData([...data, newItem]);
            };
            reader.readAsDataURL(file);
        }
        return "no file are selected";
    };
    /************************************************************
    * GET TOTAL HEIGHT AND WIDTH OF THE GRID PARENT BOX
    *************************************************************/
    useEffect(() => {
        if (gridRef.current) {
            const divHeight = gridRef.current.offsetHeight;
            const divWidth = gridRef.current.clientWidth;
            setGridHeight(divHeight)
            setGridWidth(divWidth)
        }
    }, []);
    /*<><><><><><><><><><><><><><><><><><><><><>
    * JSX RANDER START HERE
    <><><><><><><><><><><><><><><><><><><><><><>*/
    return (
        <div className="image_gallery" style={{ height: gridHeight + "%" }}>
            {/********************************************
            * IMAGE GALLERY OPTION SECTION START HERE
            *********************************************/}
            {
                selectedItems.length > 0 ?
                    <div className='options'>
                        <span>({selectedItems.length}) File Selected</span>
                        <span>Image Gallary</span>
                        <button onClick={handleDeleteSelectedItems}>Delete File</button>
                    </div>
                    : ""
            }
            {/*********************************
            * IMAGE GALLERY SECTION START HERE
            **********************************/}
            <div id='sortable-list' className='grid' ref={gridRef}>
                {data.map((item) => (
                    <>
                        <div
                            key={item.id}
                            data-id={item.id}
                            className={"img_box"}
                            draggable={'true'}>
                            <input
                                type="checkbox"
                                onChange={() => selectItem(item.id)} />
                            <LazyLoadImage src={item.img} />
                        </div>
                    </>
                ))}
                {/*********************************
                 * IMAGE UPLAOD SECTION START HERE
                 **********************************/}
                <div onClick={handleButtonClick}
                    className={"img_box img_upload_box disable-drag"}
                    draggable={'false'}
                    style={{ cursor: 'pointer' }}>
                    <LazyLoadImage
                        style={{ width: "100%", height: 'auto' }}
                        src={uploadImg} />
                    <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                </div>
                {/*********************************
                * IMAGE UPLAOD SECTION END HERE
                **********************************/}
            </div>
            {/**************************************************************
             * SHOW ALERT MESSAGE AFTER THE ITEM IS DELETED SUCCESS
             ***************************************************************/}
            <ToastContainer />
        </div>
    );
};

export default Gall;