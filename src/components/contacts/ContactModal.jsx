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
        className="w-full border px-3 py-2 rounded"
      />
      <input
        placeholder="Mobile"
        value={data.mobile}
        onChange={(e) => setData({ ...data, mobile: e.target.value })}
        className="w-full border px-3 py-2 rounded"
      />
      <button
        onClick={onSave}
        className="w-full bg-teal-500 text-white py-2 rounded"
      >
        Save
      </button>
    </Modal>
  );
}
