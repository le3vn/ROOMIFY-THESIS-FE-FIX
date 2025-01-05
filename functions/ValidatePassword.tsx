interface ValidatePasswordResult {
    isValid: boolean
    validationMessage: string
}

//eslint-disable-next-line
const PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$";    

const EMPTY_PASSWORD_VALIDATION_MESSAGE = "Please enter your password";
const INVALID_PASSWORD_VALIDATION_MESSAGE = "Please enter valid password";

const validatePasswordEmpty = (password: string): ValidatePasswordResult => {
    const isPasswordValid = password != '';
    return {
        isValid: isPasswordValid,
        validationMessage: isPasswordValid ? "" : EMPTY_PASSWORD_VALIDATION_MESSAGE
    };
}

const validatePasswordRegex = (password: string): ValidatePasswordResult => {
    const regex = new RegExp(PASSWORD_REGEX);
    const isPasswordValid = regex.test(password);
    return {
        isValid: isPasswordValid,
        validationMessage: isPasswordValid ? "" : INVALID_PASSWORD_VALIDATION_MESSAGE
    };
}

export default function validatePassword(password: string, isValidateRegex: boolean) {
    let result: ValidatePasswordResult = {
        isValid: true,
        validationMessage: "" 
    };
    result = validatePasswordEmpty(password);
    if (!result.isValid) return result;

    if (isValidateRegex)
    {
        result = validatePasswordRegex(password);
        if (!result.isValid) return result;
    }
    
    return result;
}



