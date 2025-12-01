import React, { useState, useEffect } from "react";
import type { Section } from "../services/sectionService";

interface Props {
  section: Section;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entry: Record<string, any>; // Prefilled data (including id)
  onclose: () => void;
  deleteProfileEntry: (sectionKey: string, id: string) => void
  onSubmit: (data: {
    id: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profileSection: { Key: string; value: any }[];
    files: Record<string, File | null>;
  }) => void;
}

const DynamicEditSectionForm: React.FC<Props> = ({ section, entry, onSubmit, onclose, deleteProfileEntry }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [files, setFiles] = useState<Record<string, File | null>>({});

  useEffect(() => {
    setFormData(entry || {});
    setFiles({});
  }, [entry]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (key: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }));
    setFormData((prev) => ({ ...prev, [key]: file ? file.name : "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const profileSection: { Key: string; value: any }[] = [];

    for (const field of section.fields) {
      const value = formData[field.fieldKey];

      if (field.isRequired && (value === undefined || value === "" || value === null)) {
        alert(`Field "${field.name}" is required.`);
        return;
      }

      const isFile = value instanceof File || files[field.fieldKey] instanceof File;

      profileSection.push({
        Key: field.fieldKey,
        value: isFile ? null : value ?? field.default_value ?? "",
      });
    }

    onSubmit({ id: entry.id, profileSection, files });
  };

  return (
    <div className="h-full max-h-[90vh] w-full overflow-y-auto space-y-6">
      <div className="flex items-center border-b border-gray-200 shadow p-4 px-6 justify-between">
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

      <form className="space-y-4 px-6 pb-6" onSubmit={handleSubmit}>
        {section.fields.map((field) => {
          const key = field.fieldKey;
          const value = formData[key];

          return (
            <div key={key} className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">
                {field.name} {field.isRequired && <span className="text-red-500">*</span>}
              </label>

              {/* ENUM dropdown */}
              {field.dataType === "string" &&
                field.validationType === "enum" &&
                Array.isArray(field.validationValue) ? (
                <select
                  value={value || ""}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                  onChange={(e) => handleChange(key, e.target.value)}
                >
                  <option value="">Select an option</option>
                  {field.validationValue.map((option: string, index: number) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : field.dataType === "string" ? (
                <input
                  type="text"
                  value={value || ""}
                  placeholder={field.placeholder}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              ) : field.dataType === "date" ? (
                <input
                  type="date"
                  value={value ? value.substring(0, 10) : ""}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              ) : field.dataType === "binary" ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    className="file:border file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-gray-300 file:text-sm file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                    onChange={(e) => handleFileChange(key, e.target.files?.[0] || null)}
                  />
                  {typeof value === "string" && value && (
                    <img
                      src={value}
                      alt={field.name || key}
                      style={{ maxWidth: "100px", borderRadius: 8, marginTop: 8 }}
                    />
                  )}
                </>
              ) : field.dataType === "boolean" ? (
                <input
                  type="checkbox"
                  checked={value || false}
                  onChange={(e) => handleChange(key, e.target.checked)}
                />
              ) : field.dataType === "number" ? (
                <input
                  type="number"
                  value={value || ""}
                  placeholder={field.placeholder}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              ) : field.dataType === "email" ? (
                <input
                  type="email"
                  value={value || ""}
                  placeholder={field.placeholder}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              ) : field.dataType === "phone" ? (
                <input
                  type="tel"
                  value={value || ""}
                  placeholder={field.placeholder}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              ) : field.dataType === 'longtext' ? (
                            <textarea
                                value={formData[field.fieldKey] || ''}
                                placeholder={field.placeholder}
                                className="px-3 py-2 border border-gray-300 h-28 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/90"
                                onChange={(e) => handleChange(field.fieldKey, e.target.value)}
                            />
                        ) : null}
            </div>
          );
        })}

        <div className="flex justify-end gap-4">
          
          <button
            type="button"
            className="px-6 mt-4 py-2 bg-red-600 text-white transition duration-150 rounded-full hover:bg-red-700"
            onClick={() => {

              deleteProfileEntry(section.SectionKey, entry.id)
              onclose()
            }

            }
          >
            Delete
          </button>
          <button
            type="submit"
            className="px-6 mt-4 py-2 bg-primary transition duration-150 text-white rounded-full hover:bg-primary"
          >
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default DynamicEditSectionForm;
