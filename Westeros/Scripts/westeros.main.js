window.Westeros = function () {
    
    function _logBase(msg) {
        try { if (window.console && console.log) console.log(msg); }
        catch (err) { } //ignore logging  
    }

    function _log(msg) {
        _logBase(msg);
    }

    return {
        log: function(msg) {
            _log(msg);
        }
    };
}();

Westeros.Main = (function () {

    var stage;
    var layer;

    var init = function() {
        //Westeros.Utilities.createEntitiesFromSvg();
        
        stage = new Kinetic.Stage({
            container: 'container',
            width: 1819,
            height: 3168
        });
        
        layer = new Kinetic.Layer();

        $.each(Westeros.Utilities.paths, function(i, v) {
            addPath(v);
        });
    };

    var addPath = function (data) {

        var path = new Kinetic.Path({
            data: data,
            fill: 'black',
            scale: 1
        });

        path.on("mouseover", function() {
            this.setFill('white');
            Westeros.log("mouseover");
            layer.draw();
        });
        
        path.on("mouseout", function () {
            this.setFill('black');
            layer.draw();
        });

        layer.add(path);
        stage.add(layer);
    };

    return {
        "init": init,
        "addPath": addPath
    };
}());

