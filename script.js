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

var replacer = {
    "q" : "й", 
    "w" : "ц", 
    "e" : "у", 
    "r" : "к",
    "t" : "е", 
    "y" : "н", 
    "u" : "г",
    "i" : "ш",
    "o" : "щ", 
    "p" : "з",  
    "[" : "х", 
    "]" : "ъ", 
    "a" : "ф", 
    "s" : "ы",
    "d" : "в", 
    "f" : "а",  
    "g" : "п", 
    "h" : "р", 
    "j" : "о", 
    "k" : "л", 
    "l" : "д",
    ";" : "ж", 
    "'" : "э", 
    "z" : "я", 
    "x" : "ч", 
    "c" : "с", 
    "v" : "м", 
    "b" : "и",
    "n" : "т", 
    "m" : "ь", 
    "," : "б", 
    "." : "ю",
    "/" : "."
}; 

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
        let keyLayout = [
            '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace',
            'tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']',
            'capsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", '\\', 'enter',
            'shiftLeft', '`', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'arrowUp', 'shiftRight',
            'fn', 'control', 'option', 'cmd', 'space', 'cmd', 'option', 'arrowLeft', 'arrowDown', 'arrowRight'
        ];


        const createIcon = (icon_name) => {
            return `<i class="material-icons">${icon_name}</i>`;
        };

        keyLayout.forEach(key => {
            const keyElement = document.createElement('button');
            const insertLineBreak = ['backspace', ']', 'enter', 'shiftRight'].indexOf(key) !== -1;

            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('button');

            switch (key) {
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
                    keyElement.textContent = key.toLocaleLowerCase();

                    keyElement.addEventListener('click', () => {
                        this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
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

 
 textarea.onkeydown = function changeLanguage(event) {
   
   
    //console.log('charCode: ' + event.charCode);
   // console.log('code: ' + event.code);
    // console.log('key: ' + event.key);
   // console.log(event);
    console.log('keyCode: ' + event.keyCode);
  let mass = [...Keyboard.elements.keys];
   console.log(mass);
  //  console.log(replacer);
let translate =[];
  
    if(event.keyCode == '16') {
        keyLayout.forEach(function(item){
            translate.push(replacer[item]);
          });
          console.log(translate);
    }
  }

