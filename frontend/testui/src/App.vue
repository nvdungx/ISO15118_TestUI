<template>
  <v-app>

    <v-app-bar app dark>

      <v-btn to="/" text>
        TestUI
      </v-btn>

      <v-btn to="/testcases" text>
        Testcases
      </v-btn>
      
      <v-btn to="/new" text>
        New
      </v-btn>

      <v-btn to="/execute" text>
        Execute
      </v-btn>

    </v-app-bar>

    <v-main>
      <!-- <keep-alive max="5">  :key="$route.fullPath"-->
        <router-view></router-view>
      <!-- </keep-alive> -->
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: "app",
  created() {
    this.$store.state.logging_socket.onopen = () => {
      console.log('WebSockets connection created.');
      this.$store.dispatch('act_check_exec_testcase', {id:"1", query_params:{action:"get_info"}})
      .then((response) => {
        // console.log(response.data)
        this.$store.commit('muta_update_execute_testcase', response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    };
    this.$store.state.logging_socket.onmessage = (response) => {
      var recv = JSON.parse(response.data);
      if (recv.status === 'update') {
        this.$store.dispatch('act_check_exec_testcase', {id:"1", query_params:{action:"get_info"}})
        .then((response) => {
          // console.log('socket update status receive ',response.data)
          this.$store.commit('muta_update_execute_testcase', response.data);
        })
        .catch((e) => {
          console.log(e);
        });
      }
      else if (recv.status === 'none') {
        // pass
      }
      this.$store.commit('mutate_update_logging_data', recv.message);
    }
  }
};
</script>
