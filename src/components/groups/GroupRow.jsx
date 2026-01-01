import { Edit, Plus, Trash } from "lucide-react";

function GroupRow ({group, index, onEdit, onDelete, onAddContact,  onViewContacts = () => {}}){
    return(
        <tr className="border border-gray-200 hover:bg-gray-100">
            <td className="p-3">{index+1}</td>
            <td className="p-3 cursor-pointer text-blue-600 hover:underline"
                onClick={()=>onViewContacts(group)}>{group.name}</td>
            <td className="p-3">{group.contactCount ?? 0}</td>
            <td className="p-3 flex justify-center gap-3">
                <button className="bg-teal-400 text-white p-2 rounded-full shadow hover:bg-teal-500 hover:cursor-pointer"
                        onClick={() => onEdit(group)}>
                            <Edit className="w-4 h-4"/>
                        </button>
                <button className="bg-red-400 text-white p-2 rounded-full shadow hover:bg-red-500 hover:cursor-pointer"
                        onClick={()=> onDelete(group)}>
                            <Trash className="w-4 h-4"/>
                        </button>
                <button className="bg-teal-500 text-white p-2 rounded-full shadow hover:bg-teal-600 hover:cursor-pointer"
                        onClick={()=>onAddContact(group)}>
                            <Plus className="w-4 h-4"/>
                        </button>
            </td>
        </tr>
    )
}
export default GroupRow;