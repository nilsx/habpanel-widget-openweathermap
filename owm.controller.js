(function () {
	'use strict';
	angular
		.module('app.widgets.owm', [])
		.controller('ngOwmCtrl', ['$rootScope', '$scope', 'OHService',
			function ($rootScope, $scope, OHService) {
				// Fill the three forecast days with data
				function loadOwmForecast() {
					console.log("Processing OWM widget forecast");
					try {
						var today = new Date();
						var nextDay = new Date();

						for (var day = 0; day < 4; day++) {
							nextDay.setDate(today.getDate() + day);
							nextDay.setHours(12);
							var diffHours = Math.ceil(Math.abs(today.getTime() - nextDay.getTime()) / (1000 * 3600));
							setForecastItems(day, getClosest(diffHours));
						}

					} catch (err) {
						console.log("Error during OWM widget: " + err)
					}
				}

				// Set forecast values for particular day
				function setForecastItems(day, hour) {
					$scope["temp" + day] = $scope.itemState('Weather_OWM_Temp_h' + hour);
					$scope["condition" + day] = $scope.itemState('Weather_OWM_Condition_h' + hour);
					$scope["condition_id" + day] = $scope.itemState('Weather_OWM_ConditionId_h' + hour);
					$scope["date_time" + day] = $scope.itemState('Weather_OWM_DateTime_h' + hour);
				}

				// Find closest to value in array
				function getClosest(goal) {
					var hours = Array.from(Array(24).keys(), (h) => (h + 1) * 3);	// Generate array with stepsize 3 until 92
					var closest = hours.reduce(function (prev, curr) {
						return (Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev);
					});

					return closest
				}

				// Run function when an items updates
				$rootScope.$on('openhab-update', function (event, item) {
					loadOwmForecast();
				});

				loadOwmForecast();
			}
		]);
})();
