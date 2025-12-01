import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-5 w-96">
                <div className="flex justify-between items-center border-b pb-2 mb-3">
                    {title && <h2 className="text-xl font-semibold">{title}</h2>}
                    <button className="text-gray-600 hover:text-black" onClick={onClose}>✖</button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
