angular.module('starter.controllers', ['ngCordova', 'ionic', 'ngMap', 'luegg.directives'])

.controller('LoginCtrl', function($scope, ionicMaterialInk, $window, LoginService, $ionicPopup, $ionicLoading, $state) {
	ionicMaterialInk.displayEffect();
		$scope.data = {}; // Declare variabel utk menyimpan data input dari user pada saat login
		$scope.login = function() { // Fungsi login
			// utk menampilkan efek loading pada saat app dibuka
			$ionicLoading.show({
				content: 'Login...',
				animation: 'fade-in',
				showBackdrop: true,
			});
			// validasi input dari user
			var alertPopup;
			if ($scope.data.username === null && $scope.data.password === null) { 
				alertPopup = $ionicPopup.alert({
					title: 'Login failed!',
					template: 'Please fill your username and password'
				});
				$ionicLoading.hide();
			} else if ($scope.data.username === null || $scope.data.username === "") {
				alertPopup = $ionicPopup.alert({
					title: 'Login failed!',
					template: 'Username must be filled!'
				});
				$ionicLoading.hide();
			} else if ($scope.data.password === null || $scope.data.password === "") {
				alertPopup = $ionicPopup.alert({
					title: 'Login failed!',
					template: 'Password must be filled!'
				});
				$ionicLoading.hide();
			} else if ($scope.data.username !== null && $scope.data.password !== null) {
				// jika input dari user sudah benar, maka sistem akan melakukan login ke server dgn parameter username dan password
				LoginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {
					localStorage.setItem("userid", data.userId); // menyimpan data user id kedalam local storage
					localStorage.setItem("token", data.id); // menyimpan data id yg akan digunakan sbg token kedalam local storage
					$state.go('app.home'); // menampilkan halaman home
					$ionicLoading.hide(); // menghilangkan efek loading jika semua proses sudah selesai
				}).error(function(data) {
					$ionicLoading.hide();
					// menampilkan alert ke user jika proses login tidak berhasil
					var alertPopup = $ionicPopup.alert({
						title: 'Login Failed!',
						template: 'Username &amp; password don’t match!'
					});
				});
			}
		};
	})

.controller('RegisterCtrl', function($scope, $state, RegisterService, $ionicPopup, $ionicPlatform, $ionicLoading, PostService) {
		//implement logic here
		var stringlength = 15;
		var stringArray = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
		var rndString = "";
		// build a string with random characters
		for(var i = 1; i < stringlength; i++){
			var rndNum = Math.ceil(Math.random() * stringArray.length) - 1;
			rndString = rndString + stringArray[rndNum];
		}

		$scope.data = {}; // declare variabel utk menyimpan data input dari user pada saat register
		$scope.data.id = rndString;
		
		$scope.register = function() { // fungsi register
			// validasi input dari user
			console.log($scope.data.id);
			var alertPopup;
			if ($scope.data.fullname === null && $scope.data.username === null && $scope.data.password === null && $scope.data.email === null && $scope.data.role === null) {
				alertPopup = $ionicPopup.alert({
					title: 'Login failed!',
					template: 'Please fill all the fields'
				});
			} else if ($scope.data.fullname === null || $scope.data.fullname === "") {
				alertPopup = $ionicPopup.alert({
					title: 'Login failed!',
					template: 'Fullname is required !'
				});
			} else if ($scope.data.username === null || $scope.data.username === "") {
				alertPopup = $ionicPopup.alert({
					title: 'Login failed!',
					template: 'Username is required !'
				});
			} else if ($scope.data.password === null || $scope.data.password === "") {
				alertPopup = $ionicPopup.alert({
					title: 'Login failed!',
					template: 'Password is required !'
				});
			} else if ($scope.data.email === null || $scope.data.email === "") {
				alertPopup = $ionicPopup.alert({
					title: 'Login failed!',
					template: 'Your email must be filled and valid'
				});
			} else if ($scope.data.role === null || $scope.data.role === "") {
				alertPopup = $ionicPopup.alert({
					title: 'Login failed!',
					template: 'You have not selected the role.'
				});
			} else if ($scope.data.fullname !== null && $scope.data.username !== null && $scope.data.password !== null && $scope.data.email !== null && $scope.data.role !== null) {
				RegisterService.tambahUser($scope.data).success(function(data) {
					console.log($scope.data.id);
					$ionicLoading.hide();
					var alertPopup = $ionicPopup.alert({
						title: 'Success!',
						template: 'Berhasil register'
					});
					$state.go('login');
				}).error(function(data) {
					console.log($scope.data.id);
					var alertPopup = $ionicPopup.alert({
						title: 'Post Data Failed!',
						template: 'Gagal register, username sudah ada'
					});
				});
			}
		};
	})

.controller('MainCtrl', function($scope, $ionicPopup, $ionicTabsDelegate, $ionicLoading, $ionicPopover, $state, ProfileService) {
		// jika user id atau token msh kosong maka sistem akan mengarahkan halaman login
		if (localStorage.getItem("userid") === null || localStorage.getItem("userid") === "" || localStorage.getItem("userid") === undefined || localStorage.getItem("token") === "" || localStorage.getItem("token") === null || localStorage.getItem("token") === undefined) {
			$state.go('login');
		}
		$scope.menuProfile = {}; // utk menyimpan data profile 

		// Do before main view loaded
		$scope.$on('$ionicView.beforeEnter', function() {
			$scope.state = $state.current.name;
			// Get user profile data
			ProfileService.getProfile(localStorage.getItem("userid"), localStorage.getItem("token")).success(function(data) {
				$scope.menuProfile = data;
				localStorage.setItem("role", data.role);
				$scope.role = "";

				if(localStorage.getItem("role") == "Coach"){
					$scope.role = "Coach";
				}else if(localStorage.getItem("role") == "Player"){
					$scope.role = "Player";
				}
				localStorage.setItem("role", $scope.role);
				console.log($scope.role);
				console.log(localStorage.getItem("role"));
				console.log($scope.menuProfile);
				$scope.menuProfile.password = "";
				//set default value to menuProfile.photo
				if ($scope.menuProfile.photo === undefined) {
					$scope.menuProfile.photo = "";
				}
				$ionicLoading.hide();

			}).error(function(data) {});
		});

		$scope.back = function() { // kembali ke halaman home
			$state.go('app.home');
		};
		$scope.backProfile = function() { // kembali ke halaman profile
			$state.go('app.profile');
		};
		$scope.logout = function() { // fungsi utk logout
			localStorage.removeItem("userid"); // menghapus data user id
			localStorage.removeItem("token"); // menghapus data token
			$state.go('login'); // menampilkan halaman login
		};
		$scope.editMatch = function() { // kembali ke halaman home
			$state.go('app.edit_match');
		};
	})

