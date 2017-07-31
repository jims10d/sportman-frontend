angular.module('starter', ['ionic', 'ionic-material', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
	$ionicPlatform.ready(function() {
		if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
			cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
			cordova.plugins.Keyboard.disableScroll(true);

		}
		if (window.StatusBar) {
			StatusBar.styleLightContent();
		}
	});
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider,$compileProvider, $sceDelegateProvider) {
	$compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):|data:image\//);
	$sceDelegateProvider.resourceUrlWhitelist([
		// Allow same origin resource loads.
		'self',
		// Allow loading from our assets domain.  Notice the difference between * and **.
		'https://www.dropbox.com/**'
	]);
// Enable Native Scrolling on Android
$ionicConfigProvider.platform.android.scrolling.jsScrolling(false);
$stateProvider
.state('login', {
	url: '/login',
	templateUrl: 'templates/login.html',
	controller: 'LoginCtrl'
})
.state('register', {
	url: '/register',
	templateUrl: 'templates/register.html',
	controller: 'RegisterCtrl'
})
// setup an abstract state for the side menu directive
.state('app', {
	url: '/app',
	abstract: true,
	templateUrl: 'templates/tabs.html',
	controller: 'MainCtrl'
})
// Each tab has its own nav history stack:
.state('app.home', {
	url: '/home',
	views: {
		'home': {
			templateUrl: 'templates/home.html',
			controller: 'HomeCtrl'
		}
	}
})
.state('app.competition', {
	url: '/competition',
	views: {
		'home': {
			templateUrl: 'templates/competition.html',
			controller: 'CompetitionCtrl'
		}
	}
})
.state('app.competition_detail', {
	url: '/competition_detail/:competitionId',
	views: {
		'home': {
			templateUrl: 'templates/competition_detail.html',
			controller: 'CompetitionDetailCtrl'
		}
	}
})
.state('app.create_competition', {
	url: '/create_competition',
	views: {
		'home': {
			templateUrl: 'templates/create_competition.html',
			controller: 'CompetitionCtrl'
		}
	}
})
.state('app.create_team', {
	url: '/create_team',
	views: {
		'home': {
			templateUrl: 'templates/create_team.html',
			controller: 'TeamCtrl'
		}
	}
})
.state('app.register_team', {
	url: '/register_team/:competitionId',
	views: {
		'home': {
			templateUrl: 'templates/register_team.html',
			controller: 'RegisterTeamCtrl'
		}
	}
})
.state('app.my_team', {
	url: '/my_team',
	views: {
		'home': {
			templateUrl: 'templates/my_team.html',
			controller: 'MyTeamCtrl'
		}
	}
})
.state('app.team_detail', {
	url: '/team_detail/:teamId',
	views: {
		'home': {
			templateUrl: 'templates/team_detail.html',
			controller: 'TeamDetailCtrl'
		}
	}
})
.state('app.member_profile', {
	url: '/member_profile/:userId',
	views: {
		'home': {
			templateUrl: 'templates/member_profile.html',
			controller: 'MemberProfileCtrl'
		}
	}
})
.state('app.chat', {
  url: '/chat',
  views: {
    'home': {
      templateUrl: 'templates/chat.html',
      controller: 'ChatCtrl'
    }
  }
})
.state('app.chat_detail', {
	url: '/chat_detail/:username',
	views: {
		'home': {
			templateUrl: 'templates/chat_detail.html',
			controller: 'ChatDetailCtrl'
		}
	}
})
.state('app.match_detail', {
	url: '/match_detail/:matchId',
	views: {
		'home': {
			templateUrl: 'templates/match_detail.html',
			controller: 'MatchDetailCtrl'
		}
	}
})
.state('app.live_score', {
	url: '/live_score/:matchId',
	views: {
		'home': {
			templateUrl: 'templates/live_score.html',
			controller: 'EditMatchCtrl'
		}
	}
})
.state('app.edit_match', {
	url: '/edit_match/:matchId',
	views: {
		'home': {
			templateUrl: 'templates/edit_match.html',
			controller: 'EditMatchCtrl'
		}
	}
})
.state('app.profile', {
	url: '/profile',
	views: {
		'home': {
			templateUrl: 'templates/profile.html',
			controller: 'ProfileCtrl'
		}
	}
})
.state('app.edit_profile', {
	url: '/edit_profile',
	views: {
		'home': {
			templateUrl: 'templates/edit_profile.html',
			controller: 'ProfileCtrl'
		}
	}
})
.state('app.forgot_password', {
	url: '/forgot_password',
	views: {
		'home': {
			templateUrl: 'templates/forgot_password.html',
			controller: 'Forgot_passwordCtrl'
		}
	}
})
.state('app.change_password', {
	url: '/change_password',
	views: {
		'home': {
			templateUrl: 'templates/change_password.html',
			controller: 'ProfileCtrl'
		}
	}
})
.state('app.search', {
  url: '/search',
  views: {
    'home': {
      templateUrl: 'templates/search.html',
      controller: 'SearchCtrl'
    }
  }
})
.state('app.searchTeam', {
  url: '/searchTeam',
  views: {
    'home': {
      templateUrl: 'templates/searchTeam.html',
      controller: 'SearchCtrl'
    }
  }
})
.state('app.about', {
	url: '/about',
	views: {
		'home': {
			templateUrl: 'templates/about.html',
			controller: 'MainCtrl'
		}
	}
});
// if none of the above states are matched, use this as the fallback
$urlRouterProvider.otherwise('/app/home');
});