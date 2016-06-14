'use strict';

System.register(['lodash', 'jquery', './vis'], function (_export, _context) {
  "use strict";

  var _, $, vis;

  function link(scope, elem, attrs, ctrl) {
    var data, panel, position;
    elem = elem.find('.graph3d-panel');

    ctrl.events.on('render', function () {
      render();
      ctrl.renderingCompleted();
    });

    function setElementHeight() {
      try {
        var height = ctrl.height || panel.height || ctrl.row.height;
        if (_.isString(height)) {
          height = parseInt(height.replace('px', ''), 10);
        }

        height -= 5; // padding
        height -= panel.title ? 24 : 9; // subtract panel title bar

        elem.css('height', height + 'px');

        return true;
      } catch (e) {
        // IE throws errors sometimes
        return false;
      }
    }

    function render() {
      if (!ctrl.data) {
        return;
      }

      data = ctrl.data;
      panel = ctrl.panel;

      if (setElementHeight()) {
        addGraph3d();
      }
    }

    function getKey(arr, val) {
      return parseInt(_.keys(arr).find(function (key) {
        return arr[key] == val;
      }));
    }

    function onCameraPositionChange(event) {
      ctrl.currentCameraPosition = {
        horizontal: event.horizontal,
        vertical: event.vertical,
        distance: event.distance
      };
    }

    function addGraph3d() {
      if (data.length === 0) {
        return;
      }

      var labels = _.pluck(data, 'label');

      var datapoints = [];
      datapoints.push(_.map(data[0].datapoints, function (dp) {
        return dp[1];
      }));
      datapoints = datapoints.concat(_.map(data, function (serie) {
        return _.map(serie.datapoints, function (dp) {
          return dp[0];
        });
      }));

      var valueLabels = _.map(datapoints, function (dp, i) {
        if (i < 2) {
          return _.uniq(dp);
        }
      });

      // dataset
      var graphdata = new vis.DataSet();
      for (var i = 0; i < datapoints[0].length; i += 1) {
        graphdata.add({
          x: getKey(valueLabels[0], datapoints[0][i]),
          y: getKey(valueLabels[1], datapoints[1][i]),
          z: datapoints[2][i],
          style: datapoints[2][i]
        });
      }

      // prepare div for canvas
      var plotDiv = document.createElement('div');

      // css
      var width = elem.width();
      var height = elem.height();
      var size = Math.min(width, height) - 20;
      $(plotDiv).css({
        width: size + 'px',
        height: size + 'px',
        margin: 'auto',
        position: 'relative'
      });

      // options
      var options = {
        width: size + 'px',
        height: size + 'px',
        axisColor: '#888888',

        style: panel.style,
        showPerspective: true,
        showGrid: true,
        showShadow: false,
        verticalRatio: 0.5,

        xLabel: panel.xLabel || 'time',
        yLabel: panel.yLabel || labels[0],
        zLabel: panel.zLabel || labels[1],

        xMin: panel.xMin || null,
        yMin: panel.yMin || null,
        zMin: panel.zMin || null,

        xMax: panel.xMax || null,
        yMax: panel.yMax || null,
        zMax: panel.zMax || null,

        xStep: panel.xStep || null,
        yStep: panel.yStep || null,
        zStep: panel.zStep || null,

        xValueLabel: function xValueLabel(key) {
          return valueLabels[0][key];
        },
        yValueLabel: function yValueLabel(key) {
          return valueLabels[1][key];
        },

        tooltip: function tooltip(point) {
          return (panel.xLabel || 'time') + ': ' + valueLabels[0][point.x] + '<br>' + (panel.yLabel || labels[0]) + ': ' + valueLabels[1][point.y] + '<br>' + (panel.zLabel || labels[1]) + ': <b>' + point.z + '</b>';
        }
      };

      for (var key in options) {
        if (options[key] === null) {
          delete options[key];
        }
      }
      console.log(options);

      // draw
      var graph3d = new vis.Graph3d(plotDiv, graphdata, options);
      graph3d.on('cameraPositionChange', onCameraPositionChange);
      graph3d.setCameraPosition(panel.cameraPosition);

      elem.html(plotDiv);
      graph3d.redraw();
    }
  }

  _export('default', link);

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_jquery) {
      $ = _jquery.default;
    }, function (_vis) {
      vis = _vis.default;
    }],
    execute: function () {}
  };
});
//# sourceMappingURL=rendering.js.map