.controller('HomeCtrl', function($scope, $compile, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, MatchService, PostService, $cordovaSocialSharing, $window, $ionicModal) {
		$ionicLoading.show({ // menampilkan efek loading
			content: 'Loading',
			animation: 'fade-in',
			showBackdrop: true,
		});
		$scope.doRefresh = function() { // fungsi utk melakukan reload pada halaman yang sedang diakses
			$scope.$broadcast('scroll.refreshComplete'); // utk menghentikan proses reload jika semua data sudah selesai di load
			setTimeout(function() { // set timeout utk proses reload
				$state.go($state.current, {}, { // reload halaman 
					reload: true
				});
			}, 500);
		};
		$ionicLoading.hide(); // menghilangkan efek loading
		// mengambil semua data fixture
		PostService.getAll(localStorage.getItem("token")).success(function(data) { 
		$ionicLoading.hide();
					//Round Robin Scheduling 
					$scope.teams = [];
					$scope.teamsLength = 0;
					for (var item in data) {
						$scope.teams.push(data[item]);
					} 
					$scope.teamsLength = $scope.teams.length;
					if($scope.teams.length % 2 === 0){
						$scope.teamsLength = $scope.teams.length - 1;
					}
					$scope.newTeams = [];
					$scope.fixNum = "";
					for(var a = 1; a < $scope.teams.length; a++){
						$scope.newTeams.push($scope.teams[a]);
					}
					for(var c = $scope.teams.length; c <= $scope.teams.length; c++){
						$scope.fixNum = $scope.teams[c-$scope.teams.length];
					}
					console.log($scope.newTeams);
					console.log($scope.fixNum);
					console.log($scope.teamsLength);

					$scope.match = [];
					$scope.matches = [];
					$scope.matchPerDay = 0;
					if($scope.teams.length % 2 !== 0){
						$scope.matchPerDay = ($scope.teams.length - 1) / 2;
					}else{
						$scope.matchPerDay = $scope.teams.length / 2;
					}
					console.log($scope.matchPerDay);
					for(var round = 0; round < $scope.teamsLength; round++){
						for(var i = 0; i < $scope.matchPerDay; i++){
							if($scope.teams.length % 2 !== 0){
								$scope.team1 = $scope.teams[$scope.matchPerDay - i];
								$scope.team2 = $scope.teams[$scope.matchPerDay + i + 1];
							}else{
								$scope.team1 = $scope.teams[$scope.matchPerDay - i - 1];
								$scope.team2 = $scope.teams[$scope.matchPerDay + i];
							}
							$scope.match.push($scope.team1);
							$scope.match.push($scope.team2);
						}
						$scope.matches.push($scope.match);
						// Rotate Array
						if($scope.teams.length % 2 !== 0){
							$scope.teams = arrayRotateOdd($scope.teams, true);
						}else{
							$scope.teams = arrayRotateEven($scope.newTeams, true);
						}
						$scope.match = [];
						console.log($scope.matches);
					}

					$scope.homeTeam = [];
					$scope.awayTeam = [];
					$scope.fixtureObj = [];
					for(w = 0; w < $scope.matches.length; w++){
						for(e = 0; e < $scope.matches[w].length; e++){
							// console.log($scope.matches[w][e]);
							if(e % 2 === 0){
								$scope.homeTeam.push($scope.matches[w][e]);
							}else{
								$scope.awayTeam.push($scope.matches[w][e]);
							}
						}
					}

					for(t = 0; t < $scope.homeTeam.length; t++){
						$scope.fixtureObj[t] = {};
						$scope.fixtureObj[t] = {};
						$scope.fixtureObj[t].match_homeTeam = $scope.homeTeam[t].team_name;
						$scope.fixtureObj[t].match_awayTeam = $scope.awayTeam[t].team_name;  
						$scope.fixtureObj[t].match_time = 18 + ":00";
					}
					console.log($scope.fixtureObj);
					$scope.allFixtures = $scope.fixtureObj;
					$scope.fixture = [];
					$scope.formMatch = {};
					var fixtureNumber = 0;
					for(p = 1; p < $scope.teams.length; p++){
						fixtureNumber++;
						console.log(fixtureNumber);
						// data" utk diinput kedalam match 
						// $scope.formMatch.match_venue = "";
						// $scope.formMatch.match_time = "";
						// $scope.formMatch.match_date = "";
						// $scope.formMatch.match_referee = "";
						// data" utk diinput kedalam match 
						$scope.fixture[p] = [];
						for(u = 0; u < $scope.matchPerDay; u++){ // memasukkan data pertandingan kedalam match
							$scope.fixtureObj[u].fixture_number = fixtureNumber;
							$scope.fixture[p].push($scope.fixtureObj[u]);

							// $scope.formMatch.match_venue = "";
							// $scope.formMatch.match_time = "";
							// $scope.formMatch.match_date = "";
							// $scope.formMatch.match_referee = "";
							// $scope.formMatch.fixture_number = fixtureNumber;
							// console.log($scope.formMatch.fixture_number);
							// $scope.formMatch.match_homeTeam = $scope.fixtureObj[u].home;
							// $scope.formMatch.match_awayTeam = $scope.fixtureObj[u].away;

						}
						$scope.fixtureObj.splice(0,$scope.matchPerDay);
						console.log($scope.fixture[p]); //Menampilkan semua match dari tiap fixture
						$scope.fixture[p].forEach(function(entry){
							// MatchService.getMatches(localStorage.getItem("token")).success(function(data) {
							// 	$ionicLoading.hide();
							// 	if($scope.fixture[p])
							// }).error(function(data) {
							// 	$ionicLoading.hide();
							// });
							console.log(entry.id);
							// $scope.formMatch.match_venue = "";
							// $scope.formMatch.match_time = "";
							// $scope.formMatch.match_date = "";
							// $scope.formMatch.match_referee = "";
							// $scope.formMatch.fixture_number = entry.fixture_number;
							// $scope.formMatch.match_homeTeam = entry.home;
							// $scope.formMatch.match_awayTeam = entry.away;
							if($scope.numOfTeam == 20){ // utk sementara, nanti pake jumlah tim dari kompetisi
								MatchService.addMatch(entry).success(function(data) {
									$ionicLoading.hide();
									console.log(data);
									// var alertPopup = $ionicPopup.alert({
									// 	title: 'Success!',
									// 	template: 'Berhasil Membuat Match'
									// });
									// $state.go('app.competition');
								}).error(function(data) {
									$ionicLoading.hide();
									// var alertPopup = $ionicPopup.alert({
									// 	title: 'Post Data Failed!',
									// 	template: 'Gagal Membuat Match'
									// });
								});
							}
						});
						// for(var f in $scope.fixture[p]){
						// 	console.log($scope.fixture[p][f].fixture_number);
						// 	// $scope.formMatch.match_venue = "";
						// 	// $scope.formMatch.match_time = "";
						// 	// $scope.formMatch.match_date = "";
						// 	// $scope.formMatch.match_referee = "";
						// 	// $scope.formMatch.fixture_number = $scope.fixture[p][f].fixture_number;
						// 	// $scope.formMatch.match_homeTeam = $scope.fixture[p][f].home;
						// 	// $scope.formMatch.match_awayTeam = $scope.fixture[p][f].away;
						// 	// MatchService.addMatch($scope.formMatch).success(function(data) {
						// 	// 	$ionicLoading.hide();
						// 	// 	console.log(data);
						// 	// 	// var alertPopup = $ionicPopup.alert({
						// 	// 	// 	title: 'Success!',
						// 	// 	// 	template: 'Berhasil Membuat Match'
						// 	// 	// });
						// 	// 	// $state.go('app.competition');
						// 	// }).error(function(data) {
						// 	// 	$ionicLoading.hide();
						// 	// 	// var alertPopup = $ionicPopup.alert({
						// 	// 	// 	title: 'Post Data Failed!',
						// 	// 	// 	template: 'Gagal Membuat Match'
						// 	// 	// });
						// 	// });
						// }
					}
					// console.log($scope.fixture); //Menampilkan semua fixture 

					// for (var f in $scope.fixture[1]) {
     //                 		console.log($scope.fixture[1][f]);
     //                 		MatchService.addMatch($scope.fixture[1][f]).success(function(data) {
					// 			$ionicLoading.hide();
					// 			// var alertPopup = $ionicPopup.alert({
					// 			// 	title: 'Success!',
					// 			// 	template: 'Berhasil Membuat Match'
					// 			// });
					// 			// $state.go('app.competition');
					// 		}).error(function(data) {
					// 			$ionicLoading.hide();
					// 			// var alertPopup = $ionicPopup.alert({
					// 			// 	title: 'Post Data Failed!',
					// 			// 	template: 'Gagal Membuat Match'
					// 			// });
					// 		});
     //                	}

					//Fungsi utk rotate value pada array untuk tim yg berjumlah genap
					function arrayRotateEven(newTeams, reverse) {
						if(reverse){
							$scope.newTeams.unshift($scope.newTeams.pop());
							$scope.newTeams.splice(0,0,$scope.fixNum);
							for(var n = 1; n < $scope.teamsLength; n++){
								if($scope.newTeams[n] == $scope.fixNum){
									$scope.newTeams.splice(n,1);
								}
							}
						}
						else{
							$scope.newTeams.push(newTeams.shift());
							$scope.newTeams.splice(0,0,$scope.fixNum);
							for(var m = 1; m < $scope.teamsLength; m++){
								if($scope.newTeams[m] == $scope.fixNum){
									$scope.newTeams.splice(m,1);
								}
							}
						}
						return $scope.newTeams;
					}
					//Fungsi utk rotate value pada array untuk tim yg berjumlah genap
					//Fungsi utk rotate value pada array untuk tim yg berjumlah ganjil
					function arrayRotateOdd(teams, reverse) {
						if(reverse){
							$scope.teams.unshift($scope.teams.pop());
						}
						else{
							$scope.teams.push($scope.teams.shift());
						}
						return $scope.teams;
					}
					//Fungsi utk rotate value pada array untuk tim yg berjumlah ganjil
					//Round Robin Scheduling
				}).error(function(data) {});
	$scope.matches = {};
	$scope.matchStarted = false;
	MatchService.getMatchesByFixture("1").success(function(data) {
        $scope.matches = data;
        for(var item in $scope.matches){
        	console.log($scope.matches[item]);
        	console.log(moment().format('LT'));
        	console.log(moment().format('MM/DD/YYYY'));
        	if($scope.matches[item].match_date == "2:48 AM" && $scope.matches[item].match_time == "2:48 AM"){
        		$scope.matchStarted = true;
	        	console.log($scope.matchStarted);
        	}
        }
    }).error(function(data) {});
    $scope.matchData = {};
    $scope.timerData = [];
    $scope.getMatchesByFixture = function(id) {
    	MatchService.getMatchesByFixture("1").success(function(data) {
	        $scope.matches = data;
	        for(t = 0; t < $scope.matches.length; t++){
	        	$scope.timerData[t] = {};
	        }
	        for(var item in $scope.matches){
	        	// $scope.timerData[item+1] = {};
	        	console.log($scope.matches[item]);
	        	console.log(moment().format('kk:mm'));
	        	if($scope.matches[item].match_date == moment().format('MM/DD/YYYY') && $scope.matches[item].match_time == moment().format('kk:mm')){
	        		$scope.matchData.match_started = true; 
	        		$scope.matchData.timer = 1;
	        		console.log($scope.matchData.match_started);
	        		MatchService.editMatchById($scope.matches[item].id,localStorage.getItem("token"),$scope.matchData).success(function(data) {
						console.log('asasdasd asdasdasda sdasd');
						$ionicLoading.hide();
						// $state.go('app.home');
					}).error(function(data) {
						$ionicLoading.hide();
					});
					// $scope.timerData.timer = $scope.matches[item].timer + 1;
     //    			console.log($scope.timerData.timer);
	    //     		MatchService.editMatchById($scope.matches[item].id,localStorage.getItem("token"),$scope.timerData).success(function(data) {
					// 	console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
					// 	$ionicLoading.hide();
					// 	$state.go('app.home');
					// }).error(function(data) {
					// 	$ionicLoading.hide();
					// });
	        	}
	        }
    	}).error(function(data) {});
    };


    MatchService.getMatchesByFixture("1").success(function(data) {
        $scope.matches = data;
        for(var item in $scope.matches){
        	console.log($scope.matches[item]);
        	if($scope.matches[item].timer == 1){
        		$scope.startTimer = function() {
			    	// MatchService.getMatchesByFixture("1").success(function(data) {
				    //     $scope.matches = data;
				    //     for(var item in $scope.matches){
				    //     	console.log($scope.matches[item]);
				    //     	if($scope.matches[item].timer !== null){
				        		console.log("xcvx cvx vxvxcvxvx vxvxvxvcxv");
				        		$scope.timerData[item].timer = $scope.matches[item].timer + 1;
								console.log($scope.timerData[item].timer);
								MatchService.editMatchById($scope.matches[item].id,localStorage.getItem("token"),$scope.timerData[item]).success(function(data) {
									console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
									$ionicLoading.hide();
									// $state.go('app.home');
								}).error(function(data) {
									$ionicLoading.hide();
								});
				        	// }
				        // }
			    	// }).error(function(data) {});
		    	};
		    	$scope.myVar[item] = setInterval($scope.startTimer, 60000);
        	}
        }
	}).error(function(data) {});
   
   	$scope.startTimer = function() {
		MatchService.getMatchesByFixture("1").success(function(data) {
	        $scope.matches = data;
	        for(var item in $scope.matches){
	        	// $scope.timerData[item] = {};
	        	console.log($scope.matches[item]);
	        	if($scope.matches[item].timer !== null){
	        		console.log("xcvx cvx vxvxcvxvx vxvxvxvcxv");
	        		$scope.timerData[item].timer = $scope.matches[item].timer + 1;
					console.log($scope.timerData.timer);
					MatchService.editMatchById($scope.matches[item].id,localStorage.getItem("token"),$scope.timerData[item]).success(function(data) {
						console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
						$ionicLoading.hide();
						// $state.go('app.home');
					}).error(function(data) {
						$ionicLoading.hide();
					});
	        	}
	        }
		}).error(function(data) {});
	};

 //    $scope.startTimer = function(){
	// 	$scope.timerData.timer = $scope.matches[item].timer + 1;
	// 	console.log($scope.timerData.timer);
	// 	MatchService.editMatchById($scope.matches[item].id,localStorage.getItem("token"),$scope.timerData).success(function(data) {
	// 		console.log('qweqweqrer erwerwerrqwrqwrqwrqwr');
	// 		$ionicLoading.hide();
	// 		$state.go('app.home');
	// 	}).error(function(data) {
	// 		$ionicLoading.hide();
	// 	});
	// };
   //  $scope.m = 1;
   //  $scope.startTime = function(){
   //  	$scope.m = $scope.m + 1;
 		// console.log($scope.m);
   //  };
    window.onload = $scope.startTimer;
    // $scope.myVar = setInterval($scope.startTimer, 60000);
    window.onload = $scope.getMatchesByFixture;
    // $scope.myVar = setInterval($scope.getMatchesByFixture, 1000);

	$scope.editMatch = function(id) { // kembali ke halaman home
		$state.go('app.edit_match', {
			'matchId': id
		});
	};
	$scope.liveScore = function(id) { // kembali ke halaman home
		$state.go('app.live_score', {
			'matchId': id
		});
	};
})

