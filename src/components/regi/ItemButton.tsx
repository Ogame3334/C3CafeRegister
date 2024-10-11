import { ItemInfo } from "@/class/ItemInfo"

const ItemButton = ({ itemInfo, onClickHandler }: { itemInfo: ItemInfo, onClickHandler: () => void }) => {
    return (
        <div className="p-3 w-full">
            <button
                className={`p-5 rounded-xl outline outline-2 w-full outline-black bg-white`}
                // className={`p-5 rounded-xl outline outline-2 w-full outline-black ${itemInfo.bg_color}`}
                onClick={onClickHandler}
            >
                <p className="text-xl">{itemInfo.name} {itemInfo.kind}</p>
                <p className="text-xl text-right">{itemInfo.price}円</p>
            </button>
        </div>
    )
}

export { ItemButton }
