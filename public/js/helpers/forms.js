//? ------------------------------------------------------------------------------------
//?
//?  /helpers/forms.js
//?  Discord JS
//?
//?  Developed by Cooper Beltrami
//?
//?  Project built using designs, graphics and other assets developed by Discord Inc.
//?  Copyright (c) 2021 Cooper Beltrami and Discord Inc. All Rights Reserved
//?     
//? ------------------------------------------------------------------------------------


/**
 * 
 * @param {*} id 
 * @returns 
 */
function showInputError(id) {
    const element = document.getElementById(id);

    return element.classList.add('inputError-1PrjdI');
}


/**
 * 
 * @param {*} id 
 * @returns 
 */
 function hideInputError(id) {
    const element = document.getElementById(id);

    return element.classList.remove('inputError-1PrjdI');
}


/**
 * 
 * @param {*} id 
 * @param {*} message 
 */
function showLabelError(id, message, hideSeparator) {
    const element = document.getElementById(id);

    if (element.querySelectorAll('span')[0]) return;

    if (hideSeparator) {
        element.innerHTML += `
            <span class="errorMessage-3Guw2R">
                ${message}
            </span>
        `;
    } else {
        element.innerHTML += `
            <span class="errorMessage-3Guw2R">
                <span class="errorSeparator-30Q6aR">-</span>
                ${message}
            </span>
        `;
    }

    element.classList.add('error-25JxNp');
}


/**
 * 
 * @param {*} id 
 */
 function hideLabelError(id) {
    const element = document.getElementById(id);

    if (!element.querySelectorAll('span')[0]) return;

    element.removeChild(element.childNodes[1]);
    element.classList.remove('error-25JxNp');
}


/**
 * 
 * @param {*} element 
 */
function showButtonLoader(element) {
    if (element.querySelectorAll('span')[0]) return;

    element.innerHTML += `
        <span class="spinner-2enMB9 spinner-3a9zLT button-3k0cO7 button-38aScr lookFilled-1Gx00P colorBrand-3pXr91">
            <span class="inner-1gJC7_ pulsingEllipsis-3YiXRF">
                <span class="pulsingEllipsisItem-32hhWL spinnerItem-3GlVyU"></span>
                <span class="pulsingEllipsisItem-32hhWL spinnerItem-3GlVyU"></span>
                <span class="pulsingEllipsisItem-32hhWL spinnerItem-3GlVyU"></span>
            </span>
        </span>
    `;
}


/**
 * 
 * @param {*} element 
 */
function hideButtonLoader(element) {
    element.innerHTML = `<div class="contents-18-Yxp">Login</div>`;
}


/**
 * 
 * @param {*} element 
 */
function disableButton(element) {
    element.setAttribute('disabled', '');
}


/**
 * 
 * @param {*} element 
 */
function enableButton(element) {
    element.removeAttribute('disabled');
}


/**
 * 
 * Inputs must be ended with "Field". eg: emailField
 * Labels must be ended with Label. eg: emailLabel
 * 
 * @param {*} ids 
 * @returns 
 */
function validateInputs(ids) {
    const values = {};

    // Clear all initial errors
    ids.forEach(id => {
        hideInputError(id + 'Field');
        hideLabelError(id + 'Label');
    })
    
    // Check each input
    ids.forEach(id => {
        const element = document.getElementById(id + 'Field');
        const type = element.getAttribute('type');

        // Field is empty
        if (!element.value) {
            showInputError(id + 'Field');
            showLabelError(id + 'Label', 'This field is required.');

            return;
        }

        // Invalid email address
        if (type === 'email' && !validateEmail(element.value)) {
            showInputError(id + 'Field');
            showLabelError(id + 'Label', 'Email address is invalid.');

            return;
        }

        // Field is not at the correct length
        const minLength = element.getAttribute('min');
        const maxLength = element.getAttribute('max');

        if (element.value.length < minLength) {
            showInputError(id + 'Field');
            showLabelError(id + 'Label', `Minimum length is ${minLength} characters.`);
        } else if (element.value.length > maxLength) {
            showInputError(id + 'Field');
            showLabelError(id + 'Label', `Maximum length is ${maxLength} characters.`);
        } else {
            values[id] = element.value;
        }
    });

    // Check to see if all fields are valid
    if (Object.keys(values).length === ids.length) {
        return values;
    } else {
        return;
    }
}