$(document).ready(function(){
$output = "";
$lat = "";
$long = "";
$apiURl = "";
$toStringWeather = "";
$temp = "";
$counter = 2;
var arr = [];
var MinAndMax = 0;

$.getJSON('http://ip-api.com/json', function(data) { 
	console.log(data);
lat = data.lat;
long = data.lon;
apiURl = "http://api.openweathermap.org/data/2.5/weather?lat="+lat+"&lon="+long+"&units=metric&APPID=9831e8cfbb31cc22a052364d2d9dc1c8";

$.getJSON(apiURl,function(json) {
$(".weather").html(JSON.stringify(json));
$location = " You are located in: <strong>Country:</strong> " + json.sys["country"] + " <strong>City:</strong>  " + json.name;
console.log($location);
$weather = " The weather in your area is currently: " +json.weather[0].main;
$temp = json.main["temp"];
var iconCode = json.weather[0].icon;
$joined = $location + "<br>"  + $weather + "<br>";
var iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";
$(".icon").html("<img src='http://openweathermap.org/img/w/" + json.weather[0].icon + ".png' alt='Icon depicting current weather.'>");
$(".weather").html("<p>" + $joined +  "</p>");
$(".temp").html("The temperature in your area is currently: " + $temp + " C degrees");
	});
}); 

//grabbing cities from API and populating dropdown list
$.getJSON("data/Cities.json", function(data) {
	var counter = 0;
	var values = Object.values(data.Canada);
     $.each(data.Canada, function() {
              $('#citylist').append($("<option></option>").text(values[counter]).attr('value', values[counter]));
              arr.push(values[counter]);
              counter++;
     });
 });

//grabbing and displaying value for the selected key in dropdown list
$("#citylist").change(function() {
  $.getJSON("http://api.apixu.com/v1/current.json?key=ae3812a09f0d424baa5204935170608&q=" + $("#citylist").val(), function(info) {
  	var cityTemp = Object.values(info.current);
  	$(".temp").html("The weather in " + $("#citylist").val() + " is currently: " + cityTemp[2] + "°C");
  });
  $.getJSON("http://api.openweathermap.org/data/2.5/weather?q=" + $("#citylist").val() + "&appid=39d052f64dd7a7849804089453587637", function(data) {
  	MinAndMax = Object.values(data.main);
  	var ctx = document.getElementById("myChart").getContext('2d');
  	var myChart = new Chart(ctx, {
  		type: 'bar',
  		data: {
  			labels: ["Min", "Max"],
  			datasets: [{
  				label: 'Minimum and Maximum weather for today',
  				data: [MinAndMax[3] - 273.15, MinAndMax[4] - 273.15],
  				backgroundColor: [
  				'rgba(255, 99, 132, 0.2)',
  				'rgba(54, 162, 235, 0.2)'
  				],
  				borderColor: [
  				'rgba(255,99,132,1)',
  				'rgba(54, 162, 235, 1)'
  				],
  				borderWidth: 1
  			}]
  		},
  		options: {
  			scales: {
  				yAxes: [{
  					ticks: {
  						beginAtZero:true
  					}
  				}]
  			}
  		}
  	});
  })
});

//grabbing and displaying value from the textbox (autocomplete)
$("#citysearch").autocomplete({
	source: arr,
	select: function (event, ui) {
		$.getJSON("http://api.apixu.com/v1/current.json?key=ae3812a09f0d424baa5204935170608&q=" + ui.item.label, function(info) {
			$("#dropdownvalue").hide();
			var cityTemp = Object.values(info.current);
			$(".temp").html("The weather in " + ui.item.label + " is currently: " + cityTemp[2] + "°C");
		});
		$.getJSON("http://api.openweathermap.org/data/2.5/weather?q=" + ui.item.label + "&appid=39d052f64dd7a7849804089453587637", function(data) {
			MinAndMax = Object.values(data.main);
			var ctx = document.getElementById("myChart").getContext('2d');
			var myChart = new Chart(ctx, {
				type: 'bar',
				data: {
					labels: ["Min", "Max"],
					datasets: [{
						label: 'Minimum and Maximum weather for today',
						data: [MinAndMax[3] - 273.15, MinAndMax[4] - 273.15],
						backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)'
						],
						borderColor: [
						'rgba(255,99,132,1)',
						'rgba(54, 162, 235, 1)'
						],
						borderWidth: 1
					}]
				},
				options: {
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero:true
							}
						}]
					}
				}
			});
		})
	}
});

$(document).on('click', '.switch', function() {
	x = $temp * 1.8+32;
	console.log(x);
	if ($counter % 2 == 0) {
	$(".temp").html("The temperature in your area is currently: " + x + " F degrees");	
	$counter++;}
		else {
	$(".temp").html("The temperature in your area is currently: " + $temp + " C degrees");
	$counter++;
		}
	});
});

