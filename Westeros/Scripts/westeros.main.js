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
    var mapLayer;
    var attrLayer;
    var crownEle;
    var barrelEle;

    var territory = function(pathData, name, type, key, power, supply, musterPoints, uiData, adjacentTerritories) {
        var self = this;
        self.name = name;
        self.type = type;
        self.key = key;
        self.power = power || 0;
        self.supply = supply || 0;
        self.musterPoints = musterPoints || 0;
        self.adjacentTerritories = adjacentTerritories || [];
        self.uiData = uiData;
        self.pathData = pathData;
    };

    

    var territories = [];

    var init = function() {
        
        stage = new Kinetic.Stage({
            container: 'container',
            width: 920,
            height: 1584
        });
        
        mapLayer = new Kinetic.Layer();
        attrLayer = new Kinetic.Layer();

        $.each(Westeros.Territories.data, function(i, v) {
            territories.push(new territory(v.pathData, v.name, v.type, v.key, v.power, v.supply, v.musterPoints, v.uiData, v.adjacentTerritories));
        });

        Westeros.log(territories);

        $.each(territories, function (i, v) {
            addPath(v);
        });

        initUiElements();

        stage.add(mapLayer);
        stage.add(attrLayer);

        stage.setScale(.5);
        stage.draw();
    };

    var addPath = function (tdata) {

        var fill = tdata.power > 0 || tdata.supply > 0 ? "black" : "grey";

        var path = new Kinetic.Path({
            data: tdata.pathData,
            id: tdata.key,
            fill: fill,
            scale: 1
        });

        path.on("mouseover", function() {
            this.setFill('white');
            displayData(this);
            mapLayer.draw();
        });
        
        path.on("mouseout", function () {
            this.setFill(fill);
            mapLayer.draw();
        });


        if (tdata.power > 0 || tdata.supply > 0) {
            path.on("click.setupUi", function () {
                setupUiElements(this);
                attrLayer.draw();
            });
        }
        

        mapLayer.add(path);
    };

    var setupUiElements = function (area) {
        crownEle.setDraggable("true");
        barrelEle.setDraggable("true");

        var thisTerritory = getTerritory(area.getAttr("id"));

        for (var i = 0; i < thisTerritory.power; i++) {
            attrLayer.add(crownEle.clone({
                     name: thisTerritory.key + "-crown"
                }));

        }
        for (var j = 0; j < thisTerritory.supply; j++) {
            attrLayer.add(barrelEle.clone({
                name: thisTerritory.key + "-barrel"
            }));
        }

        var crowns = thisTerritory.power > 0 ? attrLayer.find('.' + thisTerritory.key +'-crown') : [];
        var barrels = thisTerritory.supply > 0 ? attrLayer.find('.' + thisTerritory.key + '-barrel') : [];

        for (var q = 0; q < crowns.length; q++) {
            crowns[q].setY($(window).scrollTop() * 2);
        }

        for (var r = 0; r < barrels.length; r++) {
            barrels[r].setY($(window).scrollTop() * 2);
        }

        if (thisTerritory.uiData.crownPos) {
            for (var k = 0; k < thisTerritory.uiData.crownPos.length; k++) {
                crowns[k].setX(thisTerritory.uiData.crownPos[k].x);
                crowns[k].setY(thisTerritory.uiData.crownPos[k].y);
            }
        }

        if (thisTerritory.uiData.barrelPos) {
            for (var l = 0; l < thisTerritory.uiData.barrelPos.length; l++) {
                barrels[l].setX(thisTerritory.uiData.barrelPos[l].x);
                barrels[l].setY(thisTerritory.uiData.barrelPos[l].y);
            }
            
        }

        area.setFill("#b5fcc6");

        area.off("click.setupUi");
        area.off("mouseout");
        area.off("mouseover");
        area.on("click.saveUiData", function(e) {
            if (e.ctrlKey) {
                this.setFill("black");
                mapLayer.draw();
                stage.draw();

                thisTerritory.uiData = {
                    "crownPos" : [],
                    "barrelPos": []
                };

                for (var m = 0; m < crowns.length; m++) {
                    thisTerritory.uiData.crownPos.push({
                        "x": crowns[m].getAttr("x"),
                        "y": crowns[m].getAttr("y")
                    });
                }

                for (var n = 0; n < barrels.length; n++) {
                    thisTerritory.uiData.barrelPos.push({
                        "x": barrels[n].getAttr("x"),
                        "y": barrels[n].getAttr("y")
                    });
                }

                attrLayer.draw();

                this.off("click.saveUiData");
            }
        });

        attrLayer.draw();
        mapLayer.draw();
    };


    var initUiElements = function() {
        var crownImg = new Image();
        crownImg.onload = function () {
            crownEle = new Kinetic.Image({
                image: crownImg,
                name: "crown",
                width: 50,
                height: 31,
                x: 0,
                y: 0,
            });
        };

        var barrelImg = new Image();
        barrelImg.onload = function() {
            barrelEle = new Kinetic.Image({
                image: barrelImg,
                name: "barrel",
                width: 50,
                height: 59,
                x: 0,
                y: 0,
            });
        };

        crownImg.src = '../Content/crown.png';
        barrelImg.src = '../Content/barrel.png';
    };

    var displayData = function(area) {
        var id = area.getAttr("id");
        var thisTerritory = getTerritory(id);

        $('#territory').text(thisTerritory.name);
        $('#musterPoints').text(thisTerritory.musterPoints);
        $('#supply').text(thisTerritory.supply);
        $('#power').text(thisTerritory.power);

        $('#adjTerritories').find('li').remove();

        $.each(thisTerritory.adjacentTerritories, function (i, v) {

            var adjTer = getTerritory(v);

            var name = adjTer.type === "port" ? adjTer.name + " Port" : adjTer.name;

            $('#adjTerritories').append('<li>' + name + '</li>');
        });

        $('#pos').text("x: " + area.getPosition().x + " y: " + area.getPosition().y);
        $('#width').text(area.getAttr("width"));
        $('#height').text(area.getAttr("height"));

    };

   

    var getTerritory = function(key) {
        var thisTerritory = $.grep(territories, function (n, i) {
            return n.key == key;
        });

        return thisTerritory[0];
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

