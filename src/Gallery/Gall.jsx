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
        const sortableJsInstance = new Sortable(gridRef.current, {
            animation: 500, // Duration of the animation in milliseconds (e.g., 150ms)
            delay: 2,// item if user drag the item
            multiDrag: true,
            delayOnTouchOnly: true,
            sort: true,
            touchStartThreshold: 10,
            swapThreshold: 1,
            ghostClass: "sortable-ghost",  // Class name for the drop placeholder
            chosenClass: "sortable-chosen",  // Class name for the chosen item
            dragClass: "sortable-drag",  // Class name for the dragging item
        });
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
            <div id='grid' className='grid' ref={gridRef}>
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
                    className={"img_box"}
                    draggable={'true'}
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