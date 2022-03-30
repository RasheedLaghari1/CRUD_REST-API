export function handleValidation(inputName, inputValue, formErrors) {
    switch (inputName) {
        case "email":
            let email_pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (inputValue.length < 1) {
                formErrors.email = "This Field is Required.";
            } else if (!email_pattern.test(inputValue)) {
                formErrors.email = "Please enter valid email format.";
            } else {
                formErrors.email = "";
            }
            break;
        default:
            if (
                inputValue.length < 1
            ) {
                formErrors[inputName] = 'This Field is Required.'
            } else {
                formErrors[inputName] = ''
            }
    }

    return formErrors
}
export function handleWholeValidation(states, formErrors) {
    Object.keys(states).map(function (key) {
        formErrors = handleValidation(
            key, //name of field
            states[key], //value of field
            formErrors
        )
    })
    return formErrors
}
