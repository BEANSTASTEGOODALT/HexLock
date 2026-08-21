import { contactDB } from "/libs/db.js"

const iconURL = chrome.runtime.getURL('assets/icons/icon128.png');
const generatedPasswords = new WeakSet();

function showHintIcon(input) {

    hideHintIcon();

    if (generatedPasswords.has(input)) {
        return;
    }

    const rect = input.getBoundingClientRect();

    const hintIcon = document.createElement('div');

    hintIcon.id = 'hint-icon';

    hintIcon.innerHTML = `
        <img
            src="
            ${iconURL}
            "
             style="
                width: auto;
                height: ${rect.height-5}px;
                cursor: pointer;
                display: block;
                position: absolute;
                top: ${window.scrollY + rect.top+2.5}px;
                left: ${window.scrollX + rect.right}px;
                transform: translateX(-${(rect.width/9)+1.5}px);
                z-index: 999999;
                pointer-events: auto;
             "
             >
    `;

    document.body.appendChild(hintIcon);

    hintIcon.addEventListener('click', () => {
        generatePassword(input.id, input);
        hideHintIcon();
    });
}

function hideHintIcon() {
    const hintIcon = document.getElementById('hint-icon');

    if (hintIcon) {
        hintIcon.remove();
    }
}

document.addEventListener('focusin', (event) => {
    const input = event.target;

    if (
        input instanceof HTMLInputElement &&
        input.type === 'password'
    ) {
        setTimeout(() => {
            showHintIcon(input);
        }, 150);
    }
});

document.addEventListener('input', (event) => {
    const input = event.target;

    if (
        input instanceof HTMLInputElement &&
        input.type === 'password'
    ) {
        hideHintIcon();
    }
});

document.addEventListener('focusout', (event) => {
    const input = event.target;

    if (
        input instanceof HTMLInputElement &&
        input.type === 'password'
    ) {
        setTimeout(() => {
            if (document.activeElement !== input) {
                hideHintIcon();
            }
        }, 150);
    }
});

window.addEventListener('scroll', () => {
    hideHintIcon();
    if (document.activeElement instanceof HTMLInputElement && document.activeElement.type === 'password') {
        showHintIcon(document.activeElement);
    }
});

function generatePassword(inputId, input) {
    if (generatedPasswords.inputId) {
        return;
    }
    if (!inputId || inputId === "ID_NOT_FOUND") {
        item = document.activeElement;
    } else {
        item = document.getElementById(inputId);
    }
    if (!item) {
        console.error('No input element found to generate password for.');
        return;
    }
    let password = '';
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
    for (let i = 0, n = charset.length; i < length; ++i) {
        password += charset.charAt(Math.floor(Math.random() * n));
    }
    item.value  = password;
    generatedPasswords.add(input);
    let amount = 0;
    document.querySelectorAll('input[type=password]').forEach((pass) => {
        if (amount < 2) {
            pass.value = password;
            generatedPasswords.add(pass);
            amount++;
        }
        });
    }