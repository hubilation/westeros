﻿window.Westeros = function () {

    function _logBase(msg) {
        try { if (window.console && console.log) console.log(msg); }
        catch (err) { } //ignore logging  
    }

    function _log(msg) {
        _logBase(msg);
    }

    return {
        log: function (msg) {
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
    var strongholdEle;
    var castleEle;
    var unitBoundary;

    var territory = function (pathData, name, type, key, power, supply, musterPoints, uiData, adjacentTerritories) {
        var self = this;
        self.name = name;
        self.type = type;
        self.key = key;
        self.power = power || 0;
        self.supply = supply || 0;
        self.musterPoints = musterPoints || 0;
        self.adjacentTerritories = adjacentTerritories || [];
        self.uiData = uiData || {};
        self.pathData = pathData;
    };



    var territories = [];

    var init = function () {

        stage = new Kinetic.Stage({
            container: 'container',
            width: 920,
            height: 1584
        });

        mapLayer = new Kinetic.Layer();
        attrLayer = new Kinetic.Layer();

        $.each(Westeros.Territories.data, function (i, v) {
            territories.push(new territory(v.pathData, v.name, v.type, v.key, v.power, v.supply, v.musterPoints, v.uiData, v.adjacentTerritories));
        });

        Westeros.log(territories);

        $.each(territories, function (i, v) {
            addPath(v);
        });

        initUiElements();
        placeUiElements();

        stage.add(mapLayer);
        stage.add(attrLayer);

        stage.setScale(.5);
        stage.draw();
    };

    var addPath = function (tdata) {

        var fill = tdata.musterPoints > 0 ? "black" : "black";

        var path = new Kinetic.Path({
            data: tdata.pathData,
            id: tdata.key,
            fill: fill,
            scale: 1
        });

        path.on("mouseover", function () {
            this.setFill('white');
            displayData(this);
            mapLayer.draw();
        });

        path.on("mouseout", function () {
            this.setFill(fill);
            mapLayer.draw();
        });



        path.on("click.setupUi", function (e) {
            setupUiElements(e, this);
        });





        mapLayer.add(path);
    };

    var placeUiElements = function (area) {
        $.each(territories, function (i, v) {
            if (v.musterPoints == 1) {
                attrLayer.add(castleEle.clone({
                    name: v.key + "-muster"
                }));
            }
            if (v.musterPoints == 2) {
                attrLayer.add(strongholdEle.clone({
                    name: v.key + "-muster"
                }));
            }

            attrLayer.add(unitBoundary.clone({
                name: v.key + "-boundary",
                x: v.uiData.unitBoundary.x,
                y: v.uiData.unitBoundary.y
            }));

            var castle = v.musterPoints > 0 ? attrLayer.find('.' + v.key + '-muster') : "";

            if (castle) {
                castle[0].setX(v.uiData.musterPos.x);
                castle[0].setY(v.uiData.musterPos.y);
            }
        });

        attrLayer.draw();
    };

    var placeCrowns = function () {
        $.each(territories, function (i, v) {
            for (var j = 0; j < v.power; j++) {
                attrLayer.add(crownEle.clone({
                    name: v.key + "-crown"
                }));
            }

            var crowns = v.power > 0 ? attrLayer.find('.' + v.key + '-crown') : [];

            if (crowns.length > 0) {
                for (var k = 0; k < v.uiData.crownPos.length; k++) {
                    crowns[k].setX(v.uiData.crownPos[k].x);
                    crowns[k].setY(v.uiData.crownPos[k].y);
                }
            }
        });

        attrLayer.draw();
    };

    var placeBarrels = function () {
        $.each(territories, function (i, v) {
            for (var j = 0; j < v.supply; j++) {
                attrLayer.add(barrelEle.clone({
                    name: v.key + "-barrel"
                }));
            }

            var barrels = v.supply > 0 ? attrLayer.find('.' + v.key + '-barrel') : [];

            if (barrels.length > 0) {
                for (var k = 0; k < v.uiData.barrelPos.length; k++) {
                    barrels[k].setX(v.uiData.barrelPos[k].x);
                    barrels[k].setY(v.uiData.barrelPos[k].y);
                }
            }

        });

        attrLayer.draw();
    };

    var setupUiElements = function (event, area) {
        debugger;
        unitBoundary.setDraggable("true");

        var thisTerritory = getTerritory(area.getAttr("id"));

        attrLayer.add(unitBoundary.clone({
            name: thisTerritory.key + "-boundary"
        }));


        var thisBoundary = attrLayer.find('.' + thisTerritory.key + '-boundary')[0];

        thisBoundary.setY(event.layerY * 2 - 50);
        thisBoundary.setX(event.layerX * 2 - 75);


        if (thisTerritory.uiData.unitBoundary) {
            thisBoundary.setY(thisTerritory.uiData.unitBoundary.y);
            thisBoundary.setX(thisTerritory.uiData.unitBoundary.x);
        }

        area.setFill("#b5fcc6");

        area.off("click.setupUi");
        area.off("mouseout");
        area.off("mouseover");
        area.on("click.saveUiData", function (e) {
            if (e.ctrlKey) {
                this.setFill("black");
                mapLayer.draw();
                stage.draw();

                thisTerritory.uiData.unitBoundary = {};

                thisTerritory.uiData.unitBoundary = {
                    "x": thisBoundary.getAttr("x"),
                    "y": thisBoundary.getAttr("y")
                };

                thisBoundary.setDraggable("false");


                attrLayer.draw();

                this.off("click.saveUiData");
            }
        });

        attrLayer.draw();
        mapLayer.draw();
    };


    var initUiElements = function () {

        var barrelImg = new Image();
        barrelImg.onload = function () {
            barrelEle = new Kinetic.Image({
                image: barrelImg,
                name: "barrel",
                width: 50,
                height: 59,
                x: 0,
                y: 0,
            });

            placeBarrels();
        };

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

            placeCrowns();
        };



        castleEle = new Kinetic.Rect({
            width: 50,
            height: 50,
            x: 0,
            y: 0,
            stroke: 'red',
            strokeWidth: 2
        });

        strongholdEle = new Kinetic.Rect({
            width: 50,
            height: 50,
            x: 0,
            y: 0,
            stroke: 'blue',
            strokeWidth: 2
        });

        unitBoundary = new Kinetic.Rect({
            width: 100,
            height: 100,
            x: 0,
            y: 0,
            stroke: 'green',
            strokeWidth: 2
        });

        crownImg.src = '../Content/crown.png';
        barrelImg.src = '../Content/barrel.png';
    };

    var displayData = function (area) {
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



    var getTerritory = function (key) {
        var thisTerritory = $.grep(territories, function (n, i) {
            return n.key == key;
        });

        return thisTerritory[0];
    };

    var dumpData = function () {
        Westeros.log(JSON.stringify(territories));
    };

    return {
        "init": init,
        "addPath": addPath,
        "dumpData": dumpData
    };
}());

