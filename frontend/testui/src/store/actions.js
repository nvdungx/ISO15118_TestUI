import {
    Promise
} from 'es6-promise';
import common from './api/ajax';
import store from '../store';

export default {
    act_get_summary: (context) => {
        return new Promise((resolve, reject) => {
            common.getRequest(
                '/summary/', {},
                function (res) {
                    context.commit('muta_update_summary', {
                        summary_info: res.data
                    })
                    resolve(res)
                },
                function (error) {
                    reject(error)
                }
            )
        })
    }
}