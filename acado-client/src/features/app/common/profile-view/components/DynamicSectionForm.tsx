import React, { useState } from 'react';
import type { Section } from '../services/sectionService';

interface Props {
    section: Section;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onSubmit: (data: { Key: string; value: any }[]) => void;
    onclose: () => void;
}

const DynamicSectionForm: React.FC<Props> = ({ section, onSubmit, onclose }) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [formData, setFormData] = useState<Record<string, any>>({});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (key: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleFileChange = (key: string, file: File | null) => {
        setFormData((prev) => ({
            ...prev,
            [key]: file,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const profileSection: { Key: string; value: any }[] = [];

        for (const field of section.fields) {
            const value = formData[field.fieldKey];

            if (field.isRequired && (value === undefined || value === '' || value === null)) {
                alert(`Field "${field.name}" is required.`);
                return;
            }

            const isFile = value instanceof File;

            profileSection.push({
                Key: field.fieldKey,
                value: isFile ? null : value ?? field.default_value ?? '',
            });
        }

        onSubmit(profileSection);
    };

    return (
        <div className="h-full w-full space-y-6">

            <div className='flex items-center border-b border-gray-200 shadow p-4 px-6 justify-between'>

                <div>
                    <h2 className="text-xl font-semibold text-gray-800">{section.name}</h2>
                    <p className="text-sm mt-1 text-gray-500">{section.description}</p>
                </div>

                <button
                    className="text-gray-400 hover:bg-gray-100 p-1 px-3 transition duration-150 rounded-full text-lg hover:text-gray-600"
                    onClick={onclose}
                >
                    ✕
                </button>
            </div>



            <form className="space-y-4 px-6 pb-6 overflow-y-auto max-h-[70vh]" onSubmit={handleSubmit}>
                {section.fields.map((field) => (
                    <div key={field.fieldKey} className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700 mb-1">
                            {field.name} {field.isRequired && <span className="text-red-500">*</span>}
                        </label>


                        {/* ENUM Dropdown if dataType is string AND validationType is enum AND validationValue is an array */}
                        {field.dataType === 'string' &&
                            field.validationType === 'enum' &&
                            Array.isArray(field.validationValue) ? (
                            <select
                                value={formData[field.fieldKey] || ''}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                                onChange={(e) => handleChange(field.fieldKey, e.target.value)}
                            >
                                <option value="">Select an option</option>
                                {field.validationValue.map((option: string, index: number) => (
                                    <option key={index} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        ) : field.dataType === 'string' ? (
                            <input
                                type="text"
                                value={formData[field.fieldKey] || ''}
                                placeholder={field.placeholder}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                                onChange={(e) => handleChange(field.fieldKey, e.target.value)}
                            />
                        ) : field.dataType === 'date' ? (
                            <input
                                type="date"
                                value={formData[field.fieldKey] || ''}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                                onChange={(e) => handleChange(field.fieldKey, e.target.value)}
                            />
                        ) : field.dataType === 'binary' ? (
                            <input
                                type="file"
                                accept="image/*"
                                className="file:border file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-gray-300 file:text-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                                onChange={(e) => handleFileChange(field.fieldKey, e.target.files?.[0] || null)}
                            />
                        ) : field.dataType === 'boolean' ? (
                            // Render a checkbox for boolean fields
                            <input
                                type="checkbox"
                                checked={formData[field.fieldKey] || false}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                                onChange={(e) => handleChange(field.fieldKey, e.target.checked)}
                            />
                        ) : field.dataType === 'number' ? (
                            <input
                                type="number"
                                value={formData[field.fieldKey] || ''}
                                placeholder={field.placeholder}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                                onChange={(e) => handleChange(field.fieldKey, e.target.value)}
                            />
                        ) : field.dataType === 'email' ? (
                            <input
                                type="email"
                                value={formData[field.fieldKey] || ''}
                                placeholder={field.placeholder}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                                onChange={(e) => handleChange(field.fieldKey, e.target.value)}
                            />
                        ) : field.dataType === 'phone' ? (
                            <input
                                type="tel"
                                value={formData[field.fieldKey] || ''}
                                placeholder={field.placeholder}
                                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                                onChange={(e) => handleChange(field.fieldKey, e.target.value)}
                            />
                        ) : field.dataType === 'longtext' ? (
                            <textarea
                                value={formData[field.fieldKey] || ''}
                                placeholder={field.placeholder}
                                className="px-3 py-2 border border-gray-300 h-28 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                                onChange={(e) => handleChange(field.fieldKey, e.target.value)}
                            />
                        ) : null
                    }
                    </div>
                ))}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 mt-4 py-2 bg-primary transition duration-150 text-white rounded-full hover:bg-primary"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DynamicSectionForm;
