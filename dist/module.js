'use strict';

System.register(['lodash', './graph3d_ctrl'], function (_export, _context) {
  "use strict";

  var _, Graph3dCtrl;

  return {
    setters: [function (_lodash) {
      _ = _lodash.default;
    }, function (_graph3d_ctrl) {
      Graph3dCtrl = _graph3d_ctrl.Graph3dCtrl;
    }],
    execute: function () {
      _export('PanelCtrl', Graph3dCtrl);
    }
  };
});
//# sourceMappingURL=module.js.map
