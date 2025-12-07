// the 'Update Vehicle' button on vehicle modification is disabled. Remove the 'disable' when a change is made
// note: I made an error handler that will not let the user set an update if an already existing vehicle exists, this function pretty much similar to this so either one of the code can be redundant.
const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
      const updateBtn = document.querySelector("button")
      updateBtn.removeAttribute("disabled")
    })