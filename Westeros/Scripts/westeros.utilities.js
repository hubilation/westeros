Westeros.Utilities = (function () {
   
    var setTerritoryName = function (area, pathData) {
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

    var setPowerSupply = function (area, id) {
        var power = prompt("Enter power");
        var supply = prompt("Enter supply");

        if (power && supply) {
            var thisTerritory = $.grep(territories, function (n, i) {
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

    var setMusterPoints = function (area, id) {
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

    var setAdditionalTerritories = function (area, id) {
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

            v.on("click", function () {
                selectedTerritories.push(this.getAttr("id"));
                this.setStroke("yellow");
                this.setStrokeWidth(5);
            });
        });

        area.on("click", function () {
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
                v.on("click", function () {
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

    var camelCase = function (input) {
        //set any letter at the beginning of a word to upper case
        var allCaps = input.replace(/\s[a-z]/g, function () {
            return arguments[0].toUpperCase();
        });
        //remove spaces and apostrophes
        var noSpaces = allCaps.replace(/\s|\'/g, "");
        //lowercase the first letter of the string
        var camel = noSpaces.replace(/^[A-Z]/, function () {
            return arguments[0].toLowerCase();
        });
        return camel;
    };

    ///reference here: http://dreaminginjavascript.wordpress.com/2008/08/22/eliminating-duplicates/
    var eliminateDuplicates = function (arr) {
        var i,
            len = arr.length,
            out = [],
            obj = {};

        for (i = 0; i < len; i++) {
            obj[arr[i]] = 0;
        }
        for (i in obj) {
            out.push(i);
        }
        return out;
    };

    return {
        "eliminateDuplicates": eliminateDuplicates,
        "camelCase": camelCase
    };

}());