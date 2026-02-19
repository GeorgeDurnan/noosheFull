import { useState, useRef } from "react"
export const GetImages = ({ cake, setCake }) => {
    const [image, setImage] = useState({})
    const [msg, setMsg] = useState("")
    const ref = useRef(null)
    function handleSubmit(event) {

        event.preventDefault()
        const rank = Number(image["rank"])
        const images = cake["img"] || []
        if (images[rank]) {
            setMsg("You cannot have two images with same rank")
            return
        }
        const newCake = [...images]
        newCake[rank] = { "file": image["file"], "rank": image["rank"] }
        setCake((prev) => ({ ...prev, ["img"]: newCake }))
        setImage({})
        ref.current.value = ""
    }
    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="">Upload image</label>
            <input ref={ref} required id="file" name="file" type="file" onChange={(e) => { setImage((prev) => ({ ...prev, "file": e.target.files[0] })) }} />
            <label htmlFor="">Rank</label>
            <input required id="rank" name="rank" value={image["rank"] || ""} type="number" onChange={(e) => { setImage((prev) => ({ ...prev, "rank": e.target.value })) }} />
            <input type="submit" value="Create Image" />
            <h1>{msg}</h1>
        </form>
    )
}