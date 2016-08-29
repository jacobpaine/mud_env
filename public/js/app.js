angular.module("contactsApp", ['ngRoute'])
    .config(function($routeProvider) {
        $routeProvider
            // route for the rooms pages
            .when("/", {
                templateUrl: "rooms/room_list.html",
                controller: "FrontPageController",
                resolve: {
                    // images: function(ImageService){
                    //   return ImageService.getImage();
                    // },
                    rooms: function(RoomsService) {
                        return RoomsService.getRooms();
                    }
                }
            })
            .when('/rooms/:roomId', {
              templateUrl : 'rooms/room_temp.html',
              controller  : 'MoveController',
              resolve: {
                rooms: function(RoomsService) {
                  console.log("rooms resolve happens");
                  return RoomsService.getRooms();
                }
              }
            })
            .otherwise({
                redirectTo: "/"
            })
    })
    // .service("ImageService", function($http) {
    //   console.log("ImageService online");
    //     this.getImage = function() {
    //       return $http.get("/uploads").
    //       then(function(response) {
    //           return response;
    //       }, function(response) {
    //           alert("Error finding images.");
    //       });
    //     }
    // })
    .service("RoomsService", function($http) {
      console.log("RoomsService online");
        this.getRooms = function() {
            return $http.get("/rooms").
                then(function(response) {
                    return response;
                }, function(response) {
                    alert("Error finding rooms.");
                });
        }
        this.getRoom = function(roomId) {
          var url = "/rooms/" + roomId;
          console.log("roomId", roomId);
          return $http.get(url).
              then(function(response) {
                  return response;
              }, function(response) {
                  alert("Error finding this contact.");
              });
        }
    })
    .controller("FrontPageController", function($scope, $routeParams, $location){
      console.log("FrontPageController online");
    })
    .controller("MoveController", function($scope, $routeParams, rooms, $location)  {
      var roomsData = rooms.data;
      console.log("rooms", rooms);
      var room_num = parseInt($routeParams.roomId, 10);
      $scope.room_id = $routeParams.roomId;
      $scope.rooms = rooms.data;
      $scope.room_num = parseInt($routeParams.roomId, 10);

      document.getElementById("primaryInputBox").focus();
      // This receives all input in the primaryInputBox
      $scope.inputFunc = function(text) {
        var thisRoomNumber = $routeParams.roomId;
        for ( prop in roomsData ) {
          if (roomsData[prop].roomName === "room"+thisRoomNumber){

            // This controls all available directions in the entire game.
            // The grid is plus/minus 1 horizontal & plus/minus 10 vertical.
            // The grid must change for wider than 20 rooms across.
            // In other words, +100 or +1000 when moving north, etc.

            // It also controls all the items in a room desc.
            // Likely the directions will be thrown into arrays later.

            // Find the directions in the database.
            var northValue = roomsData[prop].exit.north;
            var southValue = roomsData[prop].exit.south;
            var eastValue = roomsData[prop].exit.east;
            var westValue = roomsData[prop].exit.west;

            //Alternate keys for same directions
            var northKey = (text === 'north' || text === 'n');
            var southKey = (text === 'south' || text === 's');
            var eastKey = (text === 'east' || text === 'e');
            var westKey = (text === 'west' || text === 'w');
            var lookKey = ("look" || "l");
            // Error handling for blanks.
            if (text === undefined){
              text = " ";
              $scope.gameMessage = "What are you trying to do?";
              return;
            }
            var splitCmd = text.split(' ');
            var cmdKey = splitCmd[0];
            // Syntax handling for prepositions
            // For 'look bear'
            if (splitCmd[1] !== "at"){
              var objectKey = splitCmd[1];
            // For 'look at bear'
            } else if (splitCmd[2] !== "the"){
              var objectKey = splitCmd[2];
            // For 'look at the bear'
            } else {
              var objectKey = splitCmd[3];
            }


              // If the input matches a possible direction from the database
            if (northKey && northValue === true){
              var newRoom = (room_num + 10).toString();
              $location.path('rooms/' + newRoom);
              return;
            } else if (southKey && southValue === true){
              var newRoom = (room_num - 10).toString();
              $location.path('rooms/' + newRoom);
              return;
            } else if (eastKey && eastValue === true){
              var newRoom = (room_num + 1).toString();
              $location.path('rooms/' + newRoom);
              return;
            } else if (westKey && westValue === true){
              var newRoom = (room_num - 1).toString();
              $location.path('rooms/' + newRoom);
              return;
            } else if ((cmdKey === lookKey) && objectKey ) {
              $scope.gameMessage = roomsData[prop].item[objectKey];
              return;
            } else {
              $scope.gameMessage = "You can't do that.";
              document.getElementById("primaryInputBox").value=null;
              return;
            }
            }
          }
        }
      });