const labelGraphCol = "white";
const gridLinesCol = "#888787";

//menu settings
const menuButtonG = document.getElementById('menuButton-G');
const menuG = document.getElementById('menu-G');
menuButtonG.addEventListener('click', function() {
  showMenuG()
});

const hideMenuBtnG = document.getElementById('hide-menu-btn-G');
hideMenuBtnG.addEventListener('click', () => {
  hideSettMenuG()
});

function hideSettMenuG(){
  menuG.classList.toggle('visible-G');
  document.body.classList.remove('overlay-G');
  clear()
}

function showMenuG(){
  menuG.classList.toggle('visible-G');
  document.body.classList.add('overlay-G');
}

window.api.receive("fromMainServerDown", (data) => {
  myCheckbox.checked=false
});

function loadAllDataNew(){
  dataForGraphsT(undefined, undefined, "s", true, true)
}


/* ----------------------------------------- lin chart init ----------------------------------------- */
const Lchart = document.getElementById('myChart')
const labelsL = [];
const configL = {
  type: 'line',
  data: {
    labels: labelsL,
    datasets: [
      {
          label: '',
          borderColor: '#ff0000',
          backgroundColor: 'rgba(0, 0, 0, 0)',
          data: [0, 1, 2],
          fill: false,
          borderWidth: 0,
          spanGaps: true,
          tension: 0.1,
          color:labelGraphCol
      }
      ]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        display:true,
        text:'Legend',
        color: labelGraphCol,
        fontColor:labelGraphCol,
        labels:{
          color: labelGraphCol,
          usePointStyle: true,
          pointStyle: 'circle'
        },
        onHover: function(event, chartElement) {
          document.body.style.cursor = 'pointer';
        },
        onLeave: function(event, chartElement) {
          document.body.style.cursor = 'default';
        }
      },
      title: {
        display: true,
        text: 'Responses',
        color: labelGraphCol
      },
      zoom:{
        zoom:{
          drag:{
            enabled:true
          },
          mode:'x'
        },
      },
      
    },
    scales:{
          y:{
              suggestedMax:5,
              beginAtZero: true,
              title:{
                  display: true,
                  text:'Ping [ms]',
                  color: labelGraphCol,
              },
              ticks: {
                color:labelGraphCol,
              },
              min: -1.5,
              grid: {
                color: gridLinesCol
              }
          },
          x:{
            title:{
                display: true,
                text:'Time [h/m/s]',
                color:"white",
            },
            ticks:{
              color:"white",
              maxRotation: 90,
              minRotation: 0,
              callback: function(label) {
                let realLabel = this.getLabelForValue(label)
                return realLabel[0];
              }
            },
            grid: {
              color: gridLinesCol
            }
          },
          xAxis2: {
            type: "category",
            title:{
              display: true,
              text:'Time [Y/M/D]',
              color:"white",
            },
            ticks:{
              color: labelGraphCol,
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
              color: gridLinesCol
            }

          },
    },
    legend: {
      labels: {
          fontColor: 'white'
      }
    },
    legend: {
      color: labelGraphCol
    }
  },
};//config grafu


var myChart = new Chart(Lchart, configL);


//butons
const load_d = document.getElementById('load_d') 
load_d.addEventListener('click', async () => {
  myCheckbox.checked=true
  dataForGraphsT(undefined, undefined, "s", true, true)
})

const resZ = document.getElementById('resetZoom')
resZ.addEventListener('click', ()=>{
  myChart.resetZoom()
})

const lm = document.getElementById('left_m')
lm.addEventListener('click', ()=>{
  myChart.pan({x: 100}, undefined, 'default');
})

const rm = document.getElementById('right_m')
rm.addEventListener('click', ()=>{
  myChart.pan({x: -100}, undefined, 'default');
})

/* ----------------------------------------- barr chart init ----------------------------------------- */

const Bchart = document.getElementById('myBarChart')
const labelsB = [""];

