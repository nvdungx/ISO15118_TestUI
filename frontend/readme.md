node -v
npm -v
sudo apt-get install node npm
sudo npm install --global vue
sudo npm install --global vue-cli
vue create project; cd project
npm install vuetify vue-router vuex

cd frontend/testui; npm install

echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

argument to specify attribute name of template
v-bind:arg="data"         > :arg (bind arg to specify data)   :[`dynamic argument. i.e. javascript`]
v-slot:arg=""             > #arg ()
v-on:arg="eventhandler"   > @arg (bind arg to specify event)

computed properties are cached based on their reactive dependencies. A computed property will only re-evaluate when some of its reactive dependencies have changed.
In comparison, a method invocation will always run the function whenever a re-render happens.
watch properties. When you have some data that needs to change based on some other data

If you use the colon, the contents of the attribute are evaluated as Javascript.
If you don't, it's a string.
<my-component my-attr="foobar"></my-component>
<my-component :my-attr="'foobar'"></my-component>

<my-component :my-attr="foobar"></my-component>
...tries to find a property on the Vue instance called "foobar" and binds to the value of that.

<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/testcaselist">TestcaseList</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
