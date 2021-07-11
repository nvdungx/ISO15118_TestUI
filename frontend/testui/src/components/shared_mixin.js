var comMixin = {
    methods: {
        parseTestcaseConfig: function (pics_str, pixit_str) {
            var config_json = ['', ''];
            [pics_str, pixit_str].forEach((config, index) =>{
              config_json[index] = "{";
              // replace all \n and split by ,
              config.replaceAll(/\n/g, '').split(",").forEach(element => {
                // split key and value
                var items = element.split("=");
                // if not empty
                if (items.length > 1) {
                  config_json[index] += `"${items[0].trim()}":"${items[1].trim()}",`;
                }
              });
              if (config_json[index].length > 1) {
                config_json[index] = config_json[index].slice(0, -1) + "}";
              }
              else {
                config_json[index] += "}";
              }
              config_json[index] = JSON.parse(config_json[index]);
            });
            return {pics: config_json[0], pixit: config_json[1]};
        },
        getIntConfig: function (input_config, schema) {
          var send_config = {...input_config};
          Object.getOwnPropertyNames(send_config).forEach(element => {
            // console.log(`------${element}--------`);
            Object.getOwnPropertyNames(input_config[element]).forEach(key => {
              // if type of key value === string
              if (typeof input_config[element][key] === 'string' || input_config[element][key] instanceof String) {
                if (Object.prototype.hasOwnProperty.call(schema[element.toUpperCase()].properties[key],"enum"))
                {
                  var result = schema[element.toUpperCase()].properties[key]["enum"].findIndex((val) => { return (val === input_config[element][key]); });
                  if (result !== -1) {
                    send_config[element][key] = result;
                    // console.log(input_config[element][key], " in ", schema[element.toUpperCase()].properties[key]["enum"], send_config[element][key]);
                  }
                  else {
                    send_config[element][key] = input_config[element][key];
                    // console.log("Fail enum string", send_config[element][key])
                  }
                }
                else {
                  // console.log("Warning: String value is not belong enum");
                  send_config[element][key] = input_config[element][key];
                }
              }
              else if (schema[element.toUpperCase()].properties[key].type === 'object') {
                Object.getOwnPropertyNames(input_config[element][key]).forEach(sub_key => {
                  if (typeof input_config[element][key][sub_key] === 'string' || input_config[element][key][sub_key] instanceof String)
                  {
                    var result = schema[element.toUpperCase()].properties[key].properties[sub_key]["enum"].findIndex((val) => { return (val === input_config[element][key][sub_key]); });
                    if (result !== -1) {
                      send_config[element][key][sub_key] = result;
                      // console.log(input_config[element][key][sub_key], " in ", schema[element.toUpperCase()].properties[key].properties[sub_key]["enum"], send_config[element][key][sub_key]);
                    }
                    else {
                      send_config[element][key][sub_key] = input_config[element][key][sub_key];
                      // console.log("Fail enum string", send_config[element][key][sub_key])
                    }
                  }
                  else {
                    send_config[element][key][sub_key] = input_config[element][key][sub_key];
                  }
                });
              }
              else {
                send_config[element][key] = input_config[element][key];
                // console.log(key, send_config[element][key]);
              }
            });
          });
          // console.log(send_config);
          return send_config;
        }
    },
};

export default comMixin;