const dataB = {
  labels: labelsB,
  datasets: [
    {
      label: "Passed",
      backgroundColor: ["#3e95cd"],
      data: [0],
      color:labelGraphCol
    },
    {
      label: "Failed",
      backgroundColor: ["#c45850"],
      data: [0],
      color:labelGraphCol
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
    scales:{
      y:{
        ticks:{
          color:labelGraphCol
        },
        grid: {
          color: gridLinesCol
        }
      },
      x:{
        ticks:{
          color:labelGraphCol
        },
        grid: {
          color: gridLinesCol
        }
      }
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          usePointStyle: true, 
          pointStyle: 'circle' 
        }
      },
      datalabels: {
          color: 'white'
      },
      title: {
        display: true,
        text: 'Error graphs',
        color: labelGraphCol
      },
    },
    color:"white"
  },
};

var myBarChart = new Chart(Bchart, configB);



/* ----------------------------------------- polar init ----------------------------------------- */

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
        position: 'bottom',
        display:true,
        color: labelGraphCol,
        fontColor: labelGraphCol,
        labels:{
          color: labelGraphCol,
          usePointStyle: true,
          pointStyle: 'circle'
        },
        onHover: function(event, chartElement) {
          document.body.style.cursor = 'pointer';
        },
        onLeave: function(event, chartElement) {
          document.body.style.cursor = 'default';
        }
      },
      title: {
        display: true,
        text: 'Average responses',
        color: labelGraphCol
      },
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


/* ----------------------------------------- doughnut init ----------------------------------------- */ 

const dataD = {
  labels: [],
  datasets: [{
    label: 'My First Dataset',
    data: [],
    backgroundColor: [],
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
        position: 'bottom',
        display:true,
        color: labelGraphCol,
        fontColor: labelGraphCol,
        labels:{
          color: labelGraphCol,
          usePointStyle: true,
          pointStyle: 'circle' 
        },
        onHover: function(event, chartElement) {
          document.body.style.cursor = 'pointer';
        },
        onLeave: function(event, chartElement) {
          document.body.style.cursor = 'default';
        }
      },
      title: {
        display: true,
        text: 'Counts of measured values',
        color: labelGraphCol
      },
    }
  }
};

const Dchart = document.getElementById('myDoughnutChart')
var myDoughnutChart = new Chart(Dchart, configD);

/* ----------------------------------------- init loading ----------------------------------------- */ 
var refreshTime = 60
var lenLimit = 300

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



