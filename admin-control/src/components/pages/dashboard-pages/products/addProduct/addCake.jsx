import CreatableSelect from "react-select/creatable"
import Select from "react-select"
import { GetImages } from "./getImages";
import { upload } from "../../../../../features/utilities/upload/upload";
export const AddCake = ({ cake, setCake, categories }) => {
    return (
        <div>
            <form>
                <label htmlFor="name">Name</label>
                <input required type="text" id="name" name="name" value={cake["name"] || ""} onChange={(e) => setCake(prev => ({ ...prev, ["name"]: e.target.value }))} />
                <label htmlFor="price">Price</label>
                <input required type="text" id="price" name="price" value={cake["price"] || ""} onChange={(e) => setCake(prev => ({ ...prev, ["price"]: e.target.value }))} />
                <br />
                <label htmlFor="description">Description</label>
                <br />
                <textarea required id="description" name="description" value={cake["description"] || ""} onChange={(e) => setCake(prev => ({ ...prev, ["description"]: e.target.value }))} />
                <br />
                <label htmlFor="cakeCat">Category</label>
                <CreatableSelect
                    id="cakeCat"
                    isClearable
                    options={categories}
                    onChange={(e) => setCake(prev => ({ ...prev, category: e ? e.value : "" }))}
                    required
                />
                <label htmlFor="allergens">Allergens</label>
                <Select isMulti options={allergens}
                    required
                    id ="allergens"
                    onChange={(e) => setCake(prev => ({ ...prev, allergens: e || [] }))}
                />
            </form>
        </div>
    )
}