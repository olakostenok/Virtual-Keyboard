const container  = document.createElement('div');
container.classList.add('container');
document.body.appendChild(container);

const block1 = document.createElement('div')
block1.classList.add('block1');
container.appendChild(block1);

const title = document.createElement('div');
title.classList.add('title');
block1.appendChild(title);
title.innerHTML = '<b>Virtual Keyboard</b>';

const line = document.createElement('hr');
line.classList.add('line');
block1.appendChild(line);

const textarea = document.createElement('textarea');
textarea.classList.add('textarea');
block1.appendChild(textarea);

var isChange = true;
var keyLayout = [
    { eng : '1', rus : '1', id : 'Digit1' },
    { eng : '2', rus : '2', id : 'Digit2' },
    { eng : '3', rus : '3', id : 'Digit3' },
    { eng : '4', rus : '4', id : 'Digit4' },
    { eng : '5', rus : '5', id : 'Digit5' },
    { eng : '6', rus : '6', id : 'Digit6' },
    { eng : '7', rus : '7', id : 'Digit7' },
    { eng : '8', rus : '8', id : 'Digit8' },
    { eng : '9', rus : '9', id : 'Digit9' },
    { eng : '0', rus : '0', id : 'Digit0' },
    { eng : '-', rus : '-', id : 'Minus' },
    { eng : '=', rus : '=', id : 'Equal' },
    { eng : 'backspace', rus : 'backspace', id : 'Backspace' },
    { eng : 'tab', rus : 'tab', id : 'Tab' },
    { eng : 'q', rus : 'й', id : 'KeyQ' },
    { eng : 'w', rus : 'ц', id : 'KeyW' },
    { eng : 'e', rus : 'у', id : 'KeyE' },
    { eng : 'r', rus : 'к', id : 'KeyR' },
    { eng : 't', rus : 'е', id : 'KeyT' },
    { eng : 'y', rus : 'н', id : 'KeyY' },
    { eng : 'u', rus : 'г', id : 'KeyU' },
    { eng : 'i', rus : 'ш', id : 'KeyI' },
    { eng : 'o', rus : 'щ', id : 'KeyO' },
    { eng : 'p', rus : 'з', id : 'KeyP' },
    { eng : '[', rus : 'х', id : 'BracketLeft' },
    { eng : ']', rus : 'ъ', id : 'BracketRight' },
    { eng : 'capsLock', rus : 'capsLock', id : 'CapsLock' },
    { eng : 'a', rus : 'ф', id : 'KeyA' },
    { eng : 's', rus : 'ы', id : 'KeyS' },
    { eng : 'd', rus : 'в', id : 'KeyD' },
    { eng : 'f', rus : 'а', id : 'KeyF' },
    { eng : 'g', rus : 'п', id : 'KeyG' },
    { eng : 'h', rus : 'р', id : 'KeyH' },
    { eng : 'j', rus : 'о', id : 'KeyJ' },
    { eng : 'k', rus : 'л', id : 'KeyK' },
    { eng : 'l', rus : 'д', id : 'KeyL' },
    { eng : ';', rus : 'ж', id : 'Semicolon' },
    { eng : "'", rus : 'э', id : 'Quote' },
    { eng : '\\', rus : 'ё', id : 'Backslash' },
    { eng : 'enter', rus : 'enter', id : 'Enter' },
    { eng : 'shiftLeft', rus : 'shiftLeft', id : 'ShiftLeft' },
    { eng : '`', rus : ']', id : 'IntlBackslash' },
    { eng : 'z', rus : 'я', id : 'KeyZ' },
    { eng : 'x', rus : 'ч', id : 'KeyX' },
    { eng : 'c', rus : 'с', id : 'KeyC' },
    { eng : 'v', rus : 'м', id : 'KeyV' },
    { eng : 'b', rus : 'и', id : 'KeyB' },
    { eng : 'n', rus : 'т', id : 'KeyN' },
    { eng : 'm', rus : 'ь', id : 'KeyM' },
    { eng : ',', rus : 'б', id : 'Comma' },
    { eng : '.', rus : 'ю', id : 'Period' },
    { eng : '/', rus : '/', id : 'Slash' },
    { eng : 'arrowUp', rus : 'arrowUp', id : 'ArrowUp' },
    { eng : 'shiftRight', rus : 'shiftRight', id : 'ShiftRight' },
    { eng : 'fn', rus : 'fn', id : 'fn' },
    { eng : 'control', rus : 'control', id : 'ControlLeft' },
    { eng : 'option', rus : 'option', id : 'AltLeft' },
    { eng : 'cmd', rus : 'cmd', id : 'MetaLeft' },
    { eng : 'space', rus : 'space', id : 'Space' },
    { eng : 'cmd', rus : 'cmd', id : 'MetaRight' },
    { eng : 'option', rus : 'option', id : 'AltRight' },
    { eng : 'arrowLeft', rus : 'arrowLeft', id : 'ArrowLeft' },
    { eng : 'arrowDown', rus : 'arrowDown', id : 'ArrowDown' },
    { eng : 'arrowRight', rus : 'arrowRight', id : 'ArrowRight' }
];

