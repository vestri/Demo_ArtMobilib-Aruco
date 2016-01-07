angular.module('starter', ['ionic'])

angular.module('starter').directive('start', function () {
  return {
    restrict: 'E',
    link: function (scope, element, attr) {

      var isWebView = ionic.Platform.isWebView();

      if (isWebView) {
        ionic.Platform.ready(function(){

          var am = new ArucoThree(true);

          am.run();
        });
      }
      else {

        var am = new ArucoThree(false);

        am.run();

      }
    }
  };
})