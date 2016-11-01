var app = angular.module("myApp",["ng-fusioncharts","ngCookies"])
//var dx_call ='';
//var clusternameInput = element(by.binding('cluster.address'));

app.controller('timecontrl', function ($scope,$cookies, $cookieStore,  $window,$http, $timeout, $interval) {
    
    var resturl = "http://91.156.132.50:8081/" ;
//var resturl = "http://192.168.1.52:8081/" ;

   var now = new Date();
    var  exp = new Date(now.getFullYear()+1, now.getMonth(), now.getDate());
    
  if($cookies.get('mode') != null){
                    $scope.txMode = {mode: $cookies.get('mode') };}
            else {  $scope.txMode = {mode: 'RTTY' };}
    
         $scope.modes =["CW","RTTY","PSK31","PSK63"];
    
      if($cookies.get('cont') != null){
                    $scope.cont = {cont: $cookies.get('cont') };}
            else {  $scope.cont = {cont: 'RTTY' };}
    
         $scope.conts =["EU","NA","SA","AS","OC"];
    
    if($cookies.get('clust') != null){
                    $scope.clust = {clust: $cookies.get('clust') };}
            else {  $scope.clusts = {clust: 'RBN' };}
    
         $scope.cluts =["RBN","OH2BBT","dongle"];
    

      $scope.attrs = {
        startingangle: "120",
        showlabels: "1",
        showlegend: "0",
        enablemultislicing: "0",
        slicingdistance: "15",
        showpercentvalues: "1",
        showpercentintooltip: "0",
        "paletteColors": "#e2e7ea",

        theme: "fint"
          
    };
     $scope.avg_attrs = {
        "caption": "Average SNR",
        theme: "zune"
          
    };
          $scope.band = {data:[{label: "null",value: "0"}]};
          $scope.countries ={"caption": "COUNTRIES FROM LAST HOUR","showValues": "1"},{data:[{label: "null",value: "0"}]};
    
     $scope.cumul = {
           data:[{
        label: "null",
        value: "0"
        }]
  };
    
     $scope.averagesnr = {
           data:[{
        label: "",
        value: "0"
        }]
  };
                   
                   
    $scope.count = 0;
    $scope.ajaxPeriodicall = function() {
        modejson = JSON.stringify($scope.txMode );
        modeparse = JSON.parse(modejson);
          var mode = modeparse.mode;
        
         contjson = JSON.stringify($scope.cont );
        contparse = JSON.parse(contjson);
          var de_continent = contparse.cont;
        
        clustjson = JSON.stringify($scope.clust );
        clustparse = JSON.parse(clustjson);
          var cluster = clustparse.clust;
        
          var dx = document.getElementById("dx").value;
        var filter= document.getElementById("filter on").checked;
        var band = document.getElementById("band").value;
   
      
        
        $cookies.put('clust',cluster,{  expires: exp });
        $cookies.put('cont',contparse.cont,{  expires: exp });
     $cookies.put('mode',modeparse.mode,{  expires: exp });
        $scope.cookietechnology = $cookies.get('clust');
        
      // console.log(contparse.cont);
        
        //var dxcall = $scope.dxcall;
          var dxselection ='';
         if (dx == 'DX'){dxselection=de_continent};
         if (dx == 'ALL'){dxselection=''};
        
        var bandselection ='';
         
         if (band == 'ALL'){bandselection=''};
        bandselection = band;
        
     
      var  url = resturl + "countrycount?id=";
       


        url = url + cluster ;
        url = url+ "&decont=" + de_continent ;
        url = url + "&mode=" + mode ;
        
  
        
        $http.get(url).
         success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            //$scope.count = $scope.count + 1;
            $scope.countries = data;
            var d = new Date();
             $scope.clock = d.toDateString() + " " + d.getHours() + ":" + d.getMinutes() ;
            var time = d.toDateString() + " " + d.getHours() + ":" + d.getMinutes() ;
           
            
         }); 
        
      
     var url2 = resturl + "bandcount?id=";
        url2 = url2 + cluster ;
            url2 = url2+ "&decont=" + de_continent ;
         url2 = url2 + "&mode=" + mode ;
          $http.get(url2).
         success(function(data, status, headers, config) {
           
              $scope.band = data; 
              $scope.attrs = {
       
    };  
                        
         });
       
    var url3 = resturl + "cumul?id=";
      url3 = url3 + cluster ;
        url3 = url3+ "&decont=" + de_continent ;
         url3 = url3 + "&mode=" + mode ;
          $http.get(url3).
         success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.cumul = data;
                 
            
          
            
         }); 
        
         var url4 = resturl + "rows?id=";
      url4 = url4 + cluster ;
        url4 = url4+ "&decont=" + de_continent ;
        url4 = url4 + "&mode=" + mode ;
         url4 = url4+ "&dxfrom=" + dxselection ;
         url4 = url4+ "&band=" + bandselection ;
        console.log(url4);
       $http.get(url4).
         success(function(data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $scope.rows = data;
                 }); 
        
        
          //console.log($scope.dx_call);
      //var dxcall = '';
       
      
      if (filter) {
       
        var dx = $scope.dx_call;
          if (dx == ''){dx = '.'};
            var dxcall = dx.toUpperCase(); 
          dxcall = dxcall + "%";
                   
        var url5 = resturl + "dxrows?id=";
        url5 = url5 + cluster ;
        url5 = url5+ "&dxcall=" + dxcall ;
          url5 = encodeURI(url5);
          url5 = url5+ "&decont=" + de_continent ;
          url5 = url5+ "&mode=" + mode ;
          //  console.log(url5);
        $http.get(url5).
        success(function(data, status, headers, config) {
        // this callback will be called asynchronously
        // when the response is available
        $scope.dxrows = data;
                }); 
          
               
          
      }
         if (!filter) {
             $scope.dxrows = '';
         }
        
    
      
    };
    
      
    $scope.start = function() {
        
        
       $scope.myCall = $interval($scope.ajaxPeriodicall, 3000);    
           
        


    };

    $scope.stop = function() {
       $interval.cancel($scope.myCall);   
    };
    
    
    
})