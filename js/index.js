import XBox360Controller from './Controller/XBox360Controller.js';

const CONTROLLERS = [];
const APPS = [
    {
        name: "Steam",
        path: "D:\\Programme\\Steam\\Steam.exe",
        optArgs: ['-start', 'steam://open/bigpicture'],
        desc: "Steam Client in BigPicture Mode",
        icon: "assets/steam_logo.svg"
    },
    {
        name: "Kodi",
        path: "",
        optArgs: ['--fullscreen'],
        desc: "Kodi Media Player",
        icon: "assets/kodi_logo.svg"
    }
];

/************************************************************************************
 * GAMEPAD CONNECTION 
 ************************************************************************************/
function gamepadConnected(e) {
    if (e.gamepad.id.includes('Xbox 360 Controller')) {
        const controller = new XBox360Controller(e.gamepad.index);
        controller.addEventListener('Left_btn_keyUp', selectPrevious);
        controller.addEventListener('Right_btn_keyUp', selectNext);
        controller.addEventListener('Up_btn_keyUp', toggleActionBarFocus);
        controller.addEventListener('Down_btn_keyUp', toggleActionBarFocus);
        controller.addEventListener('A_btn_keyDown', clickSelectedApp);
        controller.addEventListener('B_btn_keyDown', function () {
            console.log(controller)
        });
        const throttledOnHAxesChange = throttle(onHAxesChange);
        controller.addEventListener('LH_btn_axesChange', throttledOnHAxesChange);
        controller.addEventListener('RH_btn_axesChange', throttledOnHAxesChange);

        const throttledOnVAxesChange = throttle(onVAxesChange);
        controller.addEventListener('LV_btn_axesChange', throttledOnVAxesChange);
        controller.addEventListener('RV_btn_axesChange', throttledOnVAxesChange);
        CONTROLLERS[e.gamepad.index] = controller;
    }
}

function gamepadDisconnected(e) {
    CONTROLLERS[e.gamepad.index].disconnect();
    delete CONTROLLERS[e.gamepad.index];
}

window.addEventListener("gamepadconnected", gamepadConnected);
window.addEventListener("gamepaddisconnected", gamepadDisconnected);
window.addEventListener('visibilityChange', () => {
    console.log('visibility changed')
    document.body.style.backgroundColor = '#f00';
})


const ACTIONBAR_MAPPING = {
    settingsButton: showSettings,
    shutdownButton: shutdown
};
const actionbarElements = document.querySelectorAll('#actionbar article');
for (const el of actionbarElements) {
    el.addEventListener('click', () => ACTIONBAR_MAPPING[el.id]());
    el.addEventListener('mouseover', () => {
        document.querySelector("article.selected")?.classList?.remove('selected');
        el.classList.add('selected')
    });
    el.addEventListener('mouseout', () => el.classList.remove('selected'));
}

/************************************************************************************
 * APP DISPLAY
 ************************************************************************************/
const appContainer = document.getElementById('appContainer');
for (const app of APPS) {
    const id = `${app.name}_card`;
    const html = `
        <article id="${id}">
            <img src="${app.icon}" alt="${app.name} logo">
            <h2>${app.name}</h2>
        </article> `;
    appContainer.insertAdjacentHTML('beforeend', html);

    const el = document.getElementById(id);
    el.addEventListener('click', () => launch(app));
    el.addEventListener('mouseover', () => {
        document.querySelector("article.selected")?.classList?.remove('selected');
        el.classList.add('selected')
    });
    el.addEventListener('mouseout', () => el.classList.remove('selected'));
}
/************************************************************************************
 * APP SELECTION
 ************************************************************************************/
function selectPrevious() {
    const selector = document.querySelector('#actionbar .selected') ? '#actionbar' : '#appContainer';
    const currentSelected = document.getElementsByClassName('selected')[0] || document.querySelector(selector + " article:first-child");
    const previousSibling = currentSelected.previousElementSibling || document.querySelector(selector + " article:last-child");
    currentSelected.classList.remove('selected');
    previousSibling.classList.add('selected');
}

function selectNext() {
    const selector = document.querySelector('#actionbar .selected') ? '#actionbar' : '#appContainer';
    const currentSelected = document.getElementsByClassName('selected')[0] || document.querySelector(selector + " article:last-child");
    const nextSibling = currentSelected.nextElementSibling || document.querySelector(selector + " article:first-child");
    currentSelected.classList.remove('selected');
    nextSibling.classList.add('selected');
}

function onHAxesChange(event) {
    if (event.value > 5) selectNext();
    else if (event.value < -5) selectPrevious();
}

function onVAxesChange(event) {
    if (event.value > 5 || event.value < -5) toggleActionBarFocus();
}

function toggleActionBarFocus() {
    const selector = document.querySelector('#actionbar .selected') ? '#appContainer' : '#actionbar';
    const currentSelected = document.getElementsByClassName('selected')[0];
    currentSelected?.classList.remove('selected');

    document.querySelector(selector + ' article:first-child').classList.add('selected');

}

/************************************************************************************
 * APP LAUNCH
 ************************************************************************************/

function clickSelectedApp() {
    document.querySelector("article.selected")?.click()
}

/**
 * executes the file at the given path with the given arguments
 * @param {String} path 
 * @param {Array<String>} args 
 * @returns {Promise}
 */
function launch(app) {
    const path = app.path;
    const args = app.optArgs;

    CONTROLLERS.forEach(controller => {
        controller.pause();
    })

    launcher.execFile(path, args, function (err, data) {
        if (err) console.error(err);
        CONTROLLERS.forEach(controller => {
            controller.continue();
        })
    });
}

/**
 * shuts down the pc
 * only works on windows
 */
function shutdown() {
    const command = 'shutdown /s /f /t 0';
    launcher.exec(command);
}

/**
 * 
 */
function showSettings() {
    console.log('look at the settings');
}

/**
 * 
 * @param {Function} cb 
 * @param {Number} [delay] 
 * @returns 
 */
function throttle(cb, delay = 100) {
    let shouldWait = false
    let waitingArgs
    const timeoutFunc = () => {
        if (waitingArgs == null) {
            shouldWait = false
        } else {
            cb(...waitingArgs)
            waitingArgs = null
            setTimeout(timeoutFunc, delay)
        }
    }

    return (...args) => {
        if (shouldWait) {
            waitingArgs = args
            return
        }

        cb(...args)
        shouldWait = true

        setTimeout(timeoutFunc, delay)
    }
}