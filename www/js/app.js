angular.module("mad_games_studio", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","ionicLazyLoad","mad_games_studio.controllers", "mad_games_studio.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Mad Games Studio" ;
		$rootScope.appLogo = "data/images/header/logo.png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

		$rootScope.liveStatus = "pause" ;
		$ionicPlatform.ready(function(){
			$rootScope.liveStatus = "run" ;
		});
		$ionicPlatform.on("pause",function(){
			$rootScope.liveStatus = "pause" ;
		});
		$ionicPlatform.on("resume",function(){
			$rootScope.liveStatus = "run" ;
		});


		$rootScope.hide_menu_dashboard = false ;
		$rootScope.hide_menu_menu_one = false ;
		$rootScope.hide_menu_menu_two = false ;
		$rootScope.hide_menu_faq = false ;
		$rootScope.hide_menu_teeeeest = false ;


		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "mad_games_studio",
				storeName : "mad_games_studio",
				description : "The offline datastore for Mad Games Studio app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}

			//required: cordova plugin add cordova-plugin-network-information --save
			$interval(function(){
				if ( typeof navigator == "object" && typeof navigator.connection != "undefined"){
					var networkState = navigator.connection.type;
					$rootScope.is_online = true ;
					if (networkState == "none") {
						$rootScope.is_online = false ;
						$window.location = "retry.html";
					}
				}
			}, 5000);

		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("mad_games_studio.dashboard");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("en-us");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("en-us");
})



.config(function($stateProvider,$urlRouterProvider,$sceDelegateProvider,$ionicConfigProvider,$httpProvider){
	/** tabs position **/
	$ionicConfigProvider.tabs.position("bottom"); 
	$ionicConfigProvider.tabs.style("standard");
	try{
	// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?mad\-agency\.xyz/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?crypto\-world\.pp\.ua/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("mad_games_studio",{
		url: "/mad_games_studio",
		abstract: true,
		templateUrl: "templates/mad_games_studio-tabs.html",
	})

	.state("mad_games_studio.about_us", {
		url: "/about_us",
		views: {
			"mad_games_studio-about_us" : {
						templateUrl:"templates/mad_games_studio-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.arcadia", {
		url: "/arcadia",
		views: {
			"mad_games_studio-arcadia" : {
						templateUrl:"templates/mad_games_studio-arcadia.html",
						controller: "arcadiaCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.ava", {
		url: "/ava",
		views: {
			"mad_games_studio-ava" : {
						templateUrl:"templates/mad_games_studio-ava.html",
						controller: "avaCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.cut", {
		url: "/cut",
		cache:false,
		views: {
			"mad_games_studio-cut" : {
						templateUrl:"templates/mad_games_studio-cut.html",
						controller: "cutCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.dashboard", {
		url: "/dashboard",
		cache:false,
		views: {
			"mad_games_studio-dashboard" : {
						templateUrl:"templates/mad_games_studio-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.face", {
		url: "/face",
		cache:false,
		views: {
			"mad_games_studio-face" : {
						templateUrl:"templates/mad_games_studio-face.html",
						controller: "faceCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.faq", {
		url: "/faq",
		cache:false,
		views: {
			"mad_games_studio-faq" : {
						templateUrl:"templates/mad_games_studio-faq.html",
						controller: "faqCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.files", {
		url: "/files",
		cache:false,
		views: {
			"mad_games_studio-files" : {
						templateUrl:"templates/mad_games_studio-files.html",
						controller: "filesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.game_one", {
		url: "/game_one",
		cache:false,
		views: {
			"mad_games_studio-game_one" : {
						templateUrl:"templates/mad_games_studio-game_one.html",
						controller: "game_oneCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.game_store", {
		url: "/game_store",
		views: {
			"mad_games_studio-game_store" : {
						templateUrl:"templates/mad_games_studio-game_store.html",
						controller: "game_storeCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.game_three", {
		url: "/game_three",
		cache:false,
		views: {
			"mad_games_studio-game_three" : {
						templateUrl:"templates/mad_games_studio-game_three.html",
						controller: "game_threeCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.game_two", {
		url: "/game_two",
		cache:false,
		views: {
			"mad_games_studio-game_two" : {
						templateUrl:"templates/mad_games_studio-game_two.html",
						controller: "game_twoCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.games", {
		url: "/games",
		cache:false,
		views: {
			"mad_games_studio-games" : {
						templateUrl:"templates/mad_games_studio-games.html",
						controller: "gamesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.gamix", {
		url: "/gamix",
		cache:false,
		views: {
			"mad_games_studio-gamix" : {
						templateUrl:"templates/mad_games_studio-gamix.html",
						controller: "gamixCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.hwoweare", {
		url: "/hwoweare",
		views: {
			"mad_games_studio-hwoweare" : {
						templateUrl:"templates/mad_games_studio-hwoweare.html",
						controller: "hwoweareCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.inst", {
		url: "/inst",
		cache:false,
		views: {
			"mad_games_studio-inst" : {
						templateUrl:"templates/mad_games_studio-inst.html",
						controller: "instCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.m", {
		url: "/m",
		views: {
			"mad_games_studio-m" : {
						templateUrl:"templates/mad_games_studio-m.html",
						controller: "mCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.manag", {
		url: "/manag",
		cache:false,
		views: {
			"mad_games_studio-manag" : {
						templateUrl:"templates/mad_games_studio-manag.html",
						controller: "managCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.market", {
		url: "/market",
		cache:false,
		views: {
			"mad_games_studio-market" : {
						templateUrl:"templates/mad_games_studio-market.html",
						controller: "marketCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.menu_one", {
		url: "/menu_one",
		cache:false,
		views: {
			"mad_games_studio-menu_one" : {
						templateUrl:"templates/mad_games_studio-menu_one.html",
						controller: "menu_oneCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.menu_two", {
		url: "/menu_two",
		views: {
			"mad_games_studio-menu_two" : {
						templateUrl:"templates/mad_games_studio-menu_two.html",
						controller: "menu_twoCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.quiz", {
		url: "/quiz",
		views: {
			"mad_games_studio-quiz" : {
						templateUrl:"templates/mad_games_studio-quiz.html",
						controller: "quizCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.short", {
		url: "/short",
		cache:false,
		views: {
			"mad_games_studio-short" : {
						templateUrl:"templates/mad_games_studio-short.html",
						controller: "shortCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.slide_tab_menu", {
		url: "/slide_tab_menu",
		views: {
			"mad_games_studio-slide_tab_menu" : {
						templateUrl:"templates/mad_games_studio-slide_tab_menu.html",
						controller: "slide_tab_menuCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.teeeeest", {
		url: "/teeeeest",
		cache:false,
		views: {
			"mad_games_studio-teeeeest" : {
						templateUrl:"templates/mad_games_studio-teeeeest.html",
						controller: "teeeeestCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.teeeeest_singles", {
		url: "/teeeeest_singles/:id",
		cache:false,
		views: {
			"mad_games_studio-teeeeest" : {
						templateUrl:"templates/mad_games_studio-teeeeest_singles.html",
						controller: "teeeeest_singlesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.trade", {
		url: "/trade",
		cache:false,
		views: {
			"mad_games_studio-trade" : {
						templateUrl:"templates/mad_games_studio-trade.html",
						controller: "tradeCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_games_studio.traff", {
		url: "/traff",
		cache:false,
		views: {
			"mad_games_studio-traff" : {
						templateUrl:"templates/mad_games_studio-traff.html",
						controller: "traffCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/mad_games_studio/dashboard");
});
