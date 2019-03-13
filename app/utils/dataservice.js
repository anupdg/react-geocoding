import {resolveApiUrl} from 'utils/common';
import {METHOD_GET,METHOD_POST,METHOD_PUT,METHOD_DELETE} from 'utils/constants';

const defaultOpt = {
  mode: "cors",
  credentials: "include",
  headers: {
      "Content-Type": "application/json; charset=utf-8"
  }
}
const defaultGetOpt = {
  method: METHOD_GET,
  ...defaultOpt
}
const defaultPostOpt = {
    method: METHOD_POST,
    ...defaultOpt
}

const defaultPutOpt = {
  method: METHOD_PUT,
  ...defaultOpt
}

const defaultDeleteOpt = {
  method: METHOD_DELETE,
  ...defaultOpt
}

class DataService { 

    async get(urlkey, params, options={}){

      let opt = {...defaultGetOpt,...options}

      let url = resolveApiUrl(urlkey,params);

      return this.ajax(url, opt);
    }

    async delete(urlkey, params, options={}){
      let opt = {...defaultDeleteOpt,...options}

      let url = resolveApiUrl(urlkey,params);

      return this.ajax(url, opt);
    }

    async post(urlkey, params, options={}){
      let opt = {...defaultPostOpt,...options}

      let url = resolveApiUrl(urlkey,params);

      params["lang"] = app.pageParams.lang;
      opt["body"] = JSON.stringify( params)
      return this.ajax(url, opt);
    }

    async put(urlkey, params, options={}){
      let opt = {...defaultPutOpt,...options}
      let url = resolveApiUrl(urlkey,params);

      params["lang"] = app.pageParams.lang;
      opt["body"] = JSON.stringify( params)
      return this.ajax(url, opt);
    }

    async ajax(url, opt){
      let data = await( await(fetch(url, opt)
        .then(response => {
          let contentType = response.headers.get("content-type");
          let jres = response;
          if(contentType && contentType.includes("application/json")) {
            jres = response.json();
          }   
          if(response.ok) {
            return jres;
          } else {
            if(!jres) throw {'error':"error"}
            return jres.then(Promise.reject.bind(Promise));
          }
        
        })));
      return data;

    }
}
    
export default new DataService()