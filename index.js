
(function(){
    
const consoleKeys = Object.keys(console);

Object.defineProperty(console,'nativeFunctions',{value:{},enumerable:false});
Object.defineProperty(console,'eventFunctions',{value:{},enumerable:false});


Object.defineProperty(console,'addEventListener',{
    value:function(name,eventFunction){
        if(name && 
            eventFunction && 
            typeof eventFunction == 'function' &&
            consoleKeys.indexOf(name) != -1 
            ){
            const nativreFunction =  Object.getOwnPropertyDescriptor(console,name);
            if(nativreFunction.value){
                const newConsoleFunction = new Function(`
                if(console.eventFunctions['${name}']){
                    try{
                        console.eventFunctions['${name}'].forEach((f)=>{
                            f(...arguments)
                        });
                    }
                    catch(ex){
    
                    }
                }
                
                console.nativeFunctions['${name}'].value(...arguments);
                `);


                if(!console.eventFunctions[name]){
                    console.eventFunctions[name] = [];
                }
                console.eventFunctions[name].push(eventFunction);

                if(!console.nativeFunctions[name]){
                    console.nativeFunctions[name] = nativreFunction;
                }
                
                console[name] = newConsoleFunction;
            }

        }
    },
    enumerable:true,
    configurable:false,
});

Object.defineProperty(console,'removeEventListener',{
    value:function(name,eventFunction){
        if(name && 
            eventFunction && 
            typeof eventFunction == 'function' &&
            consoleKeys.indexOf(name) != -1 
            ){
                if(console.eventFunctions[name] 
                    && console.eventFunctions[name].indexOf(eventFunction) !== -1){
                    console.eventFunctions[name].splice(console.eventFunctions[name].indexOf(eventFunction),1)
                }

                if(console.eventFunctions[name].length == 0){
                    delete console.eventFunctions[name];
                    console[name] = console.nativeFunctions[name].value;
                    delete console.nativeFunctions[name];
                }
            }
    },
    enumerable:true,
    configurable:false,
});
    
})();

