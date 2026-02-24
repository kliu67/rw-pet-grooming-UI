import { useState } from "react";
import { isValidPrice } from "@/utils";
import { useTranslation } from "react-i18next"


export default function CreateServiceModal({ closeModal }) {
    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    const [canSubmit, setCanSubmit] = useState(false);
    const [price, setPrice] = useState(0);

    const { t } = useTranslation();

    const inputs = {
        name: {
            id: 'services-name',
            name: 'name',
            placeholder: t('services.placeholderText.name')
        },
        base_price: {
            id: 'services-base_price',
            name: 'base_price',
            placeholder: t('services.placeholderText.base_price')
        },
        description: {
            id: 'services_description',
            name: 'description',
            placeholder: t('services.placeholderText.description')
        }
    }
    function handleChange(e) {
        const name = e.target.name;
        if (name === 'base price') {

        }
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    function handleSubmit(e) {
        e.preventDefault();

        console.log("Creating:", form);

        // call mutation here
        closeModal();
    }

    //length of name cannot exceed 60 characters
    //length of description cannot exceed 200 characters

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold mb-4">
                Create Service
            </h2>
            <label
                for={inputs.name.id}
            >{inputs.name.placeholder}
            </label>
            <input
                id={inputs.name.id}
                name={inputs.name.name}
                placeholder={inputs.name.placeholder}
                value={form.name}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mb-3"
                required
            />
            <label
                for={inputs.base_price.id}
            >{inputs.name.placeholder}
            </label>
            {/* <input
                id={inputs.base_price.id}
                name={inputs.base_price.name}
                placeholder={inputs.base_price.placeholder}
                value={form.base_price}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 mb-3"
                required
            /> */}

            <input
                id={inputs.base_price.id}
                name={inputs.base_price.name}
                placeholder={inputs.base_price.placeholder}
                type="number"
                step="0.01"
                min="0"
                max="99999999.99"
                value={price}
                className="w-full border rounded-lg px-3 py-2 mb-3"
                onChange={(e) => setPrice(e.target.value)}
            />
            <label
                for={inputs.description.id}
            >{inputs.description.placeholder}
            </label>
            <textarea
                id={inputs.description.id}
                name={inputs.description.name}
                label={inputs.description.name}
                placeholder={inputs.description.placeholder}
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
                    disabled={canSubmit}
                >
                    Save
                </button>
            </div>
        </form>
    );
}