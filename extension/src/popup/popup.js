import { contactDB } from "/libs/db.js"

const msg = document.getElementById("message");
const btn = document.getElementById("finished");
const pwd = document.getElementById("pwd");
const pwdNav = document.getElementById("app-pwds");
const settingsNav = document.getElementById("app-settings");
const helpNav = document.getElementById("app-help");
const getAppNav = document.getElementById("app-get");
const page = document.getElementById("content-body");

const lockTime = 5 * 60 * 1000;
let locked = false;

if (!localStorage.getItem("attempts")) {
    localStorage.setItem("attempts", 5);
}

if (localStorage.getItem("attempts") < 5) {
    msg.innerText = `Incorrect password! ${localStorage.getItem("attempts")} attempts until lockout!`;
}

const finishTime = Number(localStorage.getItem("finishTime") || 0);

if (finishTime > Date.now()) {
    locked = true;
    btn.setAttribute("disabled", true);
    waitTime();
} else {
    localStorage.setItem("finishTime", "0");
}

function waitTime() {
    updateClock();

    const finishTime = Number(localStorage.getItem("finishTime") || 0);

    if (Date.now() >= finishTime) {
        locked = false;
        localStorage.setItem("attempts", 5);
        localStorage.setItem("finishTime", "0");
        btn.removeAttribute("disabled");
        msg.innerText = "Lockout finished! Enter the password you have created to gain access to this app.";
        return;
    }

    requestAnimationFrame(waitTime);
}

function updateClock() {
    const finishTime = Number(localStorage.getItem("finishTime") || 0);
    const timeLeft = Math.max(0, finishTime - Date.now());
    const totalSeconds = Math.ceil(timeLeft / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    msg.innerText = `Incorrect password! Locked out for ${minutes}:${String(seconds).padStart(2, "0")}`;
}

if (!localStorage.getItem("login")) {
    msg.innerText = "Please create a password, do not forget it as you will use it to access the extension every time you use it!";
}

btn.addEventListener("click", () => {
    if (locked) return;

    const savedLogin = localStorage.getItem("login");

    if (!savedLogin) {
        localStorage.setItem("login", encrypt(pwd.value));
        msg.innerText = "Password created!";
        enableMenu();
        pwdNav.click();
        return;
    }

    if (pwd.value !== decrypt(savedLogin)) {
        if (localStorage.getItem("attempts") > 1) {
            localStorage.setItem("attempts", localStorage.getItem("attempts") - 1);
            msg.innerText = `Incorrect password! ${localStorage.getItem("attempts")} attempts until lockout!`;
        } else {
            localStorage.setItem("attempts", 5);
            locked = true;
            btn.setAttribute("disabled", true);

            localStorage.setItem("finishTime", String(Date.now() + lockTime));

            waitTime();
        }
    } else {
        localStorage.setItem("attempts", 5);
        enableMenu();
        pwdNav.click();
    }
});

const MULTIPLIER = 793256731341849283943958123n;
const SEPARATOR = "678909487689009876528749809257684981935279185736109781";

const charNum = [..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890~!@#$%^&*()_+=-`;:|\\[{]}'\".,<>?/"];

function encrypt(data) {
    return [...data].map(char => {
        const index = charNum.indexOf(char);

        if (index === -1) {
            return char;
        }

        return BigInt(index) * MULTIPLIER;
    }).join(SEPARATOR);
}

function decrypt(data) {
    return data.split(SEPARATOR).map(value => {
        try {
            const num = BigInt(value);

            if (num % MULTIPLIER === 0n) {
                const index = Number(num / MULTIPLIER);

                if (index >= 0 && index < charNum.length) {
                    return charNum[index];
                }
            }
        } catch {}

        return value;
    }).join("");
}

pwdNav.addEventListener("click", () => {
    page.innerHTML = `
        <h3>Passwords</h3>
        <h5 id="message">All saved passwords:</h5>
        <input id="search">
        <div id="results">
            You currently have no saved passwords!
        </div>
        <script>
            let res = document.getElementById("results");
            res.innerText = ${contactDB("SELECT", "passwords")};
        </script>
    `;
});

settingsNav.addEventListener("click", () => {
    page.innerHTML = `
        <h3>Settings</h3>
        <h5 id="message">Edit settings</h5>
        <div id="settings">
            <label for="db">Enter your database info to store encrypted passwords.</label>
            <input name="db" id="dbdata">
        </div>
    `;
});

helpNav.addEventListener("click", () => {
    page.innerHTML = `
        <h3>Help</h3>
        <div id="help">
            No help yet!
        </div>
    `;
});

getAppNav.addEventListener("click", () => {
    page.innerHTML = `
        <h3>Get the app!</h3>
        <h5 id="message">Availible on nothing right now.</h5>
        <div id="getApp">
            No app yet!
        </div>
    `;
});

function enableMenu() {
    [pwdNav, settingsNav, helpNav, getAppNav].forEach(nav => {
        nav.removeAttribute("disabled");
    });
}

document.addEventListener("keydown", e => {
    if (e.key == "Enter") {
        btn.click();
    }
});