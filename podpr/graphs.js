/* ----------------------------------------- Lin chart ----------------------------------------- */
const Lchart = document.getElementById('myChart')
const labelsL = [""];
const configL = {
  type: 'line',
  data: {
    labels: labelsL,
    "labelTimestamp":[],
    datasets: [
      {
          label: '',
          borderColor: '#ff0000',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          data: [0],
          fill: false,
          borderWidth: 0,
          spanGaps: true,
          tension: 0.1,
      }
      ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        title:{
            display:true,
            text:'Legend'
        }
      },
      title: {
        display: true,
        text: 'CHart.js'
      },
      zoom:{
        zoom:{
          drag:{
            enabled:true
          },
          mode:'x'
        },
      }
    },
    scales:{
          y:{
              suggestedMax:5,
              beginAtZero: true,
              title:{
                  display: true,
                  text:'Ping [ms]',
              },
              min: -1.5,
          },
          x:{
              title:{
                  display: true,
                  text:'Time [h/m/s]',
              },
              ticks:{
                  maxRotation: 90,
                  minRotation: 0,
                  callback: function(label) {
                    let realLabel = this.getLabelForValue(label)
                    return realLabel[0];
                  }
              }
          },
          xAxis2: {
            type: "category",
            title:{
              display: true,
              text:'Time [Y/M/D]',
            },
            ticks:{
              maxRotation: 90,
              minRotation: 40,
              callback: function(label) {
                let realLabel = this.getLabelForValue(label)
                if (realLabel[1] != "") {
                  return realLabel[1];
                }
              }
            },
            
            grid: {
              drawOnChartArea: false, // only want the grid lines for one axis to show up
            }

          },
    },
  },
};//config grafu


var myChart = new Chart(Lchart, configL);


//butons
const load_d = document.getElementById('load_d') 
load_d.addEventListener('click', async () => {
  loadAllDataNew()
})

const resZ = document.getElementById('resetZoom')
resZ.addEventListener('click', ()=>{
  myChart.resetZoom()
})

const lm = document.getElementById('left_m')
lm.addEventListener('click', ()=>{
  myChart.pan({x: 200}, undefined, 'default');
})

const rm = document.getElementById('right_m')
rm.addEventListener('click', ()=>{
  myChart.pan({x: -200}, undefined, 'default');
})



/* ----------------------------------------- Barr chart ----------------------------------------- */


const Bchart = document.getElementById('myBarChart')
const labelsB = [""];

const dataB = {
  labels: labelsB,
  datasets: [
    {
      label: "Passed",
      backgroundColor: ["#3e95cd"],
      data: [0]
    },
    {
      label: "Failed",
      backgroundColor: ["#c45850"],
      data: [0]
    }
  ]
};

const configB = {
  type: 'bar',
  data: dataB,
  options: {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
      }
    },
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'Chart.js Horizontal Bar Chart'
      }
    }
  },
};

var myBarChart = new Chart(Bchart, configB);



/* ----------------------------------------- Polar area chart ----------------------------------------- */

const dataP = {
  labels: [''],
  datasets: [{
    label: 'My First Dataset',
    data: [5],
    backgroundColor: ['rgba(255, 99, 132, 1)'],
    borderColor: 'rgba(255, 99, 132, 0)',
  }]
};

const configP = {
  type: 'polarArea',
  data: dataP,
  options: {
    plugins: {
      legend: {
        position: 'right',
        title:{
            display:true,
            text:'Legend'
        }
      }
    },
    scale: {
      ticks: {
          beginAtZero: false,
          stepSize: 2
      }
    }
  }
};
const Pchart = document.getElementById('myPolarChart')
var myPolarChart = new Chart(Pchart, configP);


/* ----------------------------------------- doughnut loading ----------------------------------------- */ 

const dataD = {
  labels: [
  ],
  datasets: [{
    label: 'My First Dataset',
    data: [],
    backgroundColor: [
    ],
    borderColor: 'rgba(255, 99, 132, 0)',
    hoverOffset: 4
  }]
};

const configD = {
  type: 'doughnut',
  data: dataD,
  options: {
    plugins: {
      legend: {
        position: 'right',
        title:{
            display:true,
            text:'Legend'
        }
      }
    }
  }
};

