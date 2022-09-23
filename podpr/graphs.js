

function removeAllData(chart) {
  chart.data.labels=[];
  chart.data.datasets=[]
}

function addLine(chart, data) {
  chart.data.datasets = data;
}

function addLabels(chart, labels) {
  chart.data.labels=labels
}


async function load_data(){
    output_g = []
    times_o = []
    window.api.html_req("load_html_req")
        window.api.receive("html_req", (data) => {
            graph_data = data
            date_prew = ''
            var times = []
            var serv_in = []
            graph_data.forEach(element => {
                if (!times.includes(Math.floor(element.time/1000))){
                    times.push(Math.floor(element.time/1000))
                }
                if (!serv_in.includes(Object.keys(element)[1])){
                    serv_in.push(Object.keys(element)[1])
                }
                
            });
            
            times.forEach(element => {
              var time = new Date(element*1000)
              if (date_prew == (time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate())){
                times_o.push([(time.getHours()+':'+time.getMinutes()+':'+time.getSeconds())])
                
              }else{
                times_o.push([(time.getHours()+':'+time.getMinutes()+':'+time.getSeconds()),(time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate())])
                date_prew = time.getFullYear()+'-'+(time.getMonth()+1)+'-'+time.getDate()
              }
              
            });
            window.api.send("toMain_jslo")
            window.api.receive("fromMain_jslo", (data) => {
              
              servers_names = data

              serv_in.forEach(name => {//upravuje data pro graf
                server_info = ""
                servers_names.forEach(element => {//najde uživ jméno za adresu
                  if (element.address == name){
                    server_info = element
                  }
                  
                });
                results = []
                times.forEach(time_of_res => {
                  null_val = true
                  graph_data.forEach(result => {
                    if(Math.floor(result.time/1000) == time_of_res && name == Object.keys(result)[1]){
                      null_val = false
                      results.push(result[name])
                    }
                  });
                  if(null_val){
                    results.push(NaN)
                  }
                });
                if (server_info.name != undefined){
                  output_g.push({
                    label: server_info.name,
                    borderColor: server_info.color,
                    backgroundColor: 'black',
                    data: results,
                    fill: false,
                    borderWidth: 2,
                    spanGaps: true,
                    tension: 0.1,
                  })
                }
              });
            })
        })
        return [output_g, times_o]
  }

  var config = {
    type: 'line',
    data: {
      labels: ["",""],
      datasets: [
        {
            label: '',
            borderColor: '#ff0000',
            backgroundColor: 'black',
            data: [0,0],
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
          pan:{
            enabled:true,
            modifierKey: 'shift',
            threshold:0,
            mode: 'x'
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
                }
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
                  } else {
                  }
                  
                }
              },
              
              grid: {
                drawOnChartArea: false, // only want the grid lines for one axis to show up
              }

            },
      },
    },
  };

  function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

  const chart = document.getElementById('myChart')
  var myChart = new Chart(chart, config);

  const load_d = document.getElementById('load_d')
  
  load_d.addEventListener('click', async () => {
    graphData = await load_data()

    addLabels(myChart, graphData[1])
    addLine(myChart, graphData[0])
    setTimeout(function() {
      myChart.update()
    }, 500);
    window.api.receive("http_logs", (data) => {
      console.log(data)
    });
  })


  const resZ = document.getElementById('resetZoom')
  const zoomout = document.getElementById('zoomout')
  resZ.addEventListener('click', ()=>{
    myChart.resetZoom()
  })