import { useState } from "react";

export default function DeletServiceModal({ closeModal }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log("Creating:", form);

    // call mutation here
    closeModal();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-4">
        Create Service
      </h2>

      <input
        name="name"
        placeholder="Service Name"
        value={form.name}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2 mb-3"
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        value={form.description}
        onChange={handleChange}
        className="w-full border rounded-lg px-3 py-2 mb-4"
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={closeModal}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Save
        </button>
      </div>
    </form>
  );
}