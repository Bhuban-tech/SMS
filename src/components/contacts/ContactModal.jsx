import Modal from "@/components/ui/Modal";

export default function ContactModal({
  open,
  close,
  data,
  setData,
  onSave,
  isEdit,
}) {
  if (!open) return null;

  return (
    <Modal title={isEdit ? "Edit Contact" : "Add Contact"} close={close}>
      <input
        placeholder="Name"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        className="w-full border px-3 py-2 rounded mb-4"
      />
      <input
        placeholder="Mobile"
        value={data.mobile}
        onChange={(e) => setData({ ...data, mobile: e.target.value })}
        className="w-full border px-3 py-2 rounded mb-4"
      />
      <button
        onClick={onSave}
        className="w-full bg-teal-500 text-white py-2 rounded hover:bg-teal-700 hover:cursor-pointer"
      >
        Save
      </button>
    </Modal>
  );
}
