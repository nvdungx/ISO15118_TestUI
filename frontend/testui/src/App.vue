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
};
</script>