.controller('ProfileCtrl', function($scope, $state, $ionicPopup, $ionicPlatform, $ionicLoading, LoginService, PostService, $cordovaImagePicker, $cordovaCamera) {
	$ionicLoading.show({
		content: 'Loading',
		animation: 'fade-in',
		showBackdrop: true,
	});
		//implement logic here
		$scope.profile = {};
		$scope.uploadImage = function() {
			document.getElementById('file-upload').click();
		};
		$scope.showPreviewImage = function(x) {
			var fReader = new FileReader();
			fReader.readAsDataURL(x);
			fReader.onload = function(event) {
				var img = document.getElementById("file-upload");
				$scope.image = event.target.result;
				$scope.$apply();
			};
		};

		LoginService.getUser(localStorage.getItem("userid"), localStorage.getItem("token")).success(function(data) {
			$scope.profile = {};
			$scope.profile = data;
			$scope.editPassword = function() {
				// Loading
				$ionicLoading.show({
					content: 'Loading',
					animation: 'fade-in',
					showBackdrop: true,
				});
				$scope.profile = data;
					// Add data to database
					LoginService.editPassword(localStorage.getItem("userid"), localStorage.getItem("token"), $scope.profile).success(function(data) {
						$scope.profile = data;
						$ionicLoading.hide();
						$state.go('app.profile');
					}).error(function(data) {
						$ionicLoading.hide();
					});
				};
			}).error(function(data) {});
		// $scope.editPassword = function(email) {
		//     LoginService.changePassword(localStorage.getItem("token"), $scope.formCP).success(function(data) {
		//         $ionicLoading.hide();
		//         $state.go('app.home');
		//     }).error(function(data) {});
		// }
	})

