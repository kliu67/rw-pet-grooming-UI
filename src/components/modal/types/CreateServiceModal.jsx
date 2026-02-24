import { useState } from "react";
import { useTranslation } from "react-i18next"
import { isValidPrice } from "@/utils";
import { MAX_SERVICE_NAME_LENGTH, MAX_SERVICE_DESC_LENGTH, MIN_SERVICE_BASE_PRICE_VALUE, MAX_SERVICE_BASE_PRICE_VALUE } from "@/constants";


export default function CreateServiceModal({ closeModal, onSubmit, isLoading, serverError }) {
    const [form, setForm] = useState({
        name: "",
        base_price: "",
        description: "",
    });

    const { t } = useTranslation();
    const [nameHasError, setNameHasError] = useState(false);
    const [basePriceHasError, setBasePriceHasError] = useState(false);
    const [descriptionHasError, setDescriptionHasError] = useState(false);

    const isError = nameHasError || basePriceHasError || descriptionHasError;


    const inputs = {
        name: {
            id: 'services-name',
            name: 'name',
            placeholder: t('services.placeholderText.name'),
            errorMsg: t('services.errors.name')
        },
        base_price: {
            id: 'services-base_price',
            name: 'base_price',
            placeholder: t('services.placeholderText.base_price'),
            errorMsg: t('services.errors.base_price')
        },
        description: {
            id: 'services_description',
            name: 'description',
            placeholder: t('services.placeholderText.description'),
            errorMsg: t('services.errors.description')
        }
    }
    function handleChange(e) {
        const name = e.target.name;
        const value = e.target.value;
        if (name === inputs.name.name) {
            setNameHasError(value.length < 1 || value.length > MAX_SERVICE_NAME_LENGTH);
        }
        if (name === inputs.base_price.name) {
            setBasePriceHasError(!isValidPrice(value) || Number(value) > MAX_SERVICE_BASE_PRICE_VALUE)
        }
        if (name === inputs.description.name) {
            setDescriptionHasError(value.length < 1 || value.length > MAX_SERVICE_DESC_LENGTH)
        }
        setForm({ ...form, [e.target.name]: e.target.value });

    }

    function handleSubmit(e) {
        e.preventDefault();
        if (isLoading || isError) return;
        console.log("Creating:", form);
        onSubmit({
            name: form.name.trim(),
            base_price: Number(form.base_price),
            description: form.description.trim(),
        });
    }

    //length of name cannot exceed 60 characters
    //length of description cannot exceed 200 characters

    return (
        <form onSubmit={handleSubmit}>
            <h2 className="text-lg font-semibold mb-4">
                Create Service
            </h2>
            <label
                htmlFor={inputs.name.id}
            >{inputs.name.placeholder}
            </label>
            {nameHasError &&
                (<label
                    className="error"
                    htmlFor={inputs.name.id}
                >
                    {inputs.name.errorMsg}
                </label>)}
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
                htmlFor={inputs.base_price.id}
            >
                {inputs.base_price.placeholder}
            </label>
            {basePriceHasError &&
                (<label
                    className="error"
                    htmlFor={inputs.base_price.id}
                >
                    {inputs.base_price.errorMsg}
                </label>)}
            <input
                id={inputs.base_price.id}
                name={inputs.base_price.name}
                placeholder={inputs.base_price.placeholder}
                type="number"
                step="0.01"
                min="0"
                max={MAX_SERVICE_BASE_PRICE_VALUE}
                value={form.base_price}
                className="w-full border rounded-lg px-3 py-2 mb-3"
                onChange={handleChange}
                required
            />
            <label
                htmlFor={inputs.description.id}
            >{inputs.description.placeholder}
            </label>
            {descriptionHasError &&
                (<label
                    className="error"
                    htmlFor={inputs.description.id}
                >{inputs.description.errorMsg}
                </label>)}
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
                {serverError && (
                    <p className="text-red-500 text-sm">{serverError}</p>
                )}
                <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border rounded-lg"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="
                    px-4 py-2 bg-blue-600 text-white rounded-lg
                    disabled:bg-gray-400
                    disabled:cursor-not-allowed
                    disabled:opacity-60"
                    disabled={isLoading || isError || !form.name || form.base_price === '' || !form.description}
                >
                    Save
                </button>
            </div>
        </form >
    );
}