

angular.module('startApp', []).controller('startController', function ($scope, $http) {


    angular.element(document).ready(function () {
        var series = [{ Name: "Game of Thrones", Season: 2, Episode: 1 },
{ Name: "The Big Bang Theory", Season: 2, Episode: 1 },
{ Name: "The Blacklist", Season: 1, Episode: 3 },
{ Name: "Prison Break", Season: 2, Episode: 2 }];


        $scope.count = function (array) {
            var c = 0;
            for (var i = 0; i < array.lenght; i++) {
                c++;
            }
            return c;
        };
        $scope.lists = {};
        getSeries();
        $scope.seriesArray = [];

        // $scope.series = series;
        function getSeries() {
            var sData = {};
            var sslist = [];
            for (var i = 0; i < series.length; i++) {
                $http.get("http://www.omdbapi.com/?t=" + series[i].Name + "+&y=&plot=short&r=json")
                .then(function (response) {
                    sData = response.data;
                    var s = getSeason(sData.Title);
                    var e = getEpisode(sData.Title)
                    sslist = seasonList(sData.totalSeasons);
                    var element = { data: sData, sNumber: sslist, season: s, e: e.toString() }
                    $scope.seriesArray.push(element);
                    $scope.change(sData.Title, element.season);


                });
            }
        }
        function getEpisode(title) {
            var i = series.findIndex(x => x.Name == title);
            return series[i].Episode;
        };
        function getSeason(title) {
            var i = series.findIndex(x => x.Name == title);
            return series[i].Season;
        };

        $scope.change = function (serie, index) {
            $http.get("http://www.omdbapi.com/?t=" + serie + "+&Season=" + index)
          .then(function (response) {
              var data = response.data;
              for (var i = 0; i < $scope.seriesArray.length; i++) {
                  if ($scope.seriesArray[i].data.Title == serie) {
                      $scope.seriesArray[i].episodes = data.Episodes;
                   
                  }
              }

          });

        }

        $scope.remove = function (index) {

            $scope.seriesArray.splice(index, 1);
        }

        $scope.update = function (movie) {
            $scope.search = movie.Title;
        };
        $scope.slist = [];
        function seasonList(numberofSeason) {
            var list = [];
            for (var i = 1; i <= numberofSeason; i++) {

                list.push(i);

            }
            return list;

        };

        $scope.addEpisode = function (serie, episode) {
            for (var i = 0; i < $scope.seriesArray.length; i++) {
                if ($scope.seriesArray[i].data.Title == serie) {
                    var maxEpisodes = Object.keys($scope.seriesArray[i].episodes).length
            
                    if (maxEpisodes == parseInt(episode)) {
                        $scope.seriesArray[i].e = "1";
                      var s =  $scope.seriesArray[i].season
                      $scope.seriesArray[i].season = ++s;
                      $scope.change($scope.seriesArray[i].data.Title, $scope.seriesArray[i].season);
                    }
                    else {
                        var e = ++episode;
                        $scope.seriesArray[i].e = e.toString();
                    }
                 
                    
                }
            };
        };

    });
});