.controller('MatchDetailCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, MatchService, PostService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});
	$scope.match = {};
	MatchService.getMatchById($stateParams.matchId).success(function(data) {
		$ionicLoading.hide();
		$scope.match = data;
	}).error(function(data) {});
		// $scope.goBackToTicket = function() {
		//     $state.go('app.tickets');
		// }
	})

.controller('EditMatchCtrl', function(NgMap, $scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, MatchService, PostService, CompetitionService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});
	$scope.matchData = {};
	MatchService.getMatchById($stateParams.matchId,localStorage.getItem("token")).success(function(data){
		$scope.matchData = data;
		console.log($scope.matchData);
		$ionicLoading.hide();
	}).error(function(data){
		$ionicLoading.hide();
	});

	$scope.match = {};
	console.log($stateParams.matchId);
	$scope.editMatchById = function() {
		MatchService.editMatchById($stateParams.matchId,localStorage.getItem("token"),$scope.match).success(function(data) {
			console.log(data);
			$ionicLoading.hide();
			$state.go('app.home');
		}).error(function(data) {
			$ionicLoading.hide();
		});
	};
	
	$scope.homeScore = {};
	$scope.homeScore.goalHome = {};
	$scope.awayScore = {};
	$scope.addScoreHome = function() {
		MatchService.getMatchById($stateParams.matchId,localStorage.getItem("token")).success(function(data){
			$scope.matchData = data;
			console.log($scope.matchData);
			$ionicLoading.hide();
			$scope.homeScore.match_homeScore = $scope.matchData.match_homeScore + 1;
			$scope.homeScore.goalHome.scorer = "jims";
			$scope.homeScore.goalHome.time = $scope.matchData.timer;
			MatchService.editMatchById($stateParams.matchId,localStorage.getItem("token"),$scope.homeScore).success(function(data) {
				console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		}).error(function(data){
			$ionicLoading.hide();
		});
	};
	$scope.addScoreAway = function() {
		MatchService.getMatchById($stateParams.matchId,localStorage.getItem("token")).success(function(data){
			$scope.matchData = data;
			console.log($scope.matchData);
			$ionicLoading.hide();
			$scope.awayScore.match_awayScore = $scope.matchData.match_awayScore + 1;
			MatchService.editMatchById($stateParams.matchId,localStorage.getItem("token"),$scope.awayScore).success(function(data) {
				console.log("sdfjh sdfjshfsjdhf sjdfhsdjfshdfjshdfs jkdfhskjfdh");
				$ionicLoading.hide();
			}).error(function(data) {
				$ionicLoading.hide();
			});
		}).error(function(data){
			$ionicLoading.hide();
		});
	};
})

.controller('CompetitionCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, MatchService, CompetitionService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing, $compile, NgMap) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});
	$scope.data = {};
	$scope.data.register = "";
	$scope.registered = [];

	CompetitionService.getCompetition(localStorage.getItem("token")).success(function(data) {
		$ionicLoading.hide();
		$scope.competition = {};
		$scope.competition = data;
		console.log(localStorage.getItem("userid"));
		data.forEach(function(entry){
			$scope.registerArr = entry.register.split(',');
			var a = $scope.registerArr.indexOf(localStorage.getItem("userid"));
			if(a != -1){
				$scope.registered[entry.id] = true;
			}else{
				$scope.registered[entry.id] = false;
			}
		});
	}).error(function(data) {
		$ionicLoading.hide();
	});

	$scope.addCompetition = function() {
		CompetitionService.addCompetition($scope.data).success(function(data) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Success!',
				template: 'Berhasil Membuat Kompetisi'
			});
			$state.go('app.competition');
		}).error(function(data) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Post Data Failed!',
				template: 'Gagal Membuat Kompetisi'
			});
		});
	};

	$scope.more = function(id) {
		$state.go('app.competition_detail', {
			'competitionId': id
		});
	};

	$scope.loadMap = function(){
		$state.go('app.create_competition');
	};

	$scope.registerTeam = function(id) {
		$state.go('app.register_team', {
			'competitionId': id
		});
	};

	$scope.backToCompetition = function() {
		$state.go('app.competition');
	};

})