const Dchart = document.getElementById('myDoughnutChart')
var myDoughnutChart = new Chart(Dchart, configD);




/* ----------------------------------------- init loading ----------------------------------------- */ 
//nastavení délky vykreslovaných dat
var input = document.getElementById("timerMax");
input.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    if (input.value<20){
      console.log(input.value, "to low")
    }
    else{
      console.log(input.value, "new set time")
      refreshTime = input.value
    }
    
  }
});

var input2 = document.getElementById("lenMax");
input2.addEventListener("keypress", function(event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    if (input2.value<100){
      console.log(input2.value, "to low")
    }
    else{
      console.log(input2.value, "new set data len for graph")
      lenLimit = input2.value
    }
    
  }
});






var refreshTime = 60
var lenLimit = 300
var stopTimer = false


window.api.receive("fromMainServerDown", (data) => {
  console.log("down")
  myCheckbox.checked=false
});


var initAutoReload = false;//start auto reload onli on first load

function loadTableData(){
  window.api.send("toMainSettings")//načítá nastavení a všechna data
  window.api.receive("fromMainSettings", (sett) => {
    refreshTime = sett.secsForGraphUpdate
    lenLimit = sett.graphValueCount
    
    input.value = refreshTime
    input2.value = lenLimit
    
    myCheckbox.checked=true

    loadAllDataNew()  // načtení všech dat
    if (!initAutoReload){
      autoReload()
      initAutoReload = true;
    }
    
  })
}

/* ----------------------------------------- auto reload ----------------------------------------- */ 


let lastTime = 0
const myCheckbox = document.getElementById('myCheckbox');

function autoReload(){
  
  t = refreshTime

    timer = document.getElementById('timer')
    
    setInterval(function(){ // renew every sec
      myCheckbox.checked==true?--t:""
      if (t==2){
        timer.innerText = "Time to refresh: " + t + " s"
        if (myBarChart.data.labels.length>1){
          loadDataFrom(lastTime)
        }else{
          loadAllDataNew()
        }
        console.log(myChart.data)
        --t
      }
      if (t==1){
        
        t=refreshTime
      }else{
        timer.innerText = "Time to refresh: " + t + " s"
      }
    }, 1000);//1000
}





function timeConv(time){
  time>lastTime ? lastTime=time:null;
  time = new Date(time)
  var returnedTime = {"YMD":(time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate())
  ,"hms":(time.getHours()+':'+time.getMinutes()+':'+time.getSeconds())}
  return returnedTime
}

var shifted = 0
function dataForGraphs(dataAdd){//write to line graph and get data for other graphs setting it to json from first graph
  var ld = false
  dataAdd.forEach(da => {
    kl = myChart.data.datasets.findIndex(function(item, i){return item.address == da.address})
    if(kl != -1){
      k = (hmsPrews >= Math.floor(da.time/1000))
      hmsPrews!=Math.floor(da.time/1000)?hmsPrews=Math.floor(da.time/1000):hmsPrews;

      var time = timeConv(da.time)
      if (!k){
        if (YMDprews == time.YMD){
          myChart.data.labels.push([time.hms])
        }else{
          myChart.data.labels.push([time.hms,time.YMD])
          YMDprews = time.YMD
        }
        myChart.data.labelTimestamp.push(Math.floor(da.time/1000))
        

        if (myChart.data.labels.length>lenLimit){
          myChart.data.labelTimestamp.shift()
          myChart.data.labels.shift()
          shifted++
        }
        myChart.data.datasets.forEach(element => {
          
          if (element.address==da.address){
            element.data.push(da.value)
            da.value == -1 ? element.failed++:element.passed++;
          }
          else{
            element.data.push(NaN)
          }

          if (element.data.length>lenLimit){
            element.data.shift()
          }
        });
      }
      else{
        myChart.data.datasets.forEach(element => {
          if (element.address==da.address){
            var posAvr = myChart.data.labelTimestamp.findIndex(function(item, i){return item == Math.floor(da.time/1000)})
            element.data[posAvr] = da.value
            da.value == -1 ? element.failed++:element.passed++;
          }
        });
      }
    }
  });
  console.log("%c  Shifted count: "+ shifted +" values is hidden. \n  Graph limit: "+myChart.data.labels.length+"/"+lenLimit, 'color:yellow')
}

