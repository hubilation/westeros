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

    var territory = function(pathData, name, type, power, supply, musterPoints, adjacentTerritories) {
        var self = this;
        self.name = name;
        self.type = type;
        self.key = camelCase(self.name) + (self.type === 'port' ? "_port" : "");
        self.power = power || 0;
        self.supply = supply || 0;
        self.musterPoints = musterPoints || 0;
        self.adjacentTerritories = [];
        self.pathData = pathData;
    };

    var camelCase = function (input) {
        //set any letter at the beginning of a word to upper case
        var allCaps = input.replace(/\s[a-z]/g, function() {
            return arguments[0].toUpperCase();
        });
        //remove spaces and apostrophes
        var noSpaces = allCaps.replace(/\s|\'/g, "");
        //lowercase the first letter of the string
        var camel = noSpaces.replace(/^[A-Z]/, function() {
            return arguments[0].toLowerCase();
        });
        return camel;
    };

    var territories = [];

    var init = function() {
        
        stage = new Kinetic.Stage({
            container: 'container',
            width: 1819,
            height: 3168
        });
        
        layer = new Kinetic.Layer();

        $.each(Westeros.Utilities.data, function(i, v) {
            territories.push(new territory(v.pathData, v.name, v.type, v.power, v.supply, v.musterPoints, v.adjacentTerritories));
        });

        Westeros.log(territories);

        $.each(territories, function (i, v) {
            addPath(v);
        });

        stage.setScale(.5);
    };

    var setTerritoryName = function(area, pathData) {
        var name = prompt("Enter territory name");
        var type = prompt("Enter the territory type");
        

        
        if (name && type) {
            var fillColor = type === 'sea' ? 'blue' : type === 'land' ? 'brown' : 'grey';

            territories.push(new territory(pathData, name, type));
            area.setFill(fillColor);
            area.off("click");
            area.off("mouseover");
            area.off("mouseout");
        }
    };

    var setPowerSupply = function(area, id) {
        var power = prompt("Enter power");
        var supply = prompt("Enter supply");
        
        if (power && supply) {
            var thisTerritory = $.grep(territories, function(n, i) {
                return n.key === id;
            });

            thisTerritory[0].power = power;
            thisTerritory[0].supply = supply;

            area.setFill("white");
            area.off("click");
            area.off("mouseover");
            area.off("mouseout");
        }
    };

    var setMusterPoints = function(area, id) {
        var musterPoints = prompt("Enter muster points for " + area.getAttr("id"));

        var thisTerritory = $.grep(territories, function (n, i) {
            return n.key === id;
        });

        thisTerritory[0].musterPoints = musterPoints;
        

        area.setFill("white");
        area.off("click");
        area.off("mouseover");
        area.off("mouseout");
    };

    var setAdditionalTerritories = function(area, id) {
        area.off("click");

        area.setStroke("blue");
        area.setStrokeWidth(5);

        var selectedTerritories = [];

        var areas = layer.getChildren();

        $.each(areas, function (i, v) {
            if (v.getAttr("id") === id) {
                return;
            }

            v.off("click");

            v.on("click", function() {
                selectedTerritories.push(this.getAttr("id"));
                this.setStroke("yellow");
                this.setStrokeWidth(5);
            });
        });

        area.on("click", function() {
            var thisTerritory = $.grep(territories, function (n, i) {
                return n.key === id;
            });
            debugger;
            thisTerritory[0].adjacentTerritories = selectedTerritories;

            area.off("click");

            $.each(areas, function (i, v) {
                if (v.getAttr("id") === id) {
                    return;
                }
                v.setStrokeWidth(0);
                v.setStroke("white");
                v.on("click", function() {
                    setAdditionalTerritories(this, this.getAttr("id"));
                });
            });

            area.setStroke(0);
            area.setStroke("white");
            area.setFill("green");
            area.off("mouseover");
            area.off("mouseout");
        });

    };

    var addPath = function (tdata) {

        var path = new Kinetic.Path({
            data: tdata.pathData,
            id: tdata.key,
            fill: 'black',
            scale: 1
        });

        path.on("mouseover", function() {
            this.setFill('white');
            layer.draw();
        });
        
        path.on("mouseout", function () {
            this.setFill('black');
            layer.draw();
        });

        path.on("click", function () {
            setAdditionalTerritories(this, this.getAttr("id"));
            layer.draw();
           
        });

        layer.add(path);
        stage.add(layer);
    };

    var dumpData = function() {
        Westeros.log(JSON.stringify(territories));
    };

    return {
        "init": init,
        "addPath": addPath,
        "dumpData": dumpData
    };
}());