.controller('CompetitionDetailCtrl', function(NgMap, $scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, MatchService, PostService, CompetitionService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});

	$scope.competition = {};
	console.log($stateParams.competitionId);
	CompetitionService.getCompetitionById($stateParams.competitionId,localStorage.getItem("token")).success(function(data) {
		console.log(data);
		$ionicLoading.hide();
		$scope.competition = data;
	}).error(function(data) {});

	$scope.backToCompetition = function() {
		$state.go('app.competition');
	};
})

.controller('RegisterTeamCtrl', function($scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, LoginService, MatchService, CompetitionService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing, $compile, NgMap) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});
	console.log($stateParams.competitionId);
		// $scope.profile = {};
		$scope.registered = false;
		$scope.registerArr = [];
		$scope.formTeam = {};
		$scope.formCompetition = {};
		$scope.formCompetition.CompetitionId = $stateParams.competitionId;
		$scope.formCompetition.UserId = localStorage.getItem("userid");
		console.log($scope.formCompetition.UserId);

		$scope.registerTeam = function(){
			$scope.formTeam.competitionId = $stateParams.competitionId;
			console.log( $scope.formTeam.competitionId);
			CompetitionService.registerTeam($scope.formTeam).success(function(data){
				$ionicLoading.hide();
				$state.go('app.competition');
			}).error(function(data){
				$ionicLoading.hide();
			});

			CompetitionService.addRegister($scope.formCompetition).success(function(data){
				$ionicLoading.hide();
				$state.go('app.competition');
			}).error(function(data){
				$ionicLoading.hide();
			});        
		};

		$scope.backToCompetition = function() {
			$state.go('app.competition');
		};

	})

.controller('MyTeamCtrl', function(NgMap, $scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, TeamService, LoginService, MatchService, PostService, ProfileService, CompetitionService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});
	console.log(localStorage.getItem("isCoach"));
	console.log($scope.menuProfile);
	$scope.team = {};
	$scope.myTeam = {};
	$scope.teamAcronym = '';
	$scope.myTeamArr = [];
	$scope.teamAlreadyExist = false;
	$scope.NoInvitation = false;
	$scope.requestedTeam = false;
	$scope.requestedTeamArr = [];
	$scope.joinTeam = false;
	$scope.teamInvitation = [];

	if($scope.menuProfile.teamInvitation === '' || $scope.menuProfile.teamInvitation === null){
		$scope.NoInvitation = true;
		console.log("tidak ada undangan tim");
	}
	$scope.teamInvitation = $scope.menuProfile.teamInvitation.split(',');

	$scope.teamInvitationArr = [];
	for(var i in $scope.teamInvitation){
		TeamService.getTeamByName($scope.teamInvitation[i]).success(function(data){
			console.log(data);
			$ionicLoading.hide();
			$scope.teamInvitationArr.push(data);
			console.log($scope.teamInvitationArr);
		}).error(function(data) {
			$ionicLoading.hide();
		});
	}

	if($scope.menuProfile.team !== '' || $scope.menuProfile.team !== null){
		$scope.joinTeam = true;
		console.log("already joining a team");
	}

	if($scope.menuProfile.teamRequested !== '' || $scope.menuProfile.teamRequested !== null){
		$scope.requestedTeam = true;
		console.log("requested a team");
	}else{
		$scope.requestedTeam = false;
		console.log("requested a team");
	}

	if($scope.menuProfile.role === 'Player'){
		if($scope.menuProfile.teamRequested === null || $scope.menuProfile.teamRequested === ''){
			console.log("dsfsdfsd");
		}else{
			$scope.requestedTeamArr = $scope.menuProfile.teamRequested.split(',');
			console.log($scope.requestedTeamArr);
		}
		
	}	

	TeamService.getTeam(localStorage.getItem("token")).success(function(data) {
		console.log(data);
		$scope.team = data;
		$ionicLoading.hide();
		console.log(localStorage.getItem("userid"));
		console.log($scope.team);
		for(var i = 0; i < $scope.team.length; i++){
			console.log($scope.team[i].coach_id);
			if($scope.team[i].coach_id == localStorage.getItem("userid")){
				$scope.myTeam = $scope.team[i];
				$scope.teamAlreadyExist = true;
				console.log($scope.myTeam);
				console.log($scope.teamAlreadyExist);
			}
		}
		console.log($scope.myTeam);
		console.log($scope.myTeamArr);
		if($scope.menuProfile.role === 'Coach'){
			$scope.myTeamArr = $scope.myTeam.team_name.split(' ');
			console.log($scope.myTeam.team_name.split(' '));
			if($scope.myTeamArr.length>2){
				for(i=0;i<$scope.myTeamArr.length;i++){
					$scope.teamAcronym += $scope.myTeamArr[i].substr(0,1);
				}
			}else{
				for(i=0;i<$scope.myTeamArr.length;i++){
					$scope.teamAcronym += $scope.myTeamArr[i].substr(0,1);
				}
			}	
			console.log($scope.teamAcronym);
		}

	$scope.teamSquadArr = [];
	TeamService.getTeamSquad($scope.menuProfile.team).success(function(data){
		console.log("sdfsdf dfsdfs dfsfdsdf");
		$ionicLoading.hide();
		$scope.teamSquadArr = data;
		console.log($scope.teamSquadArr);
	}).error(function(data) {
		$ionicLoading.hide();
	});
	}).error(function(data) {
		$ionicLoading.hide();
	});

	$scope.addUserToTeamSquad = function(teamName) {
		$scope.squadData = {};
		$scope.squadData.Member = $scope.menuProfile.username;
		$scope.squadData.TeamName = teamName;

		TeamService.addMemberByName($scope.squadData).success(function(data){
			$ionicLoading.hide();
			console.log("sukses wuhuhuhu");
			// $state.go('app.team');
		}).error(function(data){
			$ionicLoading.hide();
		});

		$scope.userSquad = {};
		$scope.userSquad.TeamName = teamName;
		$scope.userSquad.UserId = $scope.menuProfile.id;
		TeamService.addTeamToUser($scope.userSquad).success(function(data){
			$ionicLoading.hide();
			console.log("sukses wahahah");
			// $state.go('app.team');
		}).error(function(data){
			$ionicLoading.hide();
		});


		$scope.delInvitation = {};
		$scope.delInvitation.UserName = $scope.menuProfile.username;
		$scope.delInvitation.teamInvite = teamName;
		TeamService.delTeamInvitation($scope.delInvitation).success(function(data){
			$ionicLoading.hide();
			console.log("sukses alelele");
			// $state.go('app.team');
		}).error(function(data){
			$ionicLoading.hide();
		});

		$scope.delInvitedMember = {};
		$scope.delInvitedMember.TeamName = teamName;
		$scope.delInvitedMember.userInvited = $scope.menuProfile.username;
		TeamService.delInvitedMember($scope.delInvitedMember).success(function(data){
			$ionicLoading.hide();
			console.log("sukses ulelele");
			// $state.go('app.team');
		}).error(function(data){
			$ionicLoading.hide();
		});
	};

	$scope.delUserFromInvitedMember = function(teamName) {
		$scope.delInvitation = {};
		$scope.delInvitation.UserName = $scope.menuProfile.username;
		$scope.delInvitation.teamInvite = teamName;
		TeamService.delTeamInvitation($scope.delInvitation).success(function(data){
			$ionicLoading.hide();
			console.log("sukses alelele");
			// $state.go('app.team');
		}).error(function(data){
			$ionicLoading.hide();
		});

		$scope.delInvitedMember = {};
		$scope.delInvitedMember.TeamName = teamName;
		$scope.delInvitedMember.userInvited = $scope.menuProfile.username;
		TeamService.delInvitedMember($scope.delInvitedMember).success(function(data){
			$ionicLoading.hide();
			console.log("sukses ulelele");
			// $state.go('app.team');
		}).error(function(data){
			$ionicLoading.hide();
		});
	};

    // belum tau ini utk apa, biarin dlu			
	$scope.competition = {};
	console.log($stateParams.competitionId);

	CompetitionService.getCompetitionById($stateParams.competitionId,localStorage.getItem("token")).success(function(data) {
		console.log(data);
		$ionicLoading.hide();
		$scope.competition = data;
	}).error(function(data) {});

	$scope.goToCompDetail = function(id) {
		$state.go('app.competition_detail', {
			'competitionId': id
		});
	};
	$scope.goToMemberDetail = function(id) {
		$state.go('app.member_profile', {
			'userID': id
		});
	};
	$scope.goToTeamDetail = function(id) {
		$state.go('app.team_detail', {
			'teamId': id
		});
	};
	$scope.goToChatDetail = function(username) {
		$state.go('app.chat_detail', {
			'username': username
		});
	};
	$scope.createTeam = function() {
		$state.go('app.create_team');
	};
	$scope.searchTeam = function() {
		$state.go('app.searchTeam');
	};
})

