import { setCookie } from 'utils/cookie';
import {  LANG } from 'utils/constants';

const dynaParamSep = ':';


export function resolveApiUrl(urlKey, params = {}) {
  let baseurl;
  if (app.apis[urlKey]) {
    urlKey = app.apis[urlKey];
    baseurl = app.apis.baseurl;
  }
  else {
    baseurl = app.apis.baseurl;
  }

  if(urlKey.startsWith('http://'))
    return urlKey;

  let url = [];
  baseurl && url.push(baseurl);
  urlKey = urlKey.split('/');

  params = { ...app.pageParams, ...params };
  for (let urlPart of urlKey) {
    let urlPart2 = urlPart.slice(1);
    if (urlPart.charAt(0) == dynaParamSep && params[urlPart2]) {
      urlPart = params[urlPart2] + '';
      delete params[urlPart2];
    }
    urlPart && urlPart.length && url.push(urlPart);
  }
  return url.join("/");
}

export function setLang(lang) {
  setCookie(LANG, lang);
  document.body.attributes.lang.value = lang;
}

export function getCurrentPathWithQuery(params = {}) {
  let url = resolveRouterPath(app.pageInfo.path, params, null, false);
  return getPageUrlWithQuery(url, app.pageInfo.query);
}


export function translate(resourceKey) {
  return app.translations[resourceKey] || resourceKey;
}


