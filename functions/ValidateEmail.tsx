interface ValidateEmailResult {
    isValid: boolean
    validationMessage: string
}

//eslint-disable-next-line
const EMAIL_REGEX = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";

const EMPTY_EMAIL_VALIDATION_MESSAGE = "Please enter your email";
const INVALID_EMAIL_VALIDATION_MESSAGE = "Please enter valid email";

const validateEmailEmpty = (email: string): ValidateEmailResult => {
    const isEmailValid = email != '';
    return {
        isValid: isEmailValid,
        validationMessage: isEmailValid ? "" : EMPTY_EMAIL_VALIDATION_MESSAGE
    };
}

const validateEmailRegex = (email: string): ValidateEmailResult => {
    const regex = new RegExp(EMAIL_REGEX);
    const isEmailValid = regex.test(email);
    return {
        isValid: isEmailValid,
        validationMessage: isEmailValid ? "" : INVALID_EMAIL_VALIDATION_MESSAGE
    };
}

export default function validateEmail(email: string) {
    let result: ValidateEmailResult = {
        isValid: true,
        validationMessage: "" 
    };
    result = validateEmailEmpty(email);
    if (!result.isValid) return result;

    result = validateEmailRegex(email);
    if (!result.isValid) return result;

    return result;
}



