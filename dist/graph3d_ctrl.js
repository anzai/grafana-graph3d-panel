'use strict';

System.register(['app/plugins/sdk', 'lodash', 'app/core/time_series', './rendering'], function (_export, _context) {
  "use strict";

  var MetricsPanelCtrl, _, TimeSeries, rendering, _createClass, Graph3dCtrl;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _possibleConstructorReturn(self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  }

  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  }

  return {
    setters: [function (_appPluginsSdk) {
      MetricsPanelCtrl = _appPluginsSdk.MetricsPanelCtrl;
    }, function (_lodash) {
      _ = _lodash.default;
    }, function (_appCoreTime_series) {
      TimeSeries = _appCoreTime_series.default;
    }, function (_rendering) {
      rendering = _rendering.default;
    }],
    execute: function () {
      _createClass = function () {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }

        return function (Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      }();

      _export('Graph3dCtrl', Graph3dCtrl = function (_MetricsPanelCtrl) {
        _inherits(Graph3dCtrl, _MetricsPanelCtrl);

        function Graph3dCtrl($scope, $injector, $rootScope) {
          _classCallCheck(this, Graph3dCtrl);

          var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Graph3dCtrl).call(this, $scope, $injector));

          _this.$rootScope = $rootScope;

          if (!_this.panel.cameraPosition) {
            _this.resetCameraPosition();
          }

          _this.events.on('render', _this.onRender.bind(_this));
          _this.events.on('data-received', _this.onDataReceived.bind(_this));
          _this.events.on('data-error', _this.onDataError.bind(_this));
          _this.events.on('data-snapshot-load', _this.onDataReceived.bind(_this));
          _this.events.on('init-edit-mode', _this.onInitEditMode.bind(_this));
          return _this;
        }

        _createClass(Graph3dCtrl, [{
          key: 'onInitEditMode',
          value: function onInitEditMode() {
            this.addEditorTab('Options', 'public/plugins/grafana-graph3d-panel/editor.html', 2);
          }
        }, {
          key: 'onDataError',
          value: function onDataError() {
            this.series = [];
            this.render();
          }
        }, {
          key: 'onRender',
          value: function onRender() {
            this.data = this.parseSeries(this.series);
          }
        }, {
          key: 'parseSeries',
          value: function parseSeries(series) {
            return _.map(this.series, function (serie, i) {
              return {
                label: serie.alias,
                datapoints: serie.datapoints
              };
            });
          }
        }, {
          key: 'onDataReceived',
          value: function onDataReceived(dataList) {
            this.series = dataList.map(this.seriesHandler.bind(this));
            this.data = this.parseSeries(this.series);
            this.render(this.data);
          }
        }, {
          key: 'seriesHandler',
          value: function seriesHandler(seriesData) {
            var series = new TimeSeries({
              datapoints: seriesData.datapoints,
              alias: seriesData.target
            });

            return series;
          }
        }, {
          key: 'resetCameraPosition',
          value: function resetCameraPosition() {
            // See http://visjs.org/docs/graph3d/#Methods
            this.panel.cameraPosition = {
              horizontal: 1.0,
              vertical: 0.5,
              distance: 1.7
            };
            this.render(this.data);
          }
        }, {
          key: 'loadCameraPosition',
          value: function loadCameraPosition() {
            this.panel.cameraPosition = this.currentCameraPosition;
          }
        }, {
          key: 'formatValue',
          value: function formatValue(value) {
            return value;
          }
        }, {
          key: 'link',
          value: function link(scope, elem, attrs, ctrl) {
            this.graph3d = rendering(scope, elem, attrs, ctrl);
          }
        }]);

        return Graph3dCtrl;
      }(MetricsPanelCtrl));

      _export('Graph3dCtrl', Graph3dCtrl);

      Graph3dCtrl.templateUrl = 'module.html';
    }
  };
});
//# sourceMappingURL=graph3d_ctrl.js.map
