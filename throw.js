;(function(window, undefined) {
  var library_private = 43;

  var success_fn = function(score) {console.log("UNINITIALIZED");}
  var failure_fn = function(score) {console.log("UNINITIALIZED");}

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
      return true;
    }
  };

  window.ninjathrow = ninjathrow;
})();