var initAutoReload = false; //start auto reload only on first load
var sett 
function loadTableData(){
  window.api.send("toMainSettings")//načítá nastavení a všechna data
  window.api.receive("fromMainSettings", (sett) => {
    refreshTime = sett.secsForGraphUpdate
    lenLimit = sett.graphValueCount
    
    input.value = refreshTime
    input2.value = lenLimit
    
    myCheckbox.checked=true
    dataForGraphsT(undefined, undefined, "s", true, true)
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
          dataForGraphsT(lastLoadedTime+1, undefined, "s", false, true)
        }else{
          dataForGraphsT(undefined, undefined, "s", true, true)
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



var YMDprews = ''

function clearDataFromGraphs(){

  myChart.data.labels = []
  myChart.data.datasets = []
  myChart.data.labelTimestamp = []

  myBarChart.data.labels = []

  myPolarChart.data.labels = []

  myDoughnutChart.data.labels = []
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
  myCheckbox.checked=false
  const startTime = Date.parse(startInput.value);
  const endTime = Date.parse(endInput.value);
  const selectedOption = dropdownM.options[dropdownM.selectedIndex].value;

  dataForGraphsT(startInput.value==""?undefined:startTime, endInput.value==""?undefined:endTime, selectedOption, true, false)
})



var lastLoadedTime = 0
var lastLoadedTimeAuto = ""

function timeConvT(time, roundingUnit){

  time = new Date(time)

  var [year, month, day, hour, minute, second] = [time.getFullYear(), (time.getMonth()+1), time.getDate(), time.getHours(), time.getMinutes(), time.getSeconds()]//YMDhms

  switch (roundingUnit) {
    case 's':
      newTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`;
      newDate = `${year.toString()}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      break;
    case 'm':
      newTime = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:00`;
      newDate = `${year.toString()}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      break;  
    case 'h':
      newTime = `${hour.toString().padStart(2, "0")}:00:00`;
      newDate = `${year.toString()}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      break;
    case 'D':
      newTime = "00:00:00"
      newDate = `${year.toString()}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      break;
    case 'M':
      newTime = "00:00:00"
      newDate = `${year.toString()}-${month.toString().padStart(2, "0")}-00`;
      break;
    case 'Y':
      newTime = "00:00:00"
      newDate = `${year.toString()}-00-00`;
      break;
  }

  var returnedTime = {"YMD":newDate, "hms":newTime}
  return returnedTime
}

function dataForGraphsT(dtf = 0, dtt=Date.now(), step = "s", firsLoad = true, auto = true){//write to line graph and get data for other graphs setting it to json from first graph
  var chartData = [], labels = [], newWal = true, i = 0
  ttt = Date.now()
  console.log((Date.now() - ttt), ttt = Date.now())
  if (firsLoad){lastLoadedTime = 0}
  window.api.httpRequest("requestLoadAll", {params:{'time_from':dtf,'time_to':dtt}})//načítá data od posledního času a přepisuje (TODO) časy
  window.api.receive("fromMainRequestLoadAll", (allRespInterv) => {
    if (allRespInterv == "errorFlag")
    {
      console.log("errorFla")
      myCheckbox.checked=false
      return
    }
    console.log((Date.now() - ttt), ttt = Date.now())
    window.api.httpRequest("requestTasksProperties",{ params: {worker:"default"}})
    window.api.receive("fromMainRequestTaskProperties", (taskSpecs) => {
      console.log((Date.now() - ttt), ttt = Date.now())
      taskSpecs.filter(element => element.hide == false).forEach(element => {
            
            chartData.push({
              "address":element.address,
              "failed":0,
              "passed":0,
              "average":0,
              "dataMed":[],
              label:element.name, 
              borderColor: element.color,
              backgroundColor: 'black',
              data:[],
              color:labelGraphCol,
              fill: false,
              borderWidth: 2,
              spanGaps: true,
              tension: 0.1,
            })
        });

        if (auto){var tprev = lastLoadedTimeAuto}else{var tprev = {"YMD":"", "hms":""}}
        
        allRespInterv.data.forEach(da => {
          //kl = chartData.findIndex(function(item, i){return item.address == da.address})
            lastLoadedTime = da.time
            var time = timeConvT(da.time, step)//YMDhms

            var newLabel = true
            if (time.YMD != tprev.YMD) {
              //console.log([time.hms, time.YMD])
              labels.push([time.hms, time.YMD])
            }
            else if (time.hms != tprev.hms) {
              //console.log([time.hms])
              labels.push([time.hms])
            }
            else {
              //console.log("aaaaaaa")
              newLabel = false
            }
            tprev = time
            lastLoadedTimeAuto = {"YMD":time.YMD, "hms":time.hms}
            
            if (newLabel){
              chartData.forEach(element => {
                if (!newWal) {
                  //console.log(sumNumbersT(element.dataMed), i++, labels[labels.length-2], element.address)
                  element.data.push(sumNumbersT(element.dataMed))
                  element.dataMed = []
                }

                if (element.address==da.address){
                  //element.data.push(da.value)
                  element.dataMed.push(da.value)
                  da.value == -1 ? element.failed++:element.passed++;
                }
                else{
                  //element.data.push(NaN)
                  element.dataMed.push(NaN)
                }

              });
              if (newWal){
                newWal = false
              }
            }
            else{
              chartData.forEach(element => {
                if (element.address==da.address){
                  element.dataMed.push(da.value)
                  //var posAvr = myChart.data.labelTimestamp.findIndex(function(item, i){return item == Math.floor(da.time/1000)})
                  //element.data[element.data.length-1] = da.value
                  da.value == -1 ? element.failed++:element.passed++;
                }
              });
            }
        });

        chartData.forEach(element => {
          //console.log(sumNumbersT(element.dataMed), i++, labels[labels.length-1], element.address)
          element.data.push(sumNumbersT(element.dataMed))
          element.dataMed = []
          element.average = sumNumbersT(element.data)
        });
        console.log((Date.now() - ttt), ttt = Date.now())
        //console.log(lastLoadedTime, lastLoadedTimeAuto)
        console.log(firsLoad, chartData, labels, auto);   
        setAndUpdateT(firsLoad, chartData, labels, auto);
        console.log((Date.now() - ttt), ttt = Date.now())
    })
  })
  
}

function sumNumbersT(numbers) {//summ numbers and count average 
  let sum = 0;
  let nonNaN = 0
  numbers.forEach(function(num) {
    if (!isNaN(num)) {
      sum += num;
      nonNaN++
    }
  });
  
  return nonNaN>0?sum/nonNaN:NaN;
}

async function setAndUpdateT(firstSett, data, labels, auto){
  //const nanArray = Array(myChart.data.labels.length).fill(NaN);
  //console.log(nanArray, auto)

  var L_datasets = myChart.data.datasets
  var L_labels = myChart.data.labels
  
  var B_failed = myBarChart.data.datasets[1].data
  var B_passed = myBarChart.data.datasets[0].data

  var P_data = myPolarChart.data.datasets.data
  var P_color = myPolarChart.data.datasets.backgroundColor
  
  var D_data = myDoughnutChart.data.datasets[0].data
  var D_color = myDoughnutChart.data.datasets[0].backgroundColor
    
    
  if (firstSett){//load labels if first sett label for line chart is in datasets
    var L_datasets = [],B_failed = [],B_passed = [],P_data = [],P_color = [],D_data = [],D_color = [],L_labels = []

    clearDataFromGraphs()
    data.forEach(element => {
      myBarChart.data.labels.push(element.label)
      myPolarChart.data.labels.push(element.label)
      myDoughnutChart.data.labels.push(element.label)

      L_datasets.push(element)

      B_failed.push(element.failed)
      B_passed.push(element.passed)
    
      
      dcol = element.borderColor
      P_color.push('rgba('+parseInt(dcol[1]+dcol[2], 16)+","+parseInt(dcol[3]+dcol[4], 16)+","+parseInt(dcol[5]+dcol[6], 16)+',0.7)')
      P_data.push(element.average)
  
      
      D_color.push('rgba('+parseInt(dcol[1]+dcol[2], 16)+","+parseInt(dcol[3]+dcol[4], 16)+","+parseInt(dcol[5]+dcol[6], 16)+',1)')
      D_data.push(element.passed)
    });
    L_labels = labels
  }
  else{
    D_color = [], P_color = []
    data.forEach(element => {
      //console.log(element)
      //console.log("asdfsadfsdafsadfsdafsdafsda", L_datasets.findIndex(function(item, i){return item.address == element.address}))
      index = L_datasets.findIndex(function(item, i){return item.address == element.address})
      //console.log(index,L_datasets[index].data)
      if (index!=-1){
        L_datasets[index].data = L_datasets[index].data.concat(element.data)

        B_failed[index] = B_failed[index]+element.failed
        B_passed[index] = B_passed[index]+element.passed

        dcol = element.borderColor
        P_color[index] = 'rgba('+parseInt(dcol[1]+dcol[2], 16)+","+parseInt(dcol[3]+dcol[4], 16)+","+parseInt(dcol[5]+dcol[6], 16)+',0.7)'

        
        P_data[index] = sumNumbersT([P_data[index], element.average])
        
        D_color[index] = 'rgba('+parseInt(dcol[1]+dcol[2], 16)+","+parseInt(dcol[3]+dcol[4], 16)+","+parseInt(dcol[5]+dcol[6], 16)+',1)'
        D_data[index] = D_data[index] + element.passed

      }
    });
    L_labels = L_labels.concat(labels)
  }

  if (auto){
    trim = L_labels.length<lenLimit?0:L_labels.length-lenLimit
    L_datasets.forEach(element => {
      //console.log(element.data.length<lenLimit?0:-(lenLimit-element.data.length))
      
      element.data.splice(0, trim)

    });
    L_labels.splice(0, trim)
    console.log("%c  Trimmed count: "+ trim +" values is hidden. \n  Graph limit: "+myChart.data.labels.length+"/"+lenLimit, 'color:yellow')
  }

  console.log("labels and data",[L_labels, L_datasets])

  myChart.data.datasets = L_datasets
  myChart.data.labels = L_labels
  
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
  
  //console.log(labels, L_datasets)
  //console.log(myBarChart.data.labels, B_passed, B_failed)
  //console.log(myPolarChart.data.labels, P_color, P_data)
  //console.log(myDoughnutChart.data.labels, D_color, D_data, myDoughnutChart.data.datasets[0].backgroundColor)
}


window.api.send("toMainSettings")//načítá nastavení a všechna data
window.api.receive("fromMainSettings", (sett) => {
  dev = sett.dev//set if app is in dev mode
  if (dev){
      chartDataDD = [
        {
            "address": "google.com",
            "failed": 15,
            "passed": 3496,
            "average": 6.504398491001565,
            "dataMed": [],
            "label": "GOG",
            "borderColor": "#b6c309",
            "backgroundColor": "black",
            "data": [
                9.808219178082192,
                9.881889763779528,
                8.892045454545455,
                9.794444444444444,
                9.7,
                12.394444444444444,
                9.8,
                9.694444444444445,
                9.627777777777778,
                9.6,
                6.916666666666667,
                2.611111111111111,
                2.6444444444444444,
                2.740740740740741,
                2.7032967032967035,
                2.6555555555555554,
                2.7555555555555555,
                2.7055555555555557,
                6.161111111111111,
                2.688888888888889,
                2.8161764705882355
            ],
            "color": "white",
            "fill": false,
            "borderWidth": 2,
            "spanGaps": true,
            "tension": 0.1
        },
        {
            "address": "palaceskateboards.com",
            "failed": 33,
            "passed": 3404,
            "average": 24.436297142045223,
            "dataMed": [],
            "label": "Palace",
            "borderColor": "#fb00ff",
            "backgroundColor": "black",
            "data": [
                24.166666666666668,
                22.173333333333332,
                21.522222222222222,
                22.211111111111112,
                23.322222222222223,
                22.505555555555556,
                25.4,
                25.41111111111111,
                25.238888888888887,
                25.83888888888889,
                25.511111111111113,
                24.544444444444444,
                25.66111111111111,
                25.5125,
                25.804347826086957,
                25.7,
                26.13888888888889,
                24.994444444444444,
                23.872222222222224,
                24.11111111111111,
                23.522058823529413
            ],
            "color": "white",
            "fill": false,
            "borderWidth": 2,
            "spanGaps": true,
            "tension": 0.1
        },
        {
            "address": "supremenewyork.com",
            "failed": 14,
            "passed": 3424,
            "average": 2.7819706626612,
            "dataMed": [],
            "label": "Supreme",
            "borderColor": "#940000",
            "backgroundColor": "black",
            "data": [
                2.8,
                2.7777777777777777,
                2.4055555555555554,
                2.688888888888889,
                2.8222222222222224,
                2.7111111111111112,
                2.75,
                2.8944444444444444,
                2.683333333333333,
                2.7222222222222223,
                2.688888888888889,
                2.7555555555555555,
                2.7944444444444443,
                2.85,
                2.9347826086956523,
                2.7944444444444443,
                2.9555555555555557,
                2.85,
                2.9166666666666665,
                2.816666666666667,
                2.8088235294117645
            ],
            "color": "white",
            "fill": false,
            "borderWidth": 2,
            "spanGaps": true,
            "tension": 0.1
        },
        {
            "address": "www.kos.cvut.cz",
            "failed": 15,
            "passed": 3500,
            "average": 3.49442357375831,
            "dataMed": [],
            "label": "www.kos.cvut.cz",
            "borderColor": "#000000",
            "backgroundColor": "black",
            "data": [
                3.513888888888889,
                3.484251968503937,
                3.1055555555555556,
                3.5444444444444443,
                3.6222222222222222,
                3.55,
                3.4944444444444445,
                3.4277777777777776,
                3.4444444444444446,
                3.4055555555555554,
                3.55,
                3.477777777777778,
                3.5055555555555555,
                3.4444444444444446,
                3.597826086956522,
                3.5,
                3.5555555555555554,
                3.511111111111111,
                3.5444444444444443,
                3.588888888888889,
                3.514705882352941
            ],
            "color": "white",
            "fill": false,
            "borderWidth": 2,
            "spanGaps": true,
            "tension": 0.1
        },
        {
            "address": "www.chartjs.org",
            "failed": 18,
            "passed": 3867,
            "average": 2.765595226226191,
            "dataMed": [],
            "label": "chart",
            "borderColor": "#cd4747",
            "backgroundColor": "black",
            "data": [
                2.9444444444444446,
                2.7524271844660193,
                2.383495145631068,
                2.682926829268293,
                2.8980582524271843,
                2.820388349514563,
                2.8146341463414632,
                2.6990291262135924,
                2.7766990291262137,
                2.7281553398058254,
                2.7463414634146344,
                2.7135922330097086,
                2.79126213592233,
                2.760869565217391,
                2.798076923076923,
                2.731707317073171,
                2.878640776699029,
                2.766990291262136,
                2.8292682926829267,
                2.79126213592233,
                2.769230769230769
            ],
            "color": "white",
            "fill": false,
            "borderWidth": 2,
            "spanGaps": true,
            "tension": 0.1
        },
        {
            "address": "www.epochconverter.com",
            "failed": 14,
            "passed": 3371,
            "average": 2.7630399197243998,
            "dataMed": [],
            "label": "epoch time",
            "borderColor": "#ab00ad",
            "backgroundColor": "black",
            "data": [
                2.7333333333333334,
                3.0388888888888888,
                2.4833333333333334,
                2.7055555555555557,
                3.0277777777777777,
                2.683333333333333,
                2.7333333333333334,
                2.888888888888889,
                2.727777777777778,
                2.6277777777777778,
                2.8,
                2.6666666666666665,
                2.65,
                2.6875,
                2.774193548387097,
                2.7845303867403315,
                2.8555555555555556,
                2.811111111111111,
                2.7944444444444443,
                2.7777777777777777,
                2.7720588235294117
            ],
            "color": "white",
            "fill": false,
            "borderWidth": 2,
            "spanGaps": true,
            "tension": 0.1
        },
        {
            "address": "www.alaskaair.com",
            "failed": 17,
            "passed": 3850,
            "average": 9.298261238396655,
            "dataMed": [],
            "label": "alaska",
            "borderColor": "#2bff00",
            "backgroundColor": "black",
            "data": [
                9.352941176470589,
                9.887804878048781,
                8.402912621359222,
                9.359223300970873,
                9.29611650485437,
                9.37560975609756,
                9.320388349514563,
                9.368932038834952,
                9.24390243902439,
                9.140776699029127,
                9.21359223300971,
                9.24757281553398,
                9.190243902439024,
                9.24731182795699,
                9.619047619047619,
                9.317073170731707,
                9.344660194174757,
                9.320388349514563,
                9.292682926829269,
                9.28640776699029,
                9.435897435897436
            ],
            "color": "white",
            "fill": false,
            "borderWidth": 2,
            "spanGaps": true,
            "tension": 0.1
        },
        {
            "address": "www.australia.gov.au",
            "failed": 31,
            "passed": 3835,
            "average": 3.7289255480641788,
            "dataMed": [],
            "label": "au",
            "borderColor": "#ff5900",
            "backgroundColor": "black",
            "data": [
                3.0588235294117645,
                2.8592233009708736,
                2.658536585365854,
                2.907766990291262,
                2.9902912621359223,
                4.368932038834951,
                2.8146341463414632,
                3.441747572815534,
                3.6990291262135924,
                8.419512195121952,
                8.762135922330097,
                6.087378640776699,
                2.8446601941747574,
                2.902173913043478,
                3.0288461538461537,
                2.8292682926829267,
                2.9757281553398056,
                2.9029126213592233,
                2.9073170731707316,
                2.912621359223301,
                2.9358974358974357
            ],
            "color": "white",
            "fill": false,
            "borderWidth": 2,
            "spanGaps": true,
            "tension": 0.1
        },
        {
            "address": "jetbrains.com",
            "failed": 26,
            "passed": 5411,
            "average": 3.7499533534839395,
            "dataMed": [],
            "label": "jetbrains",
            "borderColor": "#0300b3",
            "backgroundColor": "black",
            "data": [
                4.5625,
                2.7395833333333335,
                2.4479166666666665,
                3.0069444444444446,
                2.7604166666666665,
                4.673611111111111,
                2.8020833333333335,
                2.7881944444444446,
                3.607638888888889,
                9.15625,
                8.663194444444445,
                6.125,
                2.8645833333333335,
                2.7364341085271318,
                3.5547945205479454,
                2.6875,
                2.78125,
                2.642361111111111,
                2.670138888888889,
                2.795138888888889,
                2.68348623853211
            ],
            "color": "white",
            "fill": false,
            "borderWidth": 2,
            "spanGaps": true,
            "tension": 0.1
        },
        {
            "address": "www.seznam.cz",
            "failed": 23,
            "passed": 5392,
            "average": 2.951056755608823,
            "dataMed": [],
            "label": "seznam",
            "borderColor": "#e60000",
            "backgroundColor": "black",
            "data": [
                2.9166666666666665,
                2.9652777777777777,
                2.611111111111111,
                2.9618055555555554,
                2.9166666666666665,
                2.9270833333333335,
                2.9895833333333335,
                2.954861111111111,
                2.982638888888889,
                2.923611111111111,
                2.9965277777777777,
                2.9270833333333335,
                2.9270833333333335,
                2.8923076923076922,
                2.958904109589041,
                2.8819444444444446,
                2.9100346020761245,
                2.9479166666666665,
                2.9305555555555554,
                2.982638888888889,
                3.467889908256881
            ],
            "color": "white",
            "fill": false,
            "borderWidth": 2,
            "spanGaps": true,
            "tension": 0.1
        },
        {
            "address": "facebook.com",
            "failed": 16,
            "passed": 3221,
            "average": 2.6855817618081517,
            "dataMed": [],
            "label": "FB",
            "borderColor": "#0011ff",
            "backgroundColor": "black",
            "data": [
                2.690909090909091,
                2.7294520547945207,
                2.275,
                2.7625,
                2.71875,
                2.65,
                2.69375,
                2.5875,
                2.7,
                2.6625,
                2.6625,
                2.6625,
                2.75625,
                2.7777777777777777,
                2.6049382716049383,
                2.60625,
                2.70625,
                2.7875,
                2.70625,
                2.813664596273292,
                2.84297520661157
            ],
            "color": "white",
            "fill": false,
            "borderWidth": 2,
            "spanGaps": true,
            "tension": 0.1
        },
        {
            "address": "novinky.cz",
            "failed": 11,
            "passed": 2811,
            "average": 2.9984099692132156,
            "dataMed": [],
            "label": "novinky",
            "borderColor": "#4b398e",
            "backgroundColor": "black",
            "data": [
                2.8970588235294117,
                2.955665024630542,
                2.6319444444444446,
                2.9444444444444446,
                2.9166666666666665,
                3.0694444444444446,
                3.013888888888889,
                3.0555555555555554,
                3.0069444444444446,
                2.9583333333333335,
                2.9791666666666665,
                3.486111111111111,
                2.9791666666666665,
                2.923076923076923,
                2.9315068493150687,
                2.951388888888889,
                2.9097222222222223,
                2.9722222222222223,
                2.9305555555555554,
                2.9583333333333335,
                3.4954128440366974
            ],
            "color": "white",
            "fill": false,
            "borderWidth": 2,
            "spanGaps": true,
            "tension": 0.1
        },
        {
            "address": "youtube.com",
            "failed": 0,
            "passed": 3503,
            "average": 4.515328134005761,
            "dataMed": [],
            "label": "YT",
            "borderColor": "#c70000",
            "backgroundColor": "black",
            "data": [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                9.37984496124031,
                9.36111111111111,
                9.336805555555555,
                6.913194444444445,
                2.6180555555555554,
                2.625,
                2.5846153846153848,
                2.595890410958904,
                2.6354166666666665,
                2.5520833333333335,
                2.6041666666666665,
                4.770833333333333,
                2.6458333333333335,
                2.591743119266055
            ],
            "color": "white",
            "fill": false,
            "borderWidth": 2,
            "spanGaps": true,
            "tension": 0.1
        },
        {
            "address": "1.1.1.1",
            "failed": 0,
            "passed": 2919,
            "average": 2.6769698237494857,
            "dataMed": [],
            "label": "Cloudflare",
            "borderColor": "#00abb8",
            "backgroundColor": "black",
            "data": [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                2.663551401869159,
                2.7041666666666666,
                2.6625,
                2.654166666666667,
                2.754166666666667,
                2.7041666666666666,
                2.7222222222222223,
                2.727272727272727,
                2.6375,
                2.6224066390041494,
                2.625,
                2.654166666666667,
                2.6375,
                2.708791208791209
            ],
            "color": "white",
            "fill": false,
            "borderWidth": 2,
            "spanGaps": true,
            "tension": 0.1
        },
        {
            "address": "8.8.8.8",
            "failed": 0,
            "passed": 2919,
            "average": 5.541917284556513,
            "dataMed": [],
            "label": "google-public-dns",
            "borderColor": "#b802c5",
            "backgroundColor": "black",
            "data": [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                14.037383177570094,
                14.116666666666667,
                14.029166666666667,
                9.804166666666667,
                2.5875,
                2.5875,
                2.5833333333333335,
                2.5901639344262297,
                2.475,
                2.575,
                2.5541666666666667,
                2.5208333333333335,
                2.5875,
                2.5384615384615383
            ],
            "color": "white",
            "fill": false,
            "borderWidth": 2,
            "spanGaps": true,
            "tension": 0.1
        },
        {
            "address": "8.8.4.4",
            "failed": 0,
            "passed": 2189,
            "average": 4.507038989353434,
            "dataMed": [],
            "label": "google-public-dnsB",
            "borderColor": "#000000",
            "backgroundColor": "black",
            "data": [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                9.375,
                9.277777777777779,
                9.3,
                6.811111111111111,
                2.638888888888889,
                2.588888888888889,
                2.580246913580247,
                2.6043956043956045,
                2.585635359116022,
                2.5388888888888888,
                2.5944444444444446,
                4.988888888888889,
                2.6555555555555554,
                2.5588235294117645
            ],
            "color": "white",
            "fill": false,
            "borderWidth": 2,
            "spanGaps": true,
            "tension": 0.1
        },
        {
            "address": "www.nytimes.com",
            "failed": 0,
            "passed": 2185,
            "average": 9.335224138313711,
            "dataMed": [],
            "label": "NYT",
            "borderColor": "#8583aa",
            "backgroundColor": "black",
            "data": [
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                9.381578947368421,
                9.205555555555556,
                9.238888888888889,
                9.933333333333334,
                9.244444444444444,
                9.183333333333334,
                9.271604938271604,
                9.395604395604396,
                9.281767955801104,
                9.383333333333333,
                9.272222222222222,
                9.255555555555556,
                9.344444444444445,
                9.301470588235293
            ],
            "color": "white",
            "fill": false,
            "borderWidth": 2,
            "spanGaps": true,
            "tension": 0.1
        }
    ]
    labelsDD = [
      [
          "00:00:00",
          "2023-03-05"
      ],
      [
          "00:00:00",
          "2023-03-06"
      ],
      [
          "00:00:00",
          "2023-03-07"
      ],
      [
          "00:00:00",
          "2023-03-08"
      ],
      [
          "00:00:00",
          "2023-03-09"
      ],
      [
          "00:00:00",
          "2023-03-10"
      ],
      [
          "00:00:00",
          "2023-03-11"
      ],
      [
          "00:00:00",
          "2023-03-12"
      ],
      [
          "00:00:00",
          "2023-03-13"
      ],
      [
          "00:00:00",
          "2023-03-14"
      ],
      [
          "00:00:00",
          "2023-03-15"
      ],
      [
          "00:00:00",
          "2023-03-16"
      ],
      [
          "00:00:00",
          "2023-03-17"
      ],
      [
          "00:00:00",
          "2023-03-18"
      ],
      [
          "00:00:00",
          "2023-03-19"
      ],
      [
          "00:00:00",
          "2023-03-20"
      ],
      [
          "00:00:00",
          "2023-03-21"
      ],
      [
          "00:00:00",
          "2023-03-22"
      ],
      [
          "00:00:00",
          "2023-03-23"
      ],
      [
          "00:00:00",
          "2023-03-24"
      ],
      [
          "00:00:00",
          "2023-03-25"
      ]
    ]
    setAndUpdateT(true, chartDataDD, labelsDD, false);
  }
})