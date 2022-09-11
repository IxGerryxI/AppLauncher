/**
 * this is the default class for the controller
 * @param {Object} buttons - an object where each index of a key is mapped to the name of the key
 * @param {Object} axes
 * @param {Number} gamepadIndex - the index of the controller in the navigator.getGamepads()-Array
 * 
 * EVENTS
 *  keyDown 
 *  keyUp
 *  keyHold
 *  axesChange
 *  
 *  *Keyname*_btn_*Eventname* - e.g. A_btn_keyDown
 * 
 * use the addEventlistener function to add listeners to the above event
 */

export default class Controller {
    #eventListeners = [];
    #paused = false;
    #boundLoop = null;
    //the sensitivity of the axes input, the higher the more sensitive it is
    #AXES_SENSITIVITY = 1;

    constructor(buttons, axes, gamepadIndex) {
        this.buttons = buttons;
        this.axes = axes;
        navigator.getGamepads()[gamepadIndex].axes.forEach((value, index) => {
            this.axes[index].value = Math.round(value * Math.pow(10, this.#AXES_SENSITIVITY));
        })

        this.gamepadIndex = gamepadIndex;
        this.#boundLoop = this.#loop.bind(this);
        window.requestAnimationFrame(this.#boundLoop);
    }

    #loop() {
        const gamepad = navigator.getGamepads()[this.gamepadIndex];
        const buttons = gamepad?.buttons || [];
        const axes = gamepad?.axes || [];
        if (buttons.length == 0 || axes.length == 0) return;
        if (this.#paused) return;

        buttons.forEach((button, index) => {
            if (button.pressed && !this.buttons[index].isPressed) {
                // KeyDown
                this.buttons[index].isPressed = true;
                this.buttons[index].pressedSince = new Date();

                this.#emit('keyDown', this.buttons[index]);
            } else if (!button.pressed && this.buttons[index].isPressed) {
                // KeyUp
                this.buttons[index].isPressed = false;
                this.buttons[index].pressedSince = null;

                this.#emit('keyUp', this.buttons[index]);
            } else if (button.pressed && this.buttons[index].isPressed) {
                //KeyHold
                // const holdTime = new Date().getTime() - this.buttons[index].pressedSince.getTime();

                this.#emit('keyHold', this.buttons[index]);
            }
        });

        axes.forEach((value, index) => {
            const roundedValue = Math.round(value * Math.pow(10, this.#AXES_SENSITIVITY));
            if (roundedValue != this.axes[index].value) {
                this.axes[index].value = roundedValue;
                this.#emit('axesChange', this.axes[index]);
            }
        })


        window.requestAnimationFrame(this.#boundLoop);
    }
    /**
     * 
     * @param {String} event 
     * @param {Object} key 
     */
    #emit(event, key) {
        if (this.#eventListeners[event]?.length) this.#eventListeners[event].forEach(callback => callback(key));
        const keyEvent = key.name + '_btn_' + event;
        if (this.#eventListeners[keyEvent]?.length) this.#eventListeners[keyEvent].forEach(callback => callback(key));
    }

    /**
     * 
     * @param {String} event 
     * @param {Function} callback 
     */
    addEventListener(event, callback) {
        this.#eventListeners[event] = this.#eventListeners[event] || [];
        this.#eventListeners[event].push(callback);
    }

    /**
     * disconnects the controller
     */
    disconnect() {
        this.#eventListeners = []
        this.buttons = {};
        this.axes = {};
        this.gamepadIndex = -1;
    }

    /**
     * stops listening for input
     */
    pause() {
        this.#paused = true;
    }

    /**
     * continues listening for input
     */
    continue() {
        this.#paused = false;
        window.requestAnimationFrame(this.#boundLoop);
    }


}