const Keyboard = {
    elements: {
        block2: null,
        keyboard: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: "",
        capsLock: false
    },

    init() {
        this.elements.block2 = document.createElement('div');
        this.elements.block2.classList.add('block2');
        
        this.elements.keyboard = document.createElement('div');
        this.elements.keyboard.classList.add('keyboard');

        this.elements.keyboard.appendChild(this._createKeys());

        this.elements.block2.appendChild(this.elements.keyboard);
        container.appendChild(this.elements.block2);

        this.elements.keys = this.elements.keyboard.querySelectorAll('button');

        document.querySelectorAll('textarea').forEach(element => {
            element.addEventListener('focus', () => {
                this.open(element.value, currentValue => {
                    element.value = currentValue;
                })
            });
        });
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();      
        const createIcon = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement('button');
            const insertLineBreak = ['backspace', ']', 'enter', 'shiftRight'].indexOf(key.eng) !== -1;

            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('button');
            keyElement.setAttribute('id', key.id);

            switch (key.eng) {
                case 'backspace':
                    keyElement.classList.add('backspaceButton');
                    keyElement.innerHTML = createIcon('backspace');

                    keyElement.addEventListener('click', () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent('oninput');
                    });
    
                    break;
                
                case 'tab':
                    keyElement.classList.add('tabButton');
                    keyElement.innerHTML = createIcon('keyboard_tab');
                    break;
                
                case 'capsLock':
                    keyElement.classList.add('capsLockButton', 'capsLockButton-activatable');
                    keyElement.innerHTML = createIcon('keyboard_capslock');
                    
                    keyElement.addEventListener ('click', () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle('capsLockButton-active', this.properties.capsLock);
                    });
                    break;

                case 'enter':
                    keyElement.classList.add('enterButton');
                    keyElement.innerHTML = createIcon('subdirectory_arrow_left');

                    keyElement.addEventListener('click', () => {
                        this.properties.value += '\n';
                        this._triggerEvent('oninput');
                    });
                    break;

                case 'shiftLeft':
                    keyElement.classList.add('shiftLeft');
                    keyElement.innerHTML = createIcon('forward');
                    break;

                case 'arrowUp':
                    keyElement.classList.add('arrowUp');
                    keyElement.innerHTML = createIcon('arrow_drop_up');
                    break;

                case 'shiftRight':
                    keyElement.classList.add('shiftRight');
                    keyElement.innerHTML = createIcon('forward');
                    break;

                case 'space':
                    keyElement.classList.add('spaceButton');
                    keyElement.innerHTML = createIcon('space_bar');

                    keyElement.addEventListener('click', () => {
                        this.properties.value += ' ';
                        this._triggerEvent('oninput');
                    });
                    break;

                case 'control':
                    keyElement.classList.add('control');
                    keyElement.innerHTML = createIcon('keyboard_arrow_up');
                    break;

                case 'arrowLeft':
                    keyElement.classList.add('arrowLeft');
                    keyElement.innerHTML = createIcon('arrow_left');
                    break;

                case 'arrowDown':
                    keyElement.classList.add('arrowDown');
                    keyElement.innerHTML = createIcon('arrow_drop_down');
                    break;

                case 'arrowRight':
                    keyElement.classList.add('arrowRight');
                    keyElement.innerHTML = createIcon('arrow_right');
                    break;

                default:
                    keyElement.textContent = key.eng.toLocaleLowerCase();

                    keyElement.addEventListener('click', () => {
                        this.properties.value += this.properties.capsLock ? key.eng.toUpperCase() : key.eng.toLowerCase();
                        this._triggerEvent('oninput');
                    });
                    break;
            }

            fragment.appendChild(keyElement);
            if(insertLineBreak) {
                fragment.appendChild(document.createElement('br'));
            }
        });

        return fragment;

    },

    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == 'function') {  
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for(const key of this.elements.keys) {
            if(key.childElementCount === 0 && key.textContent !== 'fn' && key.textContent !== 'cmd' && key.textContent !== 'option') {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
    },

    close() {
        this.properties.value = '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
    }
  
}

window.addEventListener("DOMContentLoaded", function () { 
   Keyboard.init();
 });

 
 textarea.onkeydown = function (event) {
    
    let backLight = document.getElementById(event.code);
    backLight.classList.add('changeColor');  
    setTimeout(function() {
        backLight.classList.remove('changeColor');
      }, 200);

      if(event.code === 'MetaLeft') {
        keyLayout.forEach(key => {
            const keyElement = document.getElementById(key.id);
            if(keyElement.childElementCount === 0) {
                keyElement.textContent = isChange ? key.rus.toLocaleLowerCase() : key.eng.toLocaleLowerCase();
            }  
         });
         isChange = !isChange;
    }
  }

