//find minimum of width/length of window to make a square a canvas
var minlength = Math.min(window.innerWidth,window.innerHeight);

var mainColor = "#42d7f4"; //all other color
var sessionColor="#04e52d"; //session theme
var breakColor = "red"; //break theme
var breakTime = 5;	//default break time
var sessionTime= 25;	//default session time
var timerSwitch=false;	//on only if timer is active
var updateInterval = 1000;	//set interval parameter for updatinng timer ms
//audio file used to alert user when timer is over
var audio = new Audio('https://dl.dropboxusercontent.com/s/rasjaf7gizwp43b/Electronic_Chime-KevanGC-495939803.mp3?dl=0');
  
$(document).ready(function() {
  resetCanvas();
  });

$("#myCanvas").click(function(e){
   var canvas = document.getElementById('myCanvas');
   //capture X and Y coordinates of click relative to canvas (0,0)
   var clickedX = (e.pageX - $("#myCanvas").offset().left);
   var clickedY =(e.pageY - $("#myCanvas").offset().top);
   
   //define object of clickable areas that have values of true/false based on coordinates
   var clickableObj={
     mBreak : ((clickedX > canvas.width/18) && (clickedX < canvas.width/9) && (clickedY > canvas.width/6.9) && (clickedY < canvas.width/3.8)),
     aBreak : ((clickedX > canvas.width/3.3) && (clickedX < canvas.width/2.65) && (clickedY > canvas.width/6.9) && (clickedY < canvas.width/3.8)),
     mSession : ((clickedX > canvas.width/1.57) && (clickedX < canvas.width/1.45) && (clickedY > canvas.width/6.9) && (clickedY < canvas.width/3.8)),
     aSession : ((clickedX > canvas.width/1.14) && (clickedX < canvas.width/1.05) && (clickedY > canvas.width/6.9) && (clickedY < canvas.width/3.8)),
     tSwitch : ((clickedX > canvas.width/2.3) && (clickedX < canvas.width/1.78) && (clickedY > canvas.width/1.22) && (clickedY < canvas.width/1.06))
   };
   //loop thru object's keys
   for (var key in clickableObj) {
	 //test if key is truly a property and if the property has a true value
     if (clickableObj.hasOwnProperty(key) && clickableObj[key]) {
       //first look for timer switch area to be clicked
       if(key==="tSwitch"){
         if (timerSwitch){//if on then just turn off
           timerSwitch=false;
           resetCanvas();
         }
         else{//if off then turn on, redraw switch and start timer
           timerSwitch=true;
           drawStartStop();
           timerWork();
         }
       }
       else{//if anything else but timer switch is pressed
    	 //only change the variables if the timer is not currently running if it is do nothing
         if(!timerSwitch){
           switch(key){
      	 	   //4 different options to adjust global variables accordingly
               case 'mBreak':
                 if(breakTime>1){breakTime--;}
                 else{breakTime=1;}
                 drawBreakTime();
                 break;
               case 'aBreak':
                 breakTime++;
                 drawBreakTime();
                 break;
               case 'mSession':
                 if(sessionTime>1){sessionTime--;}
                 else{sessionTime=1;}
                 drawSessionTime();
                 break;
               case 'aSession':
                 sessionTime++;
                 drawSessionTime();
                 break;
               default:
                 //console.log("Do Nothing")
            }
         }
       }
     }
   }
});
//following 5 functions are only for drawing on canvas 
function drawStatic() {//draws the static components of canvas
  var canvas = document.getElementById('myCanvas');
  //used for center of circles
  //console.log(canvas.width)
  var centerX = canvas.width/2;
  var centerY = canvas.height*(2/3);
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    //draw outer circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, canvas.width/3.75, Math.PI * .7, Math.PI * 2.3);
    ctx.lineWidth = canvas.width/90;
    ctx.strokeStyle = mainColor;
    ctx.stroke();
    //draw inner circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, canvas.width/5.6, Math.PI * .7, Math.PI * 2.3); // inner circle
    ctx.lineWidth = canvas.width/90;
    ctx.strokeStyle = mainColor;
    ctx.stroke();
    //close concentric circles
    ctx.beginPath();
    ctx.moveTo(canvas.width/2.49, canvas.width/1.235);
    ctx.lineTo(canvas.width/2.93, canvas.width/1.13);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(canvas.width/1.67, canvas.width/1.235);
    ctx.lineTo(canvas.width/1.52, canvas.width/1.14);
    ctx.stroke();
    
    //draw break area 
    ctx.font = (canvas.width/7.5).toString()+ 'px serif';
    ctx.strokeStyle =breakColor;
    ctx.strokeText('+', canvas.width/3.21, canvas.width/3.9);
    ctx.strokeText('-', canvas.width/15, canvas.width/3.9);
    ctx.font = (canvas.width/11.25).toString()+ 'px serif';
    ctx.fillStyle =breakColor;
    ctx.fillText('Break', canvas.width/10, canvas.width/10);
    //draw session area
    ctx.font = (canvas.width/7.5).toString()+ 'px serif';
    ctx.strokeStyle =sessionColor;
    ctx.strokeText('-', canvas.width/1.55, canvas.width/3.9);
    ctx.strokeText('+', canvas.width/1.13, canvas.width/3.9);
    ctx.font = (canvas.width/11.25).toString()+'px serif';
    ctx.fillStyle =sessionColor;
    ctx.fillText(' Work', canvas.width/1.5, canvas.width/10);
    
    //functions below draw the default values at load
    drawBreakTime();
    drawSessionTime();
    drawStartStop();
    //start stop area
    
  }
}
function drawDynamic(radianStart,radiansTravelled,ccw,timeInfo){
  //this function only draws areas that change during the timer running cycle
  var canvas = document.getElementById('myCanvas');
  var centerX = canvas.width/2;
  var centerY = canvas.height*(2/3);
  if (canvas.getContext){
    var ctx = canvas.getContext('2d');
    //draws the progress arc
    ctx.beginPath();
    ctx.arc(centerX, centerY, canvas.width/4.5, radianStart,radiansTravelled,ccw); // Outer circle
    ctx.lineWidth = canvas.width/30;
    ctx.strokeStyle = mainColor;
    ctx.stroke();
    //draws the countdown clock
    ctx.clearRect(canvas.width/2.6, canvas.width/1.6, canvas.width/4.5, canvas.width/9)
    ctx.font = (canvas.width/16).toString()+'px serif';
    if(!ccw){ctx.fillStyle =sessionColor;}
    else{ctx.fillStyle =breakColor;}
    ctx.textBaseline = 'middle';
    ctx.textAlign = "center";
    ctx.fillText(timeInfo, canvas.width/2, canvas.width/1.5);
  }
}
function drawBreakTime(){
  //draws break time , also gets updated when user clicks +/-
  var canvas = document.getElementById('myCanvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(canvas.width/8.2, canvas.width/6, canvas.width/5.6, canvas.width/10.7);
    ctx.font = (canvas.width/11.25).toString()+'px serif';
    ctx.fillStyle =breakColor;
    ctx.textBaseline = 'middle';
    ctx.textAlign = "center";
    ctx.fillText(breakTime, canvas.width/4.8, canvas.width/4.5);
  }
}
function drawSessionTime(){
  //draws session time , also gets updated when user clicks +/-
  var canvas = document.getElementById('myCanvas');
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(canvas.width/1.4, canvas.width/5.6, canvas.width/5.9, canvas.width/11.2);
    ctx.font = (canvas.width/11.25).toString()+'px serif';
    ctx.fillStyle =sessionColor;
    ctx.textBaseline = 'middle';
    ctx.textAlign = "center";
    ctx.fillText(sessionTime, canvas.width/1.25, canvas.width/4.5);
  }
}
function drawStartStop(){
  //draws the timer start/stop symbol accepts current state of timer as param
  var canvas = document.getElementById('myCanvas');
  if (canvas.getContext) {
	  var ctx = canvas.getContext('2d');
  	
    if (timerSwitch){
      ctx.font = (canvas.width/9).toString()+'px FontAwesome';
      ctx.textBaseline = 'middle';
      ctx.textAlign = "center";
      ctx.clearRect(canvas.width/2.3, canvas.width/1.2, canvas.width/8.2, canvas.width/8.2);
      ctx.fillStyle =breakColor;
      ctx.fillText("\uf00d", canvas.width/2, canvas.width/1.14);
      
    }
    else{
      ctx.font = (canvas.width/9).toString()+'px FontAwesome';
      ctx.textBaseline = 'middle';
      ctx.textAlign = "center";
      ctx.fillStyle =sessionColor;
      ctx.fillText("\uf00c", canvas.width/2, canvas.width/1.14);
    }
  }
}
function timerWork(){
  //function starts the timer for the work session
  var radianStart = Math.PI * 0.7;	//position of arc to start
  var totalTimeMs = sessionTime*60000;	//convert total session time to MS
  var totalAngleRadians =Math.PI * 2.3;	//position of arc end
  var radiansTravelled=radianStart;	//var for arc travel
  //interval computed for arc travel
  var radiansInterval=((totalAngleRadians-radianStart)*updateInterval)/(totalTimeMs);
  var workID; //session timer ID
  
  function workCallBack(){//call back function for timer
	//only run if Switch is on
    if(timerSwitch){
    	//run updates as long as timer is above 0
        if(totalTimeMs>0){
	        totalTimeMs-=updateInterval;//update clock
	        radiansTravelled+=radiansInterval;//update arc progress
	        //moment is a time formatting library I imported that easily converts milliseconds to-->
	        //make a slight exception for durations > 1 hour
	        if(totalTimeMs>3600000){//for greater than 1 hour
	        	var formattedTime = moment.duration(totalTimeMs).hours() +":" +moment(totalTimeMs).format("mm:ss");
	        }
	        else{//for less than 1 hour
	        	var formattedTime = moment(totalTimeMs).format("mm:ss");
	        }
        	//send data to dynamic drawing, note clause for fully closing arc if time is almost over
	        if((totalTimeMs-updateInterval)<=0){
	          drawDynamic(radianStart,totalAngleRadians,false,formattedTime);
	        }
	        else{
	          drawDynamic(radianStart,radiansTravelled,false,formattedTime);
	        }
        }
	    else{//if timer is over
	        clearInterval(workID);//kill timer
	        audio.play();//play sound
	        resetCanvas();//clear canvas
	        timerBreak();//start break timer
	      }
    }
    else{//if switch is off
      clearInterval(workID);//kill timer
      resetCanvas();//clear canvas
    }
  }
  //start timer with call back and interval as parametrs and returns value which
  //will be used to kill timer
  workID = setInterval(workCallBack, updateInterval);
}
function timerBreak(){
  //function starts the timer for the break session
  //pretty much identical with work session except for arc progression direction
  //would like to combine to one function if it will not complicate it 
  var radianStart = Math.PI*2.3;
  var totalTimeMs = breakTime*60000;
  var totalAngleRadians =Math.PI*0.7;
  var radiansTravelled=radianStart;
  var radiansInterval=((radianStart-totalAngleRadians)*updateInterval)/(totalTimeMs);
  var breakID;
  
  function breakCallBack(){
    if(timerSwitch){
      if(totalTimeMs>0){
        totalTimeMs-=updateInterval;
        radiansTravelled-=radiansInterval;
        //moment is a time formatting library I imported that easily converts milliseconds to-->
        //make a slight exception for durations > 1 hour
        if(totalTimeMs>3600000){//for greater than 1 hour
        	var formattedTime = moment.duration(totalTimeMs).hours() +":" +moment(totalTimeMs).format("mm:ss");
        }
        else{//for less than 1 hour
        	var formattedTime = moment(totalTimeMs).format("mm:ss");
        }
        //note true parameter sent to arc drawing , means counterclockwise
        if((totalTimeMs-updateInterval)<=0){
          drawDynamic(radianStart,totalAngleRadians,true,formattedTime);
        }
        else{
          drawDynamic(radianStart,radiansTravelled,true,formattedTime);
        }
      }
      else{
        clearInterval(breakID);
        audio.play();
        resetCanvas();
        timerWork();//start work timer
      }
    }
    else{
      clearInterval(breakID);
      resetCanvas();
    }
  }
  breakID = setInterval(breakCallBack, updateInterval);
}

function resetCanvas(){
  //resets canvas back to original state
  var canvas = document.getElementById('myCanvas');
  //make canvas square dims a proportion of min window size, all other dimensions will be based of this size
  canvas.width=minlength*0.9;
  canvas.height=minlength*0.9;
  canvas.style.backgroundColor = "black";
  if (canvas.getContext) {
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.fillStyle = 'rgb(200, 0, 0)';
    //ctx.fillRect(175, 250, 100, 50);
  }
  drawStatic();
}