function setAndUpdate(firstSett, averageData){
  var B_failed = []
  var B_passed = []

  var P_data = []
  var P_color = []

  var D_data = []
  var D_color = []
  myChart.data.datasets.forEach(element => {
    if (firstSett){
      myBarChart.data.labels.push(element.label)
      myPolarChart.data.labels.push(element.label)
      myDoughnutChart.data.labels.push(element.label)
    }
    else{
      posAvr = averageData.data.findIndex(function(item, i){return item.address == element.address})
      element.average = averageData.data[posAvr].average
    }
    

    B_failed.push(element.failed)
    B_passed.push(element.passed)
  
    
    dcol = element.borderColor
    P_color.push('rgba('+parseInt(dcol[1]+dcol[2], 16)+","+parseInt(dcol[3]+dcol[4], 16)+","+parseInt(dcol[5]+dcol[6], 16)+',0.7)')
    P_data.push(element.average)

    
    D_color.push('rgba('+parseInt(dcol[1]+dcol[2], 16)+","+parseInt(dcol[3]+dcol[4], 16)+","+parseInt(dcol[5]+dcol[6], 16)+',1)')
    D_data.push(element.passed)
  });

/*
  console.log(myChart.data.labels,myChart.data.datasets)
  console.log(myBarChart.data.labels, B_passed, B_failed)
  console.log(myPolarChart.data.labels, P_color, P_data)
  */

  //myChart.data.labels =  myChart.data.labels
  //myChart.data.datasets = myChart.data.datasets
  myChart.update()

  //myBarChart.data.labels =  myBarChart.data.labels
  myBarChart.data.datasets[0].data = B_passed
  myBarChart.data.datasets[1].data = B_failed
  myBarChart.update()

  //myPolarChart.data.labels =  myPolarChart.data.labels
  myPolarChart.data.datasets =  [{
    backgroundColor: P_color,
    borderColor: 'rgba(255, 99, 132, 0)',
    data: P_data}]

  myPolarChart.data.datasets.backgroundColor = P_color
  myPolarChart.data.datasets.data = P_data
  myPolarChart.update()


  myDoughnutChart.data.datasets =[{
    backgroundColor: D_color,
    borderColor: 'rgba(255, 99, 132, 0)',
    data: D_data
  }]
  myDoughnutChart.update()
}




var YMDprews = ''

function clearDataFromGraphs(){

  myChart.data.labels = []
  myChart.data.datasets = []
  myChart.data.labelTimestamp = []

  myBarChart.data.labels = []

  myPolarChart.data.labels = []

  myDoughnutChart.data.labels = []
}

function loadAllDataNew(){

  myCheckbox.checked=true
  clearDataFromGraphs()
  
  shifted = 0
  hmsPrews = 0


  window.api.httpRequest("requestLoadAll")//načítá všechna data všechny časy
  window.api.receive("fromMainRequestLoadAll", (allResp) => {
    if (allResp == "errorFlag")
    {
      myCheckbox.checked=false
      console.log("errorFla")
      return
    }
    window.api.httpRequest("requestTasksProperties",{ params: {worker:"default"}})
    window.api.receive("fromMainRequestTaskProperties", (taskSpecs) => {
      window.api.httpRequest("requestTasksAverage", {params:{worker:"default"}})//načtení prměrů všech úkolů
      window.api.receive("fromMainRequestTaskAverage", (averageData) => {
        taskSpecs.forEach(element => {
          if(averageData.data.some(item => item.address === element.address && element.hide==false)){
            posAvr = averageData.data.findIndex(function(item, i){return item.address == element.address})
            lR = averageData.data[posAvr].last_response
            lR>lastTime ? lastTime=lR:lastTime;
            
            myChart.data.datasets.push({
              "address":element.address,
              "failed":0,
              "passed":0,
              "average":averageData.data[posAvr].average,
              label:element.name, 
              borderColor: element.color,
              backgroundColor: 'black',
              data:[],
              fill: false,
              borderWidth: 2,
              spanGaps: true,
              tension: 0.1,
            })
          }
        });
        
        dataForGraphs(allResp.data)

        setAndUpdate(true, averageData)
        

      })
    }) 
  })
}


