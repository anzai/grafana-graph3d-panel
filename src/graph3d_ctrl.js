import {MetricsPanelCtrl} from 'app/plugins/sdk';
import _ from 'lodash';
//import kbn from 'app/core/utils/kbn';
import TimeSeries from 'app/core/time_series';
import rendering from './rendering';

export class Graph3dCtrl extends MetricsPanelCtrl {

  constructor($scope, $injector, $rootScope) {
    super($scope, $injector);
    this.$rootScope = $rootScope;

    if (! this.panel.cameraPosition) {
      this.resetCameraPosition();
    }

    this.events.on('render', this.onRender.bind(this));
    this.events.on('data-received', this.onDataReceived.bind(this));
    this.events.on('data-error', this.onDataError.bind(this));
    this.events.on('data-snapshot-load', this.onDataReceived.bind(this));
    this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
  }

  onInitEditMode() {
    this.addEditorTab('Options', 'public/plugins/grafana-graph3d-panel/editor.html', 2);
  }

  onDataError() {
    this.series = [];
    this.render();
  }

  onRender() {
    this.data = this.parseSeries(this.series);
  }

  parseSeries(series) {
    return _.map(this.series, (serie, i) => {
      return {
        label: serie.alias,
        datapoints: serie.datapoints
      };
    });
  }

  onDataReceived(dataList) {
    this.series = dataList.map(this.seriesHandler.bind(this));
    this.data = this.parseSeries(this.series);
    this.render(this.data);
  }

  seriesHandler(seriesData) {
    var series = new TimeSeries({
      datapoints: seriesData.datapoints,
      alias: seriesData.target
    });

    return series;
  }

  resetCameraPosition() {
    // See http://visjs.org/docs/graph3d/#Methods
    this.panel.cameraPosition = {
      horizontal: 1.0,
      vertical:   0.5,
      distance:   1.7
    };
    this.render(this.data);
  }

  loadCameraPosition() {
    this.panel.cameraPosition = this.currentCameraPosition;
  }

  formatValue(value) {
    return value;
  }

  link(scope, elem, attrs, ctrl) {
    this.graph3d = rendering(scope, elem, attrs, ctrl);
  }
}

Graph3dCtrl.templateUrl = 'module.html';
