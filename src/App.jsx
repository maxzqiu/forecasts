import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
    let [localTime,setLocalTime]=useState("React JS must be enabled. ");
    let [utcTime,setUtcTime]=useState("React JS must be enabled. ");
    let [location,setLocation]=useState("Newport Beach")
    const days=["Sunday","Sunday Night","Monday","Monday Night","Tuesday","Tuesday Night","Wednesday","Wednesday Night","Thursday","Thursday Night","Friday","Friday Night","Saturday","Saturday Night"];
    const day_to_shorter={
      "Sunday":"Sun",
      "Sunday Night":"Sun Night",
      "Monday":"Mon",
      "Monday Night":"Mon Night",
      "Tuesday":"Tue",
      "Tuesday Night":"Tue Night",
      "Wednesday":"Wed",
      "Wednesday Night":"Wed Night",
      "Thursday":"Thu",
      "Thursday Night":"Thu Night",
      "Friday":"Fri",
      "Friday Night":"Fri Night",
      "Saturday":"Sat",
      "Saturday Night":"Sat Night",
    }
    function noQuotations(str){
      return str.substring(1,str.length-1)
    }
    function makeDateShorter(longDate){
      longDate=longDate.substring(1,longDate.length-1)
      let isADate=false;
      console.log(longDate);
      for (let i of days){
        
        if (i==longDate){
          isADate=true;
        }
      }
      console.log(isADate);
      if (isADate===false){
        return longDate;
      } else {
        console.log(day_to_shorter[longDate]);
        return day_to_shorter[longDate];
      }
      
    }
    
    //setInterval(getUTCTime,1000);
    
    const canvasRef=useRef(null);
    
    let [LINK,setLINK]=useState("https://api.weather.gov/gridpoints/SGX/38,57/forecast")
    useEffect(
        
      () => {
        function getLocalTime(){
          setLocalTime(new Date().toString())
        }
        function getUTCTime(){
          let time=(new Date().toUTCString().substring(17,26))
          setUtcTime(time)
        }
        setInterval(getUTCTime,1000)
        setInterval(getLocalTime,1000);
          const canvas=canvasRef.current;
          const ctx=canvas.getContext("2d");
          canvas.width=window.innerWidth;
          canvas.height=window.innerHeight;
          
          const width=canvas.width;
          const height=canvas.height;
          console.log(width);
          console.log(height);
          
          console.log(new Date().toUTCString());
          async function fetchWeather() {
            ctx.clearRect(0,0,500,500)
            ctx.stroke();
            //ctx.strokeStyle="#64e864"; light green
            //ctx.strokeStyle="#05d1f5"; light blue
            //ctx.strokeStyle="#0c7feb"; blue
            //ctx.strokeStyle="#0c38eb" // dark blue
            
            let res = await fetch(LINK);
            let data = await res.json();
            console.log(data);
            if (width<400){
              ctx.font="5px Lato";
            } else if (width<600){
              ctx.font="8px Lato"
            } else if (width<800){
              ctx.font="10px Lato"
            } else if (width<1000){
              ctx.font="12px Lato"
            } else if (width<1200){
              ctx.font="14px Lato"
            } else {
              ctx.font="16px Lato"
            }
            
            ctx.strokeText("LAST UPDATED: "+data.properties.updateTime+" UTC", 50,50)
            ctx.strokeText("Forecast Valid at "+location+".",0,25)
            for (let i=0;i<14;i+=1){
              ctx.strokeText(makeDateShorter(JSON.stringify(data.properties.periods[i].name)),width*(i+1)/15,100)
              ctx.stroke()
            }
            ctx.strokeText("Day --->",0,100);
            ctx.stroke();
            for (let i=0;i<14;i+=1){
              if (data.properties.periods[i].isDaytime){
                ctx.strokeStyle="red"
              } else {
                ctx.strokeStyle="blue"
              }
              ctx.strokeText(JSON.stringify(data.properties.periods[i].temperature),width*(i+1)/15,150)
              ctx.stroke()
              ctx.strokeStyle="black"
            }
            ctx.strokeText("High/Low",0,150);
            ctx.stroke();
            for (let i=0;i<14;i+=1){
              
              if (JSON.stringify(data.properties.periods[i].probabilityOfPrecipitation.value)==="null"){
                ctx.strokeStyle="black";
                ctx.strokeText("0",width*(i+1)/15,200)
                ctx.stroke();
              } else {
                if (data.properties.periods[i].probabilityOfPrecipitation.value<25){
                  ctx.strokeStyle="#64e864"
                } else if (data.properties.periods[i].probabilityOfPrecipitation.value<50) {
                  ctx.strokeStyle="#05d1f5"
                } else if (data.properties.periods[i].probabilityOfPrecipitation.value<75){
                  ctx.strokeStyle="#0c7feb"
                } else {
                  ctx.strokeStyle="#0c38eb"
                }
                ctx.strokeText(JSON.stringify(data.properties.periods[i].probabilityOfPrecipitation.value),width*(i+1)/15,200)
                }
              
              ctx.stroke()
              ctx.strokeStyle="black"
            }
            ctx.strokeText("Prob of Rain",0,200);
            ctx.stroke();
            for (let i=0;i<14;i+=1){
              
              if (JSON.stringify(data.properties.periods[i].windDirection)==="null"){
                ctx.strokeStyle="black";
                ctx.strokeText("Variable",width*(i+1)/15,250)
                ctx.stroke();
              } else {
                
                ctx.strokeText(noQuotations(JSON.stringify(data.properties.periods[i].windDirection)),width*(i+1)/15,250)
                }
              
              ctx.stroke()
              ctx.strokeStyle="black"
            }
            ctx.strokeText("Wind Dir",0,250);
            ctx.stroke();
            for (let i=0;i<14;i+=1){
              
              if (JSON.stringify(data.properties.periods[i].windSpeed)==="null"){
                ctx.strokeStyle="black";
                ctx.strokeText("0",width*(i+1)/15,250)
                ctx.stroke();
              } else {
                
                ctx.strokeText(noQuotations(JSON.stringify(data.properties.periods[i].windSpeed)),width*(i+1)/15,300)
                }
              
              ctx.stroke()
              ctx.strokeStyle="black"
            }
            ctx.strokeText("Wind Spd",0,300);
            ctx.stroke();
            for (let i=0;i<14;i+=1){
              let IMAGE=new Image();
              IMAGE.src=data.properties.periods[i].icon
              ctx.drawImage(IMAGE,width*(i+1)/15,350,50,50)
              
            
            }
            
            
            
          };
          fetchWeather();
          
            
      },
      [LINK]
    );
    return (
      <>  
          <div className="one-line">
            <h1>Max's Weather Service Newport Beach CA</h1>
            <img className="image" src="./Screenshot (1053).png" alt="MWS Logo"></img>
          </div>
          <h2>Online Forecast Service</h2>
          
          <h3>Current UTC Time: {utcTime} UTC</h3>
          <h4>Local Time: {localTime}</h4>
          <div>
            <p>Please select your location: Default is Newport Beach</p>
            <button onClick={()=>{
              setLINK("https://api.weather.gov/gridpoints/SGX/38,57/forecast")
              setLocation("Newport Beach")
            }}>Newport Beach</button>
            <button onClick={()=>{
              setLINK("https://api.weather.gov/gridpoints/LOX/155,45/forecast")
              setLocation("Los Angeles")
            }}>Los Angeles</button>
            <button onClick={()=>{
              setLINK("https://api.weather.gov/gridpoints/LOX/174,44/forecast")
              setLocation("Claremont")
            }}>Claremont</button>
            <button onClick={()=>{
              setLINK("https://api.weather.gov/gridpoints/SGX/89,59/forecast")
              setLocation("Palm Springs International Airport, Palm Springs (KPSP)")
            }}>Palm Springs Intl Apt (KPSP)</button>
          </div>
          <canvas ref={canvasRef} width="500" height="500"></canvas>
          
      </>
    )
}

export default App