/* ----------------------------------------- refresh datas ----------------------------------------- */ 

function loadDataFrom(dtf){
  
  window.api.httpRequest("requestLoadAll", {params:{'time_from':dtf}})//načítá data od posledního času a přepisuje (TODO) časy
  window.api.receive("fromMainRequestLoadAll", (allRespFrom) => {
    if (allRespFrom == "errorFlag")
    {
      myCheckbox.checked=false
      console.log("errorFla")
      return
    }
    window.api.httpRequest("requestTasksAverage", {params:{'worker':"default"}})//načtení prmůěrů všech úkolů
    window.api.receive("fromMainRequestTaskAverage", (averageData) => {

      try{
        
        dataForGraphs(allRespFrom.data)

        setAndUpdate(false, averageData)
        
        if (allRespFrom.length!=undefined){
          console.log(allRespFrom.length)
        }

      }catch{
        console.log("catch")
        loadAllDataNew()
      }
    })
  })
}



/* ----------------------------------------- data in interval load ----------------------------------------- */ 

const startInput = document.getElementById('start-time');
const endInput = document.getElementById('end-time');

const startTime = Date.parse(startInput.value);
const endTime = Date.parse(endInput.value);
const dropdownM = document.getElementById("myDropdownM");


//butons
const loadFromTo = document.getElementById('loadFromTo') 
loadFromTo.addEventListener('click', async () => {
  const startTime = Date.parse(startInput.value);
  const endTime = Date.parse(endInput.value);
  const selectedOption = dropdownM.options[dropdownM.selectedIndex].value;
  console.log(selectedOption); // vypíše hodnotu vybraného prvku

  console.log(startInput.value==""?"":startTime,endInput.value==""?"":endTime, selectedOption)
  loadDataInterval(startInput.value==""?0:startTime,endInput.value==""?Date.now():endTime, selectedOption)
})


function loadDataInterval(dtf,dtt,step){
  console.log(dtf,dtt)
  shifted = 0
  hmsPrews = 0

  clearDataFromGraphs()


  window.api.httpRequest("requestLoadAll", {params:{'time_from':dtf,'time_to':dtt}})//načítá data od posledního času a přepisuje (TODO) časy
  window.api.receive("fromMainRequestLoadAll", (allRespInterv) => {
    console.log(allRespInterv)
    if (allRespInterv == "errorFlag")
    {
      console.log("errorFla")
      myCheckbox.checked=false
      return
    }
    window.api.httpRequest("requestTasksProperties",{ params: {worker:"default"}})
    window.api.receive("fromMainRequestTaskProperties", (taskSpecs) => {
      window.api.httpRequest("requestTasksAverage", {params:{'worker':"default"}})//načtení prmůěrů všech úkolů
      window.api.receive("fromMainRequestTaskAverage", (averageData) => {
        taskSpecs.forEach(element => {
          if(averageData.data.some(item => item.address === element.address && element.hide==false)){
            posAvr = averageData.data.findIndex(function(item, i){return item.address == element.address})
            lR = averageData.data[posAvr].last_response
            lR>lastTime ? lastTime=lR:lastTime;
            
            myChart.data.datasets.push({
              "address":element.address,
              "failed":0,
              "passed":0,
              "average":averageData.data[posAvr].average,
              label:element.name, 
              borderColor: element.color,
              backgroundColor: 'black',
              data:[],
              fill: false,
              borderWidth: 2,
              spanGaps: true,
              tension: 0.1,
            })
          }
        });

        myCheckbox.checked=false
        dataForGraphsInterv(allRespInterv.data, step)

        setAndUpdate(true, averageData)

      })
      
    })
  })
}


