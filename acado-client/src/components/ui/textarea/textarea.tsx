import React from 'react';

interface TextareaProps {
    name: string;
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
}

const Textarea: React.FC<TextareaProps> = ({ name, value, onChange, placeholder, rows = 4 }) => {
    return (
        <textarea
            className="border p-2 rounded-md w-full mt-2 focus:ring-2 focus:ring-primary"
            name={name}
            rows={rows}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    );
};

export default Textarea;
