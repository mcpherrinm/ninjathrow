;(function(window, undefined) {
  "use strict";
  var library_private = 43;

  var success_fn = function(score) {console.log("UNINITIALIZED");}
  var failure_fn = function(score) {console.log("UNINITIALIZED");}

  var airtime = 0;

  var launch_threshold = 29;
  var airborne_threshold = 10;
  var landing_threshold = 12;

  var oldmags = new Array();
  var max_mag = 0;
  var min_samples = 3;

  var old_x = 0;
  var old_y = 0;
  var old_z = 0;

  var tick = 0;
  var state = "READY";

  var sumbeta = 0;
  var oldbeta = null;
  var dbeta = 0;

  function handleOrientation(event) {
         var beta = event.beta;
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

         tick = tick + 1;

         if (mag > launch_threshold && state == "READY") {
             state = "THROWING";
             oldmags[0] = mag;
         }

         if (state == "THROWING") {
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
                     document.getElementById("status").innerHTML = "AIRBORNE";
                     sumbeta = 0;
                     airtime += 1;

                     old_x = x;
                     old_y = y;
                     old_z = z;
                 }

             }
         }

         if (state == "AIRBORNE") {
             airtime += 1;
             var diff = Math.sqrt((x-old_x)*(x-old_x) + (y-old_y)*(y-old_y) + (x-old_z)*(z-old_z));

             old_x = x;
             old_y = y;
             old_z = z;

             if (diff > landing_threshold) {
                 state = "DONE";

//                 if (airtime <= 2) {
//                     var score =  new Object();
//                     score["total"] = 0;
//                     score["total"] += (sumbeta / 360) * 100; // 100 points per rotation
//                     score["total"] += 100*airtime; // 100 points per tick of airtime
//
//                     score["rotations"] = sumbeta / 360;
//                     score["airtime"] = airtime;
//
//                     failure_fn(score);
//                 } else {
                     var score =  new Object();
                     score["total"] = 0;
                     score["total"] += (sumbeta / 360) * 100; // 100 points per rotation
                     score["total"] += 100*airtime; // 100 points per tick of airtime

                     score["rotations"] = sumbeta / 360;
                     score["airtime"] = airtime;

                     success_fn(score);
//                 }
             }
         }

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
      window.ondevicemotion = handleSomethingOrOther;
      window.ondeviceorientation = handleOrientation;

      return true;
    }
  };

  window.ninjathrow = ninjathrow;
})(window);
