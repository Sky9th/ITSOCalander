import axios from "axios";
import { apiList } from '../config/api'
import { env } from '../config/env'
import { Loading } from 'element-ui';

export var apiConfig = {
    // `url` is the server URL that will be used for the request
    url: '',

    // `method` is the request method to be used when making the request
    method: '', // default

    // `baseURL` will be prepended to `url` unless `url` is absolute.
    // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
    // to methods of that instance.
    baseURL: '',

    // `headers` are custom headers to be sent
    headers: {'X-Requested-With': 'XMLHttpRequest'},

    // `params` are the URL parameters to be sent with the request
    // Must be a plain object or a URLSearchParams object
    params: {},

    data: {},

    // `timeout` specifies the number of milliseconds before the request times out.
    // If the request takes longer than `timeout`, the request will be aborted.
    timeout: 15000, // default is `0` (no timeout)

    // `withCredentials` indicates whether or not cross-site Access-Control requests
    // should be made using credentials
    withCredentials: false, // default
    // `responseType` indicates the type of data that the server will respond with
    // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
    //   browser only: 'blob'
    responseType: 'json', // default

    // `responseEncoding` indicates encoding to use for decoding responses (Node.js only)
    // Note: Ignored for `responseType` of 'stream' or client-side requests
    responseEncoding: 'utf8', // default

    // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
    xsrfCookieName: 'XSRF-TOKEN', // default

    // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
    xsrfHeaderName: 'X-XSRF-TOKEN', // default

    // `maxContentLength` defines the max size of the http response content in bytes allowed in node.js
    maxContentLength: 2000,

    // `maxBodyLength` (Node only option) defines the max size of the http request content in bytes allowed
    maxBodyLength: 2000,

    // `maxRedirects` defines the maximum number of redirects to follow in node.js.
    // If set to 0, no redirects will be followed.
    maxRedirects: 5, // default
};

export default {
    name: "api",
    loading: false,

    $ (endpoint) {
        console.log('--------api endpoint:' + endpoint + '-----------')
        let api = apiList[endpoint]
        if (!api) { console.log('--------no endpoint---------');return false; }
        return this.request(api.method, api.url)
    },

    request (method, url, data, param) {
        let that = this
        let config = {
            url,
            method,
            params: param ? param : (method === 'get' ? data : {}),
            data: method !== 'get' ? data : {}
        };
        let instance = axios.create(Object.assign(apiConfig, env[process.env.NODE_ENV]));

        instance.interceptors.request.use(function (config) {
            console.log('--------start endpoint----------');
            that.showLoading();
            return config;
        }, function (error) {
            // Do something with request error
            console.log('--------error endpoint----------');
            return Promise.reject(error);
        });

        return instance.request(config)
    },

    get (url, data, param) {
        return this.request('get', url, data, param)
    },

    post (url, data, param) {
        return this.request('post', url, data, param)
    },

    put (url, data, param) {
        return this.request('put', url, data, param)
    },

    delete (url, data, param) {
        return this.request('delete', url, data, param)
    },

    showLoading () {
        this.loading = Loading.service();
    },
    hideLoading () {
        if(this.loading) this.loading.close()
    }
}