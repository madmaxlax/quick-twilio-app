/// <reference path="C:\Apps\Dropbox\Dev\typings\angularjs\angular.d.ts" />

//quick enhancement to add the length to objects, not just arrays
// Object.prototype._length = function () {
//   return Object.keys(this).length;
// };

(function () {
    var app = angular.module('myapp', ['ngResource', 'ngMaterial']);
    angular.module('myapp').config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('default')
            //choose colors at https://material.angularjs.org/1.1.4/demo/colors
            .primaryPalette('light-green')
            .accentPalette('deep-orange');
    });
    angular.module('myapp').controller('appController', ['$scope', '$http', '$window', '$resource', '$filter', '$mdSidenav', '$mdDialog', '$mdToast', function ($scope, $http, $window, $resource, $filter, $mdSidenav, $mdDialog, $mdToast) {
        $scope.toggleLeft = function () {
            $mdSidenav('left').toggle();
        };



        //function to reset the databases
        $scope.resetDatabase = function () {
            if (confirm('This will delete all visits. Are you sure?')) {
                if (confirm('Are you really sure?')) {
                    $http.delete('./resettables').
                        then(function (data, status, headers, config) {
                            alert('Tables reset. Refreshing page');
                            location.reload();
                        }).catch(function (data, status, headers, config) {
                            console.log("Error deleting tables", status, data);
                        });
                }
            }
        }
        
        //function to get all the users and put it in the variable
        $scope.getUsers = function(){
        $http.get('./user/').
            then(function (data, status, headers, config) {
                //console.log(data);
                $scope.allUsers = data.data;
            }).catch(function (data, status, headers, config) {
                console.log("Error getting users " + status);
          });
        };
      //then call it right to start
      $scope.getUsers();

      $scope.createUser = function (FirstName, LastName, MobilePhone) {
          $http({
              method: 'POST',
              url: './user',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              transformRequest: function (obj) {
                  var str = [];
                  for (var p in obj)
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
              },
              data: {
                  FirstName: FirstName,
                  LastName: LastName,
                  MobilePhone: MobilePhone
              }
          }).
              //$http.post(, {city:city,state:ST}).
              then(function (data, status, headers, config) {
            $mdToast.showSimple('Created new user!');
                //re-get all the users
                $scope.getUsers();
            //clear the newuser var
            $scope.newUser = {};

              }).catch(function (data, status, headers, config) {
                alert("Error creating user, see console");  
                console.log("Error creating user ", data);
              });
      };
      $scope.editAUser = function (user_id, FirstName, LastName, MobilePhone) {
          $http({
              method: 'PUT',
              url: './user',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              transformRequest: function (obj) {
                  var str = [];
                  for (var p in obj)
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
              },
              data: {
                  user_id: user_id,
                  FirstName: FirstName,
                  LastName: LastName,
                  MobilePhone: MobilePhone
              }
          }).
              //$http.post(, {city:city,state:ST}).
              then(function (data, status, headers, config) {
                $mdToast.showSimple('Edited user!');
                //re-get all the users
                $scope.getUsers();
                //clear the edituser var
                $scope.editUser = {};

              }).catch(function (data, status, headers, config) {
                alert("Error creating user, see console");  
                console.log("Error editing user ", data);
              });
      };
      $scope.deleteUser = function (user_id) {
          $http({
              method: 'DELETE',
              url: './user',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              transformRequest: function (obj) {
                  var str = [];
                  for (var p in obj)
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
              },
              data: {
                  user_id: user_id
              }
          }).
              //$http.post(, {city:city,state:ST}).
              then(function (data, status, headers, config) {
                $mdToast.showSimple('Successfully deleted user!');
                //re-get all the users
                $scope.getUsers();

              }).catch(function (data, status, headers, config) {
                alert("Error deleting user, see console");  
                console.log("Error deleting user ", data);
              });
        };
      
      $scope.directMessage = function(user_id){
        $scope.allUsers.forEach(function(user){
          if(user.user_id !== user_id){
            user.selected = false;
          }
          if(user.user_id === user_id){
            user.selected = true;
          }
        });
      };
      
      $scope.sendMessage = function(selectedUsers,messageBody){
        //set up numbers array
        var MobilePhone = null;
        if(selectedUsers.length===1){
          MobilePhone = selectedUsers[0].MobilePhone;
        }
        else{ // group message, set up an array of the mobile phones to text
          MobilePhone = [];
          selectedUsers.forEach(function(user){
            MobilePhone.push(user.MobilePhone);
          });
        }
        $http({
              method: 'POST',
              url: './sendmessage',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              transformRequest: function (obj) {
                  var str = [];
                  for (var p in obj)
                      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                  return str.join("&");
              },
              data: {
                  MobilePhone: MobilePhone,
                  MessageBody: messageBody
              }
          }).
              //$http.post(, {city:city,state:ST}).
              then(function (data, status, headers, config) {
            $mdToast.showSimple('Message Sent!');
                //reset message body
                $scope.messageBody = '';
            

              }).catch(function (data, status, headers, config) {
                alert("Error sending message, see console");  
                console.log("Error sending message ", data);
              });
      };
    }]);
})();