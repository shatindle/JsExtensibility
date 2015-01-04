(function($) {
    var b = {}, 
        a = {};
        
    function add(name, ext, before) {
        if (ext instanceof Function) {
            if (before) {
                if (!b[name])
                    throw "unregistered name";
                
                b[name].push(ext);
            } else {
                if (!a[name])
                    throw "unregistered name";
                    
                a[name].push(ext);
            }
            return true;
        } else {
            throw "Extension must be a function";
        }
    }
    
    function register(p) {
        var p = $.extend({}, {
            name: "",
            runBefore: [],
            runAfter: []
        }, p);
        
        if (typeof p.name !== "string" || p.name === "")
            throw "Invalid extension namespace";
            
        if (!b[p.name])
            b[p.name] = [];
        
        if (!a[p.name])
            a[p.name] = [];
        
        for (var i = 0; i < p.runBefore.length; i++) {
            b[p.name].push(p.runBefore[i]);
        }
        
        for (var i = 0; i < p.runAfter.length; i++) {
            a[p.name].push(p.runAfter[i]);
        }
        
        return $;
    }
    
    function runBefore(name, func) {
        if (typeof func !== "undefined" && func instanceof Function) {
            return register.call(null, {
                name: name,
                runBefore: [func]
            });
        }
        if (b[name] instanceof Array) {
            for (var i = 0; i < b[name].length; i++) {
                b[name][i].apply(null, Array.prototype.slice.call(arguments, 1));
            }
        }
        
        return $;
    }
    
    function runAfter(name, func) {
        if (typeof func !== "undefined" && func instanceof Function) {
            return register.call(null, {
                name: name,
                runAfter: [func]
            });
        }
        if (a[name] instanceof Array) {
            for (var i = 0; i < a[name].length; i++) {
                a[name][i].apply(null, Array.prototype.slice.call(arguments, 1));
            }
        }
        
        return $;
    }
    
    var _i = {
        before: runBefore,
        after: runAfter
    };
    
    $.extensibility = function (p) {
        if (_i[p]) {
            return _i[p].apply(null, Array.prototype.slice.call(arguments, 1));
        } else if (typeof p === "object" || !p) {
            return register.apply(null, arguments);
        } else {
            $.error('Incorrect Method Call: ' + p);
        }
    };
    
})($);
