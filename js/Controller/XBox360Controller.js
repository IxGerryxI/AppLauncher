import Controller from './Controller.js';

export default class XBox360Controller extends Controller {
    constructor(gamepadIndex) {
        const buttons = {
            0: {
                name: 'A',
            },
            1: {
                name: 'B',
            },
            2: {
                name: 'X',
            },
            3: {
                name: 'Y',
            },
            4: {
                name: 'LB',
            },
            5: {
                name: 'RB',
            },
            6: {
                name: 'LT',
            },
            7: {
                name: 'RT',
            },
            8: {
                name: 'Back',
            },
            9: {
                name: 'Start',
            },
            10: {
                name: 'L3',
            },
            11: {
                name: 'R3',
            },
            12: {
                name: 'Up',
            },
            13: {
                name: 'Down',
            },
            14: {
                name: 'Left',
            },
            15: {
                name: 'Right',
            },
            16: {
                name: 'Logo',
            },
        };
        const axes = {
            0: {
                direction: 'horizontal',
                stick: 'L',
                name: 'LH'
            },
            1: {
                direction: 'vertical',
                stick: 'L',
                name: 'LV'
            },
            2: {
                direction: 'horizontal',
                stick: 'R',
                name: 'RH'
            },
            3: {
                direction: 'vertical',
                stick: 'R',
                name: 'RV'
            },

        };
        super(buttons, axes, gamepadIndex);
    }
}