.controller('TeamDetailCtrl', function(NgMap, $scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, TeamService, LoginService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});

	$scope.team = {};
	$scope.invited_member = [];
	$scope.userRequest = [];
	$scope.haveMember = false;
	$scope.userRequestExist = false;
	console.log($stateParams.teamId);
	localStorage.setItem("teamId", $stateParams.teamId);
	TeamService.getTeamById($stateParams.teamId,localStorage.getItem("token")).success(function(data) {
		console.log(data);
		$ionicLoading.hide();
		$scope.team = data;

		if($scope.team.invited_member.length !== 0){
			$scope.haveMember = true;
		}

		if($scope.team.user_request !== ''){
			$scope.userRequestExist = true;
			console.log("asdafa s asdasdada");
		}
		
		$scope.invited_member = $scope.team.invited_member.split(',');
		$scope.userRequest = $scope.team.user_request.split(',');
		console.log($scope.invited_member);
		console.log($scope.userRequest);
		console.log($scope.haveMember);
		console.log($scope.team);

		$scope.userRequestArr = [];
		for(var i in $scope.userRequest){
			LoginService.getUserByUsername($scope.userRequest[i]).success(function(data){
				console.log(data);
				$ionicLoading.hide();
				$scope.userRequestArr.push(data);
				console.log($scope.userRequestArr);
			}).error(function(data) {
				$ionicLoading.hide();
			});
		}

		$scope.addUserToTeamSquad = function(userName) {
			$scope.squadData = {};
			$scope.squadData.Team = $scope.team.team_name;
			$scope.squadData.Username = userName;

			TeamService.addTeamByName($scope.squadData).success(function(data){
				$ionicLoading.hide();
				console.log("sukses wuhuhuhu");
				// $state.go('app.team');
			}).error(function(data){
				$ionicLoading.hide();
			});

			$scope.userSquad = {};
			$scope.userSquad.Username = userName;
			$scope.userSquad.TeamId = $scope.team.id;
			TeamService.addMemberToTeam($scope.userSquad).success(function(data){
				$ionicLoading.hide();
				console.log("sukses wahahah");
				// $state.go('app.team');
			}).error(function(data){
				$ionicLoading.hide();
			});


			$scope.delRequest = {};
			$scope.delRequest.TeamName = $scope.team.team_name;
			$scope.delRequest.userRequest = userName;
			TeamService.delUserRequest($scope.delRequest).success(function(data){
				$ionicLoading.hide();
				console.log("sukses alelele");
				// $state.go('app.team');
			}).error(function(data){
				$ionicLoading.hide();
			});

			$scope.delRequestedTeam = {};
			$scope.delRequestedTeam.Username = userName;
			$scope.delRequestedTeam.teamRequested = $scope.team.team_name;
			TeamService.delRequestedTeam($scope.delRequestedTeam).success(function(data){
				$ionicLoading.hide();
				console.log("sukses ulelele");
				// $state.go('app.team');
			}).error(function(data){
				$ionicLoading.hide();
			});
		};

		$scope.delTeamFromRequestedTeam = function(userName) {
			$scope.delRequest = {};
			$scope.delRequest.TeamName = $scope.team.team_name;
			$scope.delRequest.userRequest = userName;
			TeamService.delUserRequest($scope.delRequest).success(function(data){
				$ionicLoading.hide();
				console.log("sukses alelele");
				// $state.go('app.team');
			}).error(function(data){
				$ionicLoading.hide();
			});

			$scope.delRequestedTeam = {};
			$scope.delRequestedTeam.Username = userName;
			$scope.delRequestedTeam.teamRequested = $scope.team.team_name;
			TeamService.delRequestedTeam($scope.delRequestedTeam).success(function(data){
				$ionicLoading.hide();
				console.log("sukses ulelele");
				// $state.go('app.team');
			}).error(function(data){
				$ionicLoading.hide();
			});
		};


	}).error(function(data) {});

	$scope.backToMyTeam = function() {
		$state.go('app.my_team');
	};
	$scope.goToSearch = function() {
		$state.go('app.search');
	};
})

.controller('TeamCtrl', function(NgMap, $scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, TeamService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});

	$scope.teamsData = {};

	$scope.addTeam = function() {
		$scope.teamsData.coach_id = localStorage.getItem("userid");
		$scope.teamsData.team_squad = [];
		TeamService.addTeam($scope.teamsData).success(function(data) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Success!',
				template: 'Berhasil Membuat Tim'
			});
			$state.go('app.my_team');
		}).error(function(data) {
			$ionicLoading.hide();
			var alertPopup = $ionicPopup.alert({
				title: 'Post Data Failed!',
				template: 'Gagal Membuat Tim'
			});
		});
	};

	$scope.backToMyTeam = function() {
		$state.go('app.my_team');
	};
})

