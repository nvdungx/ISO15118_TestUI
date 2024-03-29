<template>
  <v-row
    align="start"
    class="list px-3 mx-auto"
  >
    <v-col
      cols="12"
      sm="12"
    >
      <v-card
        class="mx-auto spacing-playground pa-6"
        tile
      >
        <v-card-title>
          ISO15118-4 Conformance Testcases
          <v-spacer />
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          />
        </v-card-title>
        <v-data-table
          :headers="headers"
          :items="this.get_testcase_list"
          :search="search"
          :loading="isLoading"
          loading-text="Loading... Please wait"
          :hide-default-footer="true"
        >
          <template v-slot:top="{ pagination, options, updateOptions }">
            <v-data-footer
              :pagination="pagination"
              :options="options"
              items-per-page-text="$vuetify.dataTable.itemsPerPageText"
              @update:options="updateOptions"
            />
          </template>
          <template v-slot:[`item.status`]="{ item }">
            <v-chip
              :color="getColor(item.status)"
              dark
            >
              {{ status_map[item.status] }}
            </v-chip>
          </template>
          <template v-slot:[`item.build_status`]="{ item }">
            <v-chip
              :color="getColor(item.build_status)"
              dark
            >
              {{ item.build_status }}
            </v-chip>
          </template>
          <template v-slot:[`item.actions`]="{ item }">
            <v-icon
              large
              :color="isExecuted(item.id)"
              @click="executeTestcase(item)"
            >
              mdi-motion-play
            </v-icon>
            <v-icon
              large
              color="blue-grey"
              @click="editTestcase(item.id)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              large
              color="deep-orange"
              @click="deleteTestcase(item.id)"
            >
              mdi-delete
            </v-icon>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex'
import com_mixin from '../components/shared_mixin'

export default {
  name: 'TestcaseList',
  components: {},
  mixins: [com_mixin],
  watch: {
    '$route.params': 'refreshList'
  },
  mounted () {
  },
  created () {
    this.refreshList()
  },
  computed: {
    // mix the getters into computed with object spread operator
    ...mapGetters([
      'get_testcase_list',
      'get_current_execute_tc',
      'get_current_config'
    ])
  },
  data () {
    return {
      isLoading: false,
      search: '',
      status_map: {
        n: 'none',
        p: 'pass',
        i: 'inconclude',
        f: 'fail',
        e: 'error'
      },
      headers: [
        { text: 'Testcase', value: 'name', align: 'start', sortable: true, filterable: true },
        { text: 'Condition', value: 'condition', sortable: false },
        { text: 'Expected', value: 'expected', sortable: false },
        { text: 'PICS', value: 'pics', sortable: true },
        { text: 'PIXIT', value: 'pixit', sortable: true },
        { text: 'Status', value: 'status', sortable: true, filterable: true },
        { text: 'Build', value: 'build_status', sortable: true, filterable: true },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
  },
  methods: {
    isExecuted (id) {
      if ((id === this.get_current_execute_tc.id) && (this.get_current_execute_tc.isrunning)) {
        return 'green'
      } else {
        return 'gray'
      }
    },
    getColor (result) {
      if (result.toLocaleUpperCase() === 'P') return 'green'
      else if (result.toLocaleUpperCase() === 'N') return 'gray'
      else if (result.toLocaleUpperCase() === 'I') return 'orange'
      else if (result.toLocaleUpperCase() === 'OK') return 'green'
      else if (result.toLocaleUpperCase() === 'NA') return 'gray'
      else return 'red'
    },
    filterText (value, search) {
      return value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toString().toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) !== -1
    },
    refreshList () {
      this.isLoading = true
      // check route push has query param msg_type
      var query_params = {}
      if (this.$route.query.msg_type !== undefined) {
        query_params = { msg_type: this.$route.query.msg_type }
      }
      // trigger get find by name
      this.act_get_testcases(query_params)
        .then(() => {
          this.isLoading = false
        })
        .catch(() => {
          this.isLoading = false
        })
    },
    editTestcase (id) {
      this.$router.push({ name: 'testcase-detail', params: { id: id } })
    },
    deleteTestcase (id) {
      this.act_remove_testcase_id(id)
        .then((response) => {
          if (response.status === 200) {
            this.$router.push({ name: 'Home' })
          } else {
            alert(`Status code not 200 - ${response}`)
          }
        })
        .catch((e) => {
          alert(`Failed to delete testcase ${e.response}`)
        })
    },
    executeTestcase (testcase) {
      // check no testcase running then update data and execute
      this.executeTest(testcase)
    },
    ...mapMutations([
      'muta_update_execute_testcase',
      'muta_update_partial_current_cfg'
    ]),
    ...mapActions([
      'act_get_testcases',
      'act_check_exec_testcase',
      'act_remove_testcase_id',
      'act_execute_testcase'
    ])
  }
}
</script>

<style>
</style>
