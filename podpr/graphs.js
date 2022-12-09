/* ----------------------------------------- Lin chart ----------------------------------------- */

var config = {
  type: 'line',
  data: {
    labels: [""],
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

const chart = document.getElementById('myChart')
var myChart = new Chart(chart, config);



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

window.api.send("toMain_sett")//načítá všechna data všechny časy
window.api.receive("fromMain_sett", (sett) => {
  refreshTime = sett.secsForGraphUpdate
  lenLimit = sett.graphValueCount
  
  input.value = refreshTime
  input2.value = lenLimit
  
  loadAllDataNew()


  lastTime = 0
  t = refreshTime
  
  const timer = document.getElementById('timer')
  setInterval(function(){ // renew every sec
    if (t==1){
      timer.innerText = "Time to refresh: " + --t + " s"
      if (myBarChart.data.labels.length>1){
        loadDataFrom(lastTime)
      }else{
        loadAllDataNew()
      }
      console.log(myChart.data)
      t=refreshTime
    }else{
      timer.innerText = "Time to refresh: " + --t + " s"
      //console.log(--t)
    }

  }, 1000);//1000
})




function timeConv(time){
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
      k = (hmsPrews >= Math.round(da.time/1000))
      hmsPrews!=Math.round(da.time/1000)?hmsPrews=Math.round(da.time/1000):hmsPrews;

      var time = timeConv(da.time)
      if (!k){
        if (YMDprews == time.YMD){
          myChart.data.labels.push([time.hms])
        }else{
          myChart.data.labels.push([time.hms,time.YMD])
          YMDprews = time.YMD
        }
        myChart.data.labelTimestamp.push(Math.round(da.time/1000))
        time>lastTime ? lastTime=lR:lastTime;

        if (myChart.data.labels.length>lenLimit){
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
            var posAvr = myChart.data.labelTimestamp.findIndex(function(item, i){return item == Math.round(da.time/1000)})
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
  console.log("%c  Shifted count: "+ shifted +" values is hidden. \n  Graph limit: "+myChart.data.labels.length+"/"+lenLimit, 'color:yellow')
  return ld
}

function setAndUpdate(B_failed, B_passed, P_color, P_data, D_color, D_data, firstSett, averageData){
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

function loadAllDataNew(){
  shifted = 0
  hmsPrews = 0
  myChart.data.labels = []
  myChart.data.datasets = []

  var B_failed = []
  var B_passed = []
  myBarChart.data.labels = []

  myPolarChart.data.labels = []
  var P_data = []
  var P_color = []

  myDoughnutChart.data.labels = []
  var D_data = []
  var D_color = []


  window.api.html_req("load_html_req")//načítá všechna data všechny časy
  window.api.receive("html_req", (allResp) => {
    window.api.receive("http_logs", (data) => {
      console.log('\x1B[34m %s %s', data[0], data[1]);
    });
    window.api.send("toMain_jslo")//načítá data z jsono o serverech
    window.api.receive("fromMain_jslo", (taskSpecs) => {
      window.api.html_req("load_html_ResponseSumary", {params:{'worker':"default"}})//načtení prměrů všech úkolů
      window.api.receive("http_responseSumary", (averageData) => {
        window.api.receive("http_logs", (data) => {
          console.log('\x1B[34m %s %s', data[0], data[1]);
        });
        taskSpecs.forEach(element => {
          if(averageData.data.some(item => item.address === element.address)){
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

        console.log(myChart.data)

        setAndUpdate(B_failed, B_passed, P_color, P_data, D_color, D_data, true, averageData)
        

      })
    }) 
  })
}


/* ----------------------------------------- refresh datas ----------------------------------------- */ 

function loadDataFrom(dtf){
  var B_failed = []
  var B_passed = []

  var P_data = []
  var P_color = []

  var D_data = []
  var D_color = []
  
  window.api.html_req("load_html_req_from_time", {params:{'timeFrom':dtf}})//načítá data od posledního času a přepisuje (TODO) časy
  window.api.receive("html_req_from_time", (allRespFrom) => {
    window.api.receive("http_logs", (data) => {
      console.log('\x1B[34m %s %s', data[0], data[1]);
    });
    window.api.html_req("load_html_ResponseSumary", {params:{'worker':"default"}})//načtení prmůěrů všech úkolů
    window.api.receive("http_responseSumary", (averageData) => {
      window.api.receive("http_logs", (data) => {
        console.log('\x1B[34m %s %s', data[0], data[1]);
      });

      try{
        
        ld = dataForGraphs(allRespFrom.data)

        setAndUpdate(B_failed, B_passed, P_color, P_data, D_color, D_data, false, averageData)
        
        if (allRespFrom.length!=undefined){console.log(allRespFrom.length)}
        ld==true?loadAllDataNew():ld=true;
      }catch{
        loadAllDataNew()
      }
    })
  })
}

