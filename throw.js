;(function(window, undefined) {
  "use strict";
  var library_private = 43;

  var success_fn = function(score, betas, gammas, accels) {console.log("UNINITIALIZED");}
  var failure_fn = function(score, betas, gammas, accels) {console.log("UNINITIALIZED");}

  var launch_threshold = 29;
  var airborne_threshold = 10;
  var landing_threshold = 19;

  var oldmags = new Array();
  var min_samples = 3;

  var old_x = 0;
  var old_y = 0;
  var old_z = 0;

  var tick = 0;
  var state = "READY";

  var sumbeta = 0;
  var oldbeta = null;
  var dbeta = 0;

  var start_time;
  var end_time;

  var timeout_handle;

// arrays containing motion data samples
  var betas;
  var gammas;
  var accels;

  function handleOrientation(event) {
         var beta = event.beta;

         // record raw samples for later graphing
         betas.push(beta);
         gammas.push(event.gamma);

         if (oldbeta === null) {
             oldbeta = beta;
         }

         dbeta = Math.abs(Number(oldbeta.toFixed()) - Number(beta.toFixed()));

         if (dbeta > 10) {
             sumbeta = sumbeta + dbeta;
             oldbeta = beta;
         }
  }

  // FILL IN YOUR CALL BACK HANDLER CODE HERE
  function handleSomethingOrOther(event) {
         var x = event.accelerationIncludingGravity.x;
         var y = event.accelerationIncludingGravity.y;
         var z = event.accelerationIncludingGravity.z;

         var mag = Math.sqrt(x*x + y*y + z*z); 
         accels.push(mag);

         // this is our first tick; init values for old accelerations
      if (old_x === null && old_y === null && old_z == null) {
          old_x = x;
          old_y = y;
          old_z = z;
      }

      if (state != "DONE") {

          if (state == "READY") {
                         oldmags.push(mag);

                        if (oldmags.length >= min_samples) {
                            // see if the last min_samples mags are all within close variance

                            // compute variance
                            var mean = 0;
                            var variance = 0;

                            for (var i = oldmags.length - min_samples; i < oldmags.length; i++) {
                                mean += oldmags[i];
                            }

                            mean = mean / min_samples;

                            for (var i = oldmags.length - min_samples; i < oldmags.length; i++) {
                                variance += Math.pow(oldmags[i] - mean, 2);
                            }

                            variance = variance / min_samples;

                            if (variance < airborne_threshold) {
                                state = "AIRBORNE";
                                start_time = new Date();

                                old_x = x;
                                old_y = y;
                                old_z = z;
                            }
                        }
          }

          if (state == "AIRBORNE") {
             tick = tick + 1;
             var diff = Math.sqrt((x-old_x)*(x-old_x) + (y-old_y)*(y-old_y) + (z-old_z)*(z-old_z));

             old_x = x;
             old_y = y;
             old_z = z;

             if (diff > landing_threshold) {
                 state = "DONE";
                     var score =  new Object();
                     var now_time = new Date();
                     var airtime = now_time.getTime() - start_time.getTime();

                     score.rotations_raw = Math.floor((sumbeta / 360) * 100) / 100;
                     score.rotations = Math.floor((sumbeta / 360) * 300);
                     score.airtime  = Math.floor(airtime);

                     score.total = score.rotations + Math.floor(0.5*airtime);

                     clearTimeout(timeout_handle);
                     success_fn(score, betas, gammas, accels);
             }
          }
  }

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

      oldmags = new Array();
    
      timeout_handle = window.setTimeout(function() {state = "DONE"; failure();}, 5000);
      old_x = null;
      old_y = null;
      old_z = null;
    
      tick = 0;
      state = "READY";
    
      sumbeta = 0;
      oldbeta = null;
      dbeta = 0;

      gammas = new Array();
      betas = new Array();
      accels = new Array();

      // START YOUR CALL BACKS HERE
      // window.addEventListener('devicemotion'...
      window.ondevicemotion = handleSomethingOrOther;
      window.ondeviceorientation = handleOrientation;

      return true;
    }
  };

  window.ninjathrow = ninjathrow;
})(window);
