;(function(window, undefined) {
  var library_private = 43;

  var success_fn = function(score) {console.log("UNINITIALIZED");}
  var failure_fn = function(score) {console.log("UNINITIALIZED");}

  // FILL IN YOUR CALL BACK HANDLER CODE HERE
  function handleSomethingOrOther(event) {
  // handle this event and store the data or something
  // if stuff is doen:
    // decide if you're good enough:
      // if(goodenough) {
      //   success_fn(some sort of score);
      // } else {
      //    failure_fn(some sort of score);
      // }
  };




  var ninjathrow = {
    doit: function(success, failure) {
      // stash those success / failure functions
      // in a local above, and call them in your callbacks
      if(!success || !failure) {
        console.log("doit needs two args, success and failure");
        console.log(success);
        console.log(failure);
        return false;
      }
      success_fn = success;
      failure_fn = failure;

      // START YOUR CALL BACKS HERE
      // window.addEventListener('devicemotion'...
      window.setTimeout(function() {failure(9000)}, 2500);

      return true;
    }
  };

  window.ninjathrow = ninjathrow;
})(window);
