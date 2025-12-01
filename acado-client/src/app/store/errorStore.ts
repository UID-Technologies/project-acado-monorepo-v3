const errors: Error[] = [];

export const addError = (error: Error) => {
    errors.push(error);
};

export const getErrors = () => errors;

export const clearErrors = () => {
    errors.length = 0;
};
