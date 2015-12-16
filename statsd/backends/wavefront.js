/*jshint node:true, laxcomma:true */

var util = require('util');
var net = require('net');
var https = require('https');
    
function WavefrontBackend(startupTime, config, emitter){
  var self = this;
 
  this.wavefrontServer = config.wavefrontServer;
  this.wavefrontAuthToken = config.wavefrontAuthToken;
    
  this.lastFlush = startupTime;
  this.lastException = startupTime;
  this.config = config.console || {};

  // attach
  emitter.on('flush', function(timestamp, metrics) { 
      self.flush(timestamp, metrics);
  });
  emitter.on('status', function(callback) { self.status(callback); });
}

/*var body = JSON.stringify({
      "test.metric2": {
        "value": 2,
        "tags": {
          "key1": "v1",
          "key2": "v2"
        }
      }
})*/


var postStats = function wavefrontPostStats(metricsJSON, wfServer, wfToken) {
    
    var metricsString = JSON.stringify(metricsJSON);
    //console.log(body);
    var request = https.request(
        {
            hostname: wfServer,
            path: '/report/metrics?h=evan.wfproxy1',
            port: 443,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-AUTH-TOKEN': wfToken,
                'Content-Length': Buffer.byteLength(metricsString)
            }   
        }
    );
    
    request.on('error', function(e) {
       console.log(e); 
    });
    
    request.end(metricsString);
}

WavefrontBackend.prototype.flush = function(timestamp, metrics, wfServer, wfToken) {
  console.log('Flushing stats at ', new Date(timestamp * 1000).toString());
  console.log("Wavefront Server: " + this.wavefrontServer);
        
  var out = {
    counters: metrics.counters,
    timers: metrics.timers,
    gauges: metrics.gauges,
    timer_data: metrics.timer_data,
    counter_rates: metrics.counter_rates,
      
    sets: function (vals) {
      var ret = {};
      for (var val in vals) {
        ret[val] = vals[val].values();
      }
      return ret;
    }(metrics.sets),

    pctThreshold: metrics.pctThreshold
  };

    function parseTags(metricName) {
        var tags = {};
        var strTags = metricName.split("_t_");
        for (var i=1;i<strTags.length;i++) {
            var tagAndVal = strTags[i].split("_v_");
            var tag = tagAndVal[0];
            var val = tagAndVal[1];
            tags[tag] = val;
        }
        return tags;
    }
    
    var keys = Object.keys(out)
    var data = {};
    //iterate over the keys
    for (var i=0;i<keys.length;i++) {
      //supported metric types
      var key = keys[i];
      if (key == "timers" || key == "gauges" || key == "counters" || key == "counter_rates" ) {
        var metricNames = Object.keys(out[key]);
        for (var x=0;x<metricNames.length;x++) {
            var metricName = metricNames[x];
            //get the metric value
            var metricValue = out[key][metricName];
            //if (metricName) newMetricName = newMetricName+".rate";
            var tags = {};
            var finalMetricName = metricName.toString();
            if (metricName.indexOf("_t_") > -1) {
                var tags = parseTags(metricName);
                finalMetricName = metricName.split("_t_")[0];
                //console.log("What is this:" + metricName.split("_t_")[0]);
            }
            //if this is a counter_rate, append ".rate" to the metric name
            //if (key == "counter_rates") finalMetricName = finalMetricName+".rate";
            finalMetricName = key+"."+finalMetricName;
            //console.log(finalMetricName + ":" + metricValue);
            dataVal = {};
            dataVal["value"] = metricValue    
            data[finalMetricName] = dataVal;
            if (tags) data[finalMetricName]["tags"] = tags;
        }
      }
        
    }
    console.log("Posting metrics to Wavefront API. " + this.wavefrontServer);
    console.log(data);
    postStats(data, this.wavefrontServer,this.wavefrontAuthToken);
    
  if(this.config.prettyprint) {
    //console.log(util.inspect(out, {depth: 5, colors: true}));
  } else {
    //PARSE HERE!
    //console.log(out);
  }

};


WavefrontBackend.prototype.status = function(write) {
  ['lastFlush', 'lastException'].forEach(function(key) {
    write(null, 'console', key, this[key]);
  }, this);
};

exports.init = function(startupTime, config, events) {
  var instance = new WavefrontBackend(startupTime, config, events);
  return true;
};