function dataForGraphsInterv(dataAdd, step){//write to line graph and get data for other graphs setting it to json from first graph
  var ld = false
  dataAdd.forEach(da => {
    kl = myChart.data.datasets.findIndex(function(item, i){return item.address == da.address})
    if(kl != -1){
      k = (hmsPrews >= Math.floor(da.time/1000))
      hmsPrews!=Math.floor(da.time/1000)?hmsPrews=Math.floor(da.time/1000):hmsPrews;

      var time = timeConvV(da.time)//YMDhms
      if (!k){    // if lable is not in graph memmory then create new label
        if (YMDprews == time.YMD){//check if label is on same day else creat new inclueding day 
          myChart.data.labels.push([time.hms])
        }else{
          myChart.data.labels.push([time.hms,time.YMD])
          YMDprews = time.YMD
        }
        myChart.data.labelTimestamp.push(Math.floor(da.time/1000))//lable timestamps just for me not for graphs

        
        myChart.data.datasets.forEach(element => {
          
          if (element.address==da.address){
            element.data.push(da.value)
            da.value == -1 ? element.failed++:element.passed++;
          }
          else{
            element.data.push(NaN)
          }

          if (element.data.length>lenLimit){
            element.data.shift()
          }
        });
      }
      else{
        myChart.data.datasets.forEach(element => {
          if (element.address==da.address){
            var posAvr = myChart.data.labelTimestamp.findIndex(function(item, i){return item == Math.floor(da.time/1000)})
            element.data[posAvr] = da.value
            da.value == -1 ? element.failed++:element.passed++;
          }
        });
      }
    }
    else{
      ld = true
    }
  });
  
  const [retLabels, arrIndex] = roundTimeOccurrencesa(myChart.data.labels, step)
  myChart.data.datasets.forEach(element => {
    const data = [], labels = []
    console.log(element)
    for (let i = 0; i <= arrIndex.length-2; i++) {
      data.push(sumNumbers(element.data,arrIndex[i],arrIndex[i+1]))
      labels.push(retLabels[i])
    }
    myChart.data.labels = labels
    element.data = data
  });
  console.log(myChart.data.labels, myChart.data.datasets)
  return ld
}





function roundTimeOccurrencesa(occurrences, roundingUnit) {
  const roundedOccurrences = [];
  let dd = "";
  let preVal = [];
  let preValY = [];
  const ind = [];
  occurrences.forEach((occurrence, index) => {
    const [time, date] = occurrence;
    date!=undefined?dd=date:""
    const [hour, minute, second] = time.split(':').map(str => parseInt(str, 10));
    const [year, month, day] = dd.split('-').map(str => parseInt(str, 10));
    let newTime = "", newDate = ""
    switch (roundingUnit) {
      case 's':
        newTime = time;
        newDate = dd;
        break;
      case 'm':
        newTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`;
        newDate = dd
        break;  
      case 'h':
        newTime = `${hour.toString().padStart(2, "0")}:00:00`;
        newDate = dd
        break;
      case 'D':
        newTime = "00:00:00"
        newDate = `${year.toString()}:${month.toString().padStart(2, "0")}:${day.toString().padStart(2, "0")}`;
        break;
      case 'M':
        newTime = "00:00:00"
        newDate = `${year.toString()}:${month.toString().padStart(2, "0")}:01`;
        break;
      case 'Y':
        newTime = "00:00:00"
        newDate = `${year.toString()}:01:01`;
        break;
    }
    if (preVal!=newTime || (date!=undefined && preValY!=newDate)){
      //console.log(preVal[0], newTime, preVal[1], dd)
      preValY = newDate;
      preVal = newTime;
      console.log(date!=undefined?[newTime, newDate]:[newTime], index)
      ind.push(index)
      roundedOccurrences.push(date!=undefined?[newTime, newDate]:[newTime]);
    }
  });
  ind.push(occurrences.length)
  return [roundedOccurrences, ind];
}


function sumNumbers(numbers, from, to) {
  let sum = 0;
  let nonNaN = 0
  numbers.slice(from, to).forEach(function(num) {
    if (!isNaN(num)) {
      sum += num;
      nonNaN++
    }
  });
  
  return nonNaN>0?sum/nonNaN:NaN;
}




function timeConvV(time, t){

  time = new Date(time)
  var returnedTime = {"YMD":(time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate())
  ,"hms":(time.getHours()+':'+time.getMinutes()+':'+time.getSeconds())}
  return returnedTime
}