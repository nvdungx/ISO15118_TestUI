var comMixin = {
  methods: {
    parseTestcaseConfig: function (pics_str, pixit_str) {
      var config_json = ['', ''];
      [pics_str, pixit_str].forEach((config, index) => {
        config_json[index] = '{';
        // replace all \n and split by ,
        config.replaceAll(/\n/g, '').split(',').forEach(element => {
          // split key and value
          var items = element.split('=');
          // if not empty
          if (items.length > 1) {
            if ((items[1].trim() === "true") || (items[1].trim() === "false")) {
              config_json[index] += `"${items[0].trim()}":${items[1].trim()},`;
            }
            else if (!isNaN(parseFloat(items[1].trim())))
            {
              config_json[index] += `"${items[0].trim()}":${parseFloat(items[1].trim())},`;
            }
            else
            {
              config_json[index] += `"${items[0].trim()}":"${items[1].trim()}",`;
            }
          }
        })
        if (config_json[index].length > 1) {
          config_json[index] = config_json[index].slice(0, -1) + '}';
        } else {
          config_json[index] += '}';
        }
        config_json[index] = JSON.parse(config_json[index]);
      });
      return { pics: config_json[0], pixit: config_json[1] };
    },
    __getLeafProp (input_obj, leaf_schema, root_schema) {
      Object.keys(input_obj).forEach((prop) => {
        if (typeof input_obj[prop] === 'string' || input_obj[prop] instanceof String) {
          // base, get int value
          // // console.log('check: ', prop, input_obj[prop]);
          if (leaf_schema.properties[prop].enum !== undefined) {
            // // console.log('enum: ', leaf_schema['properties'][prop]['enum'])
            const result = leaf_schema.properties[prop].enum.findIndex((val) => { return (val === input_obj[prop]) })
            input_obj[prop] = result
          } else if (leaf_schema.properties[prop].$ref !== undefined) {
            let obj = root_schema
            // // console.log('REF: ', prop, leaf_schema['properties'][prop]['$ref'])
            for (const key of leaf_schema.properties[prop].$ref.split('/')) {
              if (key !== '#') {
                obj = obj[key]
              }
            }
            if (obj.enum !== undefined) {
              // // console.log('enum $ref: ', obj['enum'])
              const result_ref = obj.enum.findIndex((val) => { return (val === input_obj[prop]) })
              input_obj[prop] = result_ref
            }
          }
        } else if (typeof input_obj[prop] === 'object' || input_obj[prop] instanceof Object) {
          var next_schema = leaf_schema.properties[prop]
          this.__getLeafProp(input_obj[prop], next_schema, root_schema)
        } else if (Array.isArray(input_obj[prop])) {
          for (let i = 0, l = input_obj[prop].length; i < l; i++) {
            this.__getLeafProp(input_obj[prop][i], leaf_schema, root_schema)
          }
        } else {
          // pass
        }
      })
    },
    getConfigInt: function (input_config, schema) {
      // stupid language, clone
      var send_config = JSON.parse(JSON.stringify(input_config))
      for (const section in send_config) {
        this.__getLeafProp(send_config[section], schema[section.toUpperCase()], schema[section.toUpperCase()])
      }
      return send_config
    },
    executeTest (testcase) {
      this.act_check_exec_testcase({ id: testcase.id, query_params: { action: 'get_info' } })
        .then((response) => {
          this.muta_update_execute_testcase(response.data)
          if (this.get_current_execute_tc.isrunning == false) {
            this.muta_update_execute_testcase({ id: testcase.id, name: testcase.name, isrunning: true })
            // parse config pics, pixit string and update config data
            this.muta_update_partial_current_cfg(this.parseTestcaseConfig(testcase.pics, testcase.pixit))
            var config = this.getConfigInt(this.get_current_config, this.$store.state.SCHEMA)
            this.act_execute_testcase({ id: this.get_current_execute_tc.id, config: config })
              .then((response) => {
                console.log(response.data)
              })
              .catch((e) => {
                this.muta_update_execute_testcase({ id: testcase.id, name: testcase.name, isrunning: false })
                console.log(e)
              })
          } else {
            alert(`Testcase ${this.get_current_execute_tc.name} is already in execution`)
          }
        })
        .catch((e) => {
          this.muta_update_execute_testcase({ id: testcase.id, name: testcase.name, isrunning: false })
          console.log(e)
        })
    }
  }
}

export default comMixin
