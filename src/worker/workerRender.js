
window.api.send("getWorkers")

window.api.receive("getWorkers", (sett) => {
  alert(sett)
})