/*jshint node:true, laxcomma:true */

var util = require('util');
var net = require('net');
var http = require('http');
    
function WavefrontBackend(startupTime, config, emitter){
  var self = this;
 
  this.wavefrontProxyServer = config.wavefrontProxyServer;
  this.wavefrontProxyPort = config.wavefrontProxyPort;
    
  this.lastFlush = startupTime;
  this.lastException = startupTime;
  this.config = config.console || {};

    
    
  this.parseTags = function(metricName) {
        var tags = {};
        var strTags = metricName.split("_t_");
        try {
            for (var i=1;i<strTags.length;i++) {
                var tagAndVal = strTags[i].split("_v_");
                var tag = tagAndVal[0];
                var val = tagAndVal[1];
                tags[tag] = val;
            }
        } catch(e) {
            console.log("ERROR parsing tags. If using tags, make sure each tag has a value.");
            console.log(e);
        }
        return tags;
    }    
    
    
  this.postStats = function (metricsJSON, wfProxy, wfPort) {
    
    var metricsString = JSON.stringify(metricsJSON);
    //console.log(body);
    var request = http.request(
        {
            hostname: wfProxy,
            //path: '/report/metrics?h=evan.wfproxy1',
            port: wfPort,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(metricsString)
            }   
        }
    );
    
    request.on('error', function(e) {
        console.log(e);
    });
    
    request.end(metricsString);
}
  
  
  // attach
  emitter.on('flush', function(timestamp, metrics) { 
      self.flush(timestamp, metrics);
  });
  emitter.on('status', function(callback) { self.status(callback); });
}

WavefrontBackend.prototype.flush = function(timestamp, metrics, wfServer, wfToken) {
  console.log('Flushing stats at ', new Date(timestamp * 1000).toString());      
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
                var tags = this.parseTags(metricName);
                finalMetricName = metricName.split("_t_")[0];
                //console.log("What is this:" + metricName.split("_t_")[0]);
            }
            finalMetricName = key+"."+finalMetricName;
            dataVal = {};
            dataVal["value"] = metricValue    
            data[finalMetricName] = dataVal;
            if (tags) data[finalMetricName]["tags"] = tags;
        }
      }
        
    }
    console.log("Posting metrics to Wavefront Proxy at " + this.wavefrontProxyServer + ":" + this.wavefrontProxyPort);
    this.postStats(data, this.wavefrontProxyServer,this.wavefrontProxyPort);
    
  if(this.config.prettyprint) {
    console.log(util.inspect(out, {depth: 5, colors: true}));
    console.log("Wavefront JSON String:" + JSON.stringify(data));
  } else {
    console.log("Wavefront JSON String:" + JSON.stringify(data));
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