.controller('MemberProfileCtrl', function(NgMap, $scope, $state, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, MatchService, PostService, CompetitionService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing) {
	$ionicLoading.show({
		content: 'Login...',
		animation: 'fade-in',
		showBackdrop: true,
	});

	$scope.competition = {};
	console.log($stateParams.competitionId);
	CompetitionService.getCompetitionById($stateParams.competitionId,localStorage.getItem("token")).success(function(data) {
		console.log(data);
		$ionicLoading.hide();
		$scope.competition = data;
	}).error(function(data) {});

	$scope.more = function(id) {
		$state.go('app.competition_detail', {
			'competitionId': id
		});
	};
})
.controller('SearchCtrl', function($scope, $state, $ionicPopup, $ionicPlatform, $ionicLoading, TeamService, $stateParams) {
        $scope.doRefresh = function() {
            $scope.$broadcast('scroll.refreshComplete');
            setTimeout(function() {
                $state.go($state.current, {}, {
                    reload: true
                });
            }, 500);
        };
        $scope.search = {};
        $scope.team = {};
    	$scope.formMember = {};
		$scope.formTeam = {};
		$scope.dataMember = {};
		$scope.dataTeam = {};

        $scope.searchData = function() {
            $ionicLoading.show({
                content: 'Login...',
                animation: 'fade-in',
                showBackdrop: true,
            });
            TeamService.searchData($scope.search.nama).success(function(data) {
                $scope.search = data;
                $scope.people = [];
                $scope.teamArr = [];
                for (var item in $scope.search.member) {
                    $scope.people.push($scope.search.member[item]);
                   	$scope.formMember.Username = $scope.search.member[item].username;
                   	$scope.formTeam.UserId = $scope.search.member[item].id;

                   	TeamService.getTeamById(localStorage.getItem("teamId"),localStorage.getItem("token")).success(function(data) {
						console.log(data);
						$ionicLoading.hide();
						$scope.team = data;

						$scope.formMember.TeamId = $scope.team.id;
                   		$scope.formTeam.TeamName = $scope.team.team_name;

					}).error(function(data) {
						$ionicLoading.hide();
					});

                   
                }

              	for (var item in $scope.search.team) {
	                $scope.teamArr.push($scope.search.team[item]);
	                $scope.dataMember.TeamId = $scope.search.team[item].id;
	                $scope.dataTeam.TeamName = $scope.search.team[item].team_name;
                }
                $scope.dataMember.Username = $scope.menuProfile.username;
	            $scope.dataTeam.UserId = $scope.menuProfile.id;

            	$scope.inviteMember = function(){
					console.log($scope.formMember);
                   	console.log($scope.formTeam);
					TeamService.addInvitedMember($scope.formMember).success(function(data){
						$ionicLoading.hide();
						console.log("sukses yataa");
						// $state.go('app.team');
					}).error(function(data){
						$ionicLoading.hide();
					});

					TeamService.addTeamInvitation($scope.formTeam).success(function(data){
						$ionicLoading.hide();
						console.log("berhasil wahuuu");
						// $state.go('app.team');
					}).error(function(data){
						$ionicLoading.hide();
					});                
				};

				$scope.JoinTeam = function(){
					console.log($scope.dataMember);
                   	console.log($scope.dataTeam);
					TeamService.addRequestedTeam($scope.dataTeam).success(function(data){
						$ionicLoading.hide();
						console.log("sukses yataa");
						// $state.go('app.team');
					}).error(function(data){
						$ionicLoading.hide();
					});

					TeamService.addUserRequest($scope.dataMember).success(function(data){
						$ionicLoading.hide();
						console.log("berhasil wahuuu");
						// $state.go('app.team');
					}).error(function(data){
						$ionicLoading.hide();
					});                
				};
                $ionicLoading.hide();
            }).error(function(data) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Search failed!',
                    template: 'Failed to search data'
                });
            });
         

   //          $scope.formMember = {};
			// $scope.formTeam = {};
			// $scope.formMember.Username = $scope.people.username;
			// $scope.formMember.TeamId = 
			// $scope.formTeam.TeamName = 
			// $scope.formTeam.UserId = $scope.people.id;
			// console.log($scope.formCompetition.UserId);

			// $scope.inviteMember = function(){
				
			// 	TeamService.addInvitedMember($scope.formMember).success(function(data){
			// 		$ionicLoading.hide();
			// 		$state.go('app.team');
			// 	}).error(function(data){
			// 		$ionicLoading.hide();
			// 	});

			// 	TeamService.addTeamInvitation($scope.formTeam).success(function(data){
			// 		$ionicLoading.hide();
			// 		$state.go('app.team');
			// 	}).error(function(data){
			// 		$ionicLoading.hide();
			// 	});                
			// };

			// $scope.backToCompetition = function() {
			// 	$state.go('app.competition');
			// };

            // LoginService.getUserByUsername($scope.search.nama).success(function(data) {
            //     $scope.search = data;
            //     console.log($scope.search);
            //     $ionicLoading.hide();
            // }).error(function(data) {
            //     var alertPopup = $ionicPopup.alert({
            //         title: 'Search failed!',
            //         template: 'Failed to search data'
            //     });
            // });
        };
       
        // $scope.userDetail = function(username) {
        //     $state.go('app.message_detail', {
        //         'username': username
        //     });
        // };

        // $scope.postDetail = function(id) {
        //     $state.go('app.post', {
        //         'dataId': id
        //     });
        // };

    })

.controller('ChatCtrl', function($scope, $state, $ionicPopup, $ionicPlatform, $ionicLoading, LoginService, MessageService, $stateParams) {
    $scope.Message = {};
    $scope.otherProfile = {};
    $scope.profile = {};
    $scope.dataMessage = {};
    $scope.contacts = {};
    $scope.showme = false;
    $scope.historyMessage = {};
    $scope.arrMessage = [];
    $scope.arrContacts = [];

    $scope.doRefresh = function() {
        $scope.$broadcast('scroll.refreshComplete');
        setTimeout(function() {
            $state.go($state.current, {}, {
                reload: true
            });
        }, 500);
    };
    // $ionicLoading.show({
    //     content: 'Login...',
    //     animation: 'fade-in',
    //     showBackdrop: true,
    // });
    LoginService.getUser(localStorage.getItem("userid"), localStorage.getItem("token")).success(function(data) {
        $scope.profile = data;
        LoginService.getUserByUsername(localStorage.getItem("MessageUsername")).success(function(data) {
            $scope.otherProfile = data;
            MessageService.getMessage($scope.profile.username, localStorage.getItem("MessageUsername")).success(function(data) {
                // $ionicLoading.hide();
                $scope.Message = data;
                data.sort(function(a, b) {
                    var dateA = new Date(a.date),
                        dateB = new Date(b.date);
                    return dateA - dateB; //sort by date ascending
                });
            }).error(function(data) {});
        }).error(function(data) {});
    }).error(function(data) {});
    // Get Contact List in Message
    // MessageService.getContacts(localStorage.getItem("token")).success(function(data) {
    //     $ionicLoading.hide();
    //     $scope.contacts = data;
    //     for (var item in data) {
    //         $scope.arrContacts.push(data[item]);
    //     }
    // }).error(function(data) {});
    // Get Recent Message
    MessageService.getMessageBySender($scope.menuProfile.username).success(function(data) {
        // Variable for status read by receiver
        $scope.recentMessage = data;
        console.log(data);
        // Change for taget at message detail
        for (var i = $scope.recentMessage.length - 1; i >= 0; i--) {
            if ($scope.recentMessage[i].receiver == $scope.menuProfile.username) {
                $scope.recentMessage[i].receiver = $scope.recentMessage[i].sender;
            }
        }
    }).error(function(data) {});
    $scope.ReadMessage = function(idMessage, reader, receiver) {
        // Add reader for status has been read
        MessageService.addReader(idMessage, reader).success(function(data) {
        }).error(function(data) {});
        // Go to message detail page
        $state.go('app.chat_detail', {
            'username': receiver
        });
    };
    $scope.userDetail = function(username) {
        // Go to message detail page
        $state.go('app.chat_detail', {
            'username': username
        });
    };
})

