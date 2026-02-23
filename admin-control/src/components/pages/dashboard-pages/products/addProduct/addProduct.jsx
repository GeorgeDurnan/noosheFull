import { useEffect, useState } from "react"
import { Preview } from "./preview"
import { getCategories } from "../../../../../features/utilities/getCategories"
import { AddCake } from "./addCake"
import { ProductOptions } from "./productOptions"
import { CreateOptionCat } from "./createOptionCat"
import { upload } from "../../../../../features/utilities/upload/upload"
import { GetImages } from "./getImages"
export const AddProduct = ({ setCount, setMsg }) => {
    const [cake, setCake] = useState({})
    const [show, setShow] = useState(false)
    const [check, setCheck] = useState(false)
    const [categories, setCategories] = useState([])
    const [options, setOptions] = useState({})
    const [optionCats, setOptionCats] = useState([])
    const[reload, setReload] = useState(false)

    useEffect(() => {
        async function get() {
            const cats = await getCategories()
            setCategories(cats.map((element) => {
                return {
                    value: element, label: element.description + " Rank:" + element.rank, color: "red"
                }
            }))
        }
        get()
        //reload will be replaced by websocket
    }, [reload])
    function handleClick() {
        setShow(prev => !prev)
    }
    function handleCakeSend() {
        //setCheck(prev => !prev)
        upload(cake, options, optionCats)
    }
    return (
        <div>
            <button onClick={handleClick}>Add product</button>
            {show && (<div>
                <AddCake cake={cake} setCake={setCake} categories={categories} setReload={setReload}/>
                <GetImages cake={cake} setCake={setCake} />
                <CreateOptionCat setOptionCats={setOptionCats} optionCats={optionCats} setOptions={setOptions} options={options} />
                <ProductOptions optionCats={optionCats} setOptions={setOptions} options={options} />

                <Preview cake={cake} options={options} optionCats={optionCats} />
                <button onClick={handleCakeSend}>Submit new cake</button>
            </div>)}
            {check && <button>Are you sure</button>}
        </div>
    )
}