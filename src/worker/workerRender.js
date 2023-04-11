var app = new Vue({
  el: '#app',
  data: {
    tasks: [],
    workers: [],
    activeTasks: [],
    form: {
      worker: null
    }
  },
  methods: {
    async loadTasks() {
      //send = { params: { worker: "1" } }
      send = {}
      await window.api.httpRequest("requestGetWorker", send)

      await window.api.receive("fromRequestGetWorker", (workers) => {
        console.log(workers)
        this.workers = workers;
      });
    },
    async loadWorkers() {
      send = { params: { worker: "1" } }
      await window.api.httpRequest("requestGetTask", send)

      await window.api.receive("fromRequestGetTask", (tasks) => {
        this.tasks = tasks;
      });
    },
    async loadWorkerActiveTasks() {

      send = { params: { workerId: this.form.worker } }
      await window.api.httpRequest("requestGetActiveTasks", send)

      await window.api.receive("fromRequestGetActiveTasks", (activeTasks) => {
        this.activeTasks = activeTasks;
      });

    },
    async toggleTask(taskId, event) {
      send = { params: {"taskId": taskId, "workerId": this.form.worker} }
      if (event.target.checked) {
        //insert
        
        window.api.httpRequest("requestAssociateTask",send)
        //await window.api.httpRequest("requestAssociateTask", send)
        /*await window.api.receive("fromRequestAssociateTask", (response) => {
          console.log("insert", response);
        });*/
        
      } else {
        //delete
        window.api.httpRequest("requestDeleteAssociateTask",send)
        console.log("delete");
      }
    }
  },
  async mounted() {
    await this.loadTasks();
    await this.loadWorkers();
  }
})