.controller('ChatDetailCtrl', function(NgMap, $scope, $location, $state, $anchorScroll, $stateParams, $ionicPopup, $ionicPlatform, $ionicLoading, MessageService, LoginService, CompetitionService, ionicMaterialInk, ionicMaterialMotion, $cordovaSocialSharing, $timeout) {
	var stringlength = 15;
	var stringArray = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	var rndString = "";
	// build a string with random characters
	for(var i = 1; i < stringlength; i++){
		var rndNum = Math.ceil(Math.random() * stringArray.length) - 1;
		rndString = rndString + stringArray[rndNum];
	} 

	$scope.Message = {};
    $scope.otherProfile = {};
    $scope.profile = {};
    $scope.dataMessage = {};
    $scope.glued = true;
    // $scope.readStatus = false;
    // $ionicLoading.show({
    //     content: 'Login...',
    //     animation: 'fade-in',
    //     showBackdrop: true,
    // });
    LoginService.getUser(localStorage.getItem("userid"), localStorage.getItem("token")).success(function(data) {
        $scope.profile = data;
        LoginService.getUserByUsername($stateParams.username).success(function(data) {
            $scope.otherProfile = data;
            console.log($scope.profile.username);
            console.log($stateParams.username);
            MessageService.getMessage($scope.profile.username, $scope.otherProfile.username).success(function(data) {
                $scope.Message = data;
                console.log($scope.Message);
                $ionicLoading.hide();
                data.sort(function(a, b) {
                    var dateA = new Date(a.date),
                        dateB = new Date(b.date);
                    return dateA - dateB;//sort by date ascending
                });
                $scope.newMessage = data;
                $scope.glued = !$scope.glued;
      //           $scope.messageData = {};
           //     	for(var item in $scope.Message){
           //     		if($scope.Message[item].receiver == $scope.profile.username){
	          //      		MessageService.addReader($scope.Message[item].id, $scope.profile.username).success(function(data) {
		        	// 		console.log("read berhasil");
		        	// 	}).error(function(data) {});
		        	// }
      //          		if($scope.Message[item].receiver == $scope.profile.username){
      //          			$scope.messageData.readStatus = true;
		    //     		console.log($scope.messageData.readStatus);
		    //     		MessageService.editMessageById($scope.Message[item].id,localStorage.getItem("token"),$scope.messageData).success(function(data) {
						// 	console.log('asasdasd asdasdasda sdasd');
						// 	$ionicLoading.hide();
						// }).error(function(data) {
						// 	$ionicLoading.hide();
						// });
      //          		}
               	// }
            }).error(function(data) {});
            $scope.getMessage = function() { 
            	MessageService.getMessage($scope.profile.username, $scope.otherProfile.username).success(function(data) {
	                $scope.Message = data;
	                console.log($scope.Message);
	                $ionicLoading.hide();
	                data.sort(function(a, b) {
	                    var dateA = new Date(a.date),
	                        dateB = new Date(b.date);
	                    return dateA - dateB;//sort by date ascending
	                });
	                $scope.newMessage = data;
	                $scope.glued = !$scope.glued;
	                // $scope.messageData = {};
	           //     	for(var item in $scope.Message){
	           //     		if($scope.Message[item].receiver == $scope.profile.username){
		          //      		MessageService.addReader($scope.Message[item].id, $scope.profile.username).success(function(data) {
			        	// 		console.log("read berhasil");
			        	// 		console.log($scope.Message[item].content);
			        	// 	}).error(function(data) {});
			        	// }	
	      //          		console.log($scope.Message[item].id);
	      //          		if($scope.Message[item].receiver == $scope.profile.username){
	      //          			$scope.messageData.readStatus = true;
			    //     		console.log($scope.messageData.readStatus);
			    //     		MessageService.editMessageById($scope.Message[item].id,localStorage.getItem("token"),$scope.messageData).success(function(data) {
							// 	console.log('asasdasd asdasdasda sdasd');
							// 	$ionicLoading.hide();
							// }).error(function(data) {
							// 	$ionicLoading.hide();
							// });
	      //          		}
	               	// }
	          //       MessageService.addReader(data.id, $scope.profile.username).success(function(data) {
	        		// console.log("testing berhasil");
	        		// }).error(function(data) {});
            	}).error(function(data) {});
       
            };
            window.onload = $scope.getMessage;
            $scope.myVar = setInterval($scope.getMessage, 500);
            // window.onload = function(){
            // 	getMessage();
            // 	setTimeout(getMessage, 100);
            // };
            $scope.addMessage = function() {
                // $ionicLoading.show({
                //     content: 'Login...',
                //     animation: 'fade-in',
                //     showBackdrop: true,
                // });
                $scope.newMessage.push($scope.dataMessage);
                $scope.dataMessage.id = rndString;
                $scope.dataMessage.sender = $scope.profile.username;
                $scope.dataMessage.receiver = $scope.otherProfile.username;
                $scope.dataMessage.sender_name = $scope.profile.username;
                $scope.dataMessage.receiver_name = $scope.otherProfile.username;
                $scope.dataMessage.photo = $scope.otherProfile.photo;
                $scope.dataMessage.date = moment().format();
                $scope.dataMessage.read = "false";
                console.log($scope.dataMessage);
                MessageService.addMessage($scope.dataMessage).success(function(data) {
                    // Reset input text message to null
                    for(var i = 1; i < stringlength; i++){
						var rndNum = Math.ceil(Math.random() * stringArray.length) - 1;
						rndString = rndString + stringArray[rndNum];
					}

                    console.log("berhassississisisis");
                    console.log(data);
                    $scope.dataMessage.content = '';
                    $ionicLoading.hide();
                }).error(function(data) {});
            };
        }).error(function(data) {});
    }).error(function(data) {});
    $scope.back = function() { // kembali ke halaman home
		clearInterval($scope.myVar);
		$state.go('app.chat');
	};
})

.controller('Forgot_passwordCtrl', function($scope, $state, $ionicPopup, $ionicPlatform, $ionicLoading) {
		//implement logic here
	});

