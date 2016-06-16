'use strict';

System.register(['lodash', 'jquery', 'moment', 'app/core/utils/kbn', './vis'], function (_export, _context) {
  "use strict";

  var _, $, moment, kbn, vis;

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

    function createColumnFormater(style) {
      var defaultFormater = function defaultFormater(v) {
        if (v === null || v === void 0 || v === undefined) {
          return '';
        }
        if (_.isArray(v)) {
          v = v.join(', ');
        }
        return v;
      };

      if (!style) {
        return defaultFormater;
      }

      switch (style.type) {
        case 'date':
          return function (v) {
            if (_.isArray(v)) {
              v = v[0];
            }
            var date = moment(v);
            if (ctrl.dashboard.isTimezoneUtc()) {
              date = date.utc();
            }
            return date.format(style.dateFormat || 'YYYY-MM-DD HH:mm:ss');
          };
          break;

        case 'number':
          var valueFormater = kbn.valueFormats[style.unit];

          return function (v) {
            if (v === null || v === void 0) {
              return '-';
            }

            if (_.isString(v)) {
              return v;
            }

            return valueFormater(v, style.decimals, null);
          };
          break;

        default:
          return defaultFormater;
      }
    }

    function addGraph3d() {
      if (data.length === 0) {
        return;
      }

      var formater = {
        x: createColumnFormater(panel.styles.x),
        y: createColumnFormater(panel.styles.y),
        z: createColumnFormater(panel.styles.z)
      };

      var labels = _.pluck(data, 'label');

      var datapoints = [];
      datapoints.push(_.map(data[0].datapoints, function (dp) {
        return formater.x(dp[1]);
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
      $(plotDiv).css({
        width: width + 'px',
        height: height + 'px',
        margin: 'auto',
        position: 'relative'
      });

      var axisLabels = {
        x: panel.styles.x.label || 'time',
        y: panel.styles.y.label || labels[0],
        z: panel.styles.z.label || labels[1]
      };
      var units = {
        x: kbn.valueFormats[panel.styles.x.unit] || panel.styles.x.unit || '',
        y: kbn.valueFormats[panel.styles.y.unit] || panel.styles.y.unit || '',
        z: kbn.valueFormats[panel.styles.z.unit] || panel.styles.z.unit || ''
      };

      var options = {
        width: width + 'px',
        height: height + 'px',
        axisColor: '#888888',

        style: panel.graphType,
        showGrid: true,
        showShadow: false,
        showPerspective: panel.showPerspective || false,
        verticalRatio: panel.verticalRatio || 0.5,
        keepAspectRatio: panel.keepAspectRatio || false,

        xLabel: axisLabels.x,
        yLabel: axisLabels.y,
        zLabel: axisLabels.z,

        xMin: panel.styles.x.min || null,
        yMin: panel.styles.y.min || null,
        zMin: panel.styles.z.min || null,

        xMax: panel.styles.x.max || null,
        yMax: panel.styles.y.max || null,
        zMax: panel.styles.z.max || null,

        xStep: panel.styles.x.step || null,
        yStep: panel.styles.y.step || null,
        zStep: panel.styles.z.step || null,

        xValueLabel: function xValueLabel(key) {
          return formater.x(valueLabels[0][key]);
        },
        yValueLabel: function yValueLabel(key) {
          return formater.y(valueLabels[1][key]);
        },
        zValueLabel: function zValueLabel(key) {
          return formater.z(key);
        },

        tooltip: function tooltip(point) {
          return axisLabels.x + ': ' + formater.x(valueLabels[0][point.x]) + '<br>' + axisLabels.y + ': ' + formater.y(valueLabels[1][point.y]) + '<br>' + axisLabels.z + ': ' + '<b>' + formater.z(point.z) + '</b>';
        }
      };

      for (var key in options) {
        if (options[key] === null) {
          delete options[key];
        }
      }

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
    }, function (_moment) {
      moment = _moment.default;
    }, function (_appCoreUtilsKbn) {
      kbn = _appCoreUtilsKbn.default;
    }, function (_vis) {
      vis = _vis.default;
    }],
    execute: function () {}
  };
});
//# sourceMappingURL=rendering.js.map
