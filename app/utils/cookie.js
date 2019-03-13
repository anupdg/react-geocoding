
const cookieExp = 5*365*24*60*60*1000;
  export function setCookie(key,value,exp){
    exp=exp||new Date(+new Date+cookieExp);
    exp="expires="+exp.toUTCString();
    document.cookie=key+"="+encodeURIComponent(value)+";"+exp+";path=/"
  }

  export function removeCookie(key,value,exp){
    exp=exp||new Date(+new Date-10000);
    exp="expires="+exp.toUTCString();
    document.cookie=key+"="+encodeURIComponent(value)+";"+exp+";path=/"
  }
  
  export function getCookie(key){
    key+="=";
    for(var values=document.cookie.split(";"),c=0;c<values.length;c++){
      for(var value=values[c];" "==value.charAt(0);)
        value=value.substring(1);
      if(0===value.indexOf(key))
        return decodeURIComponent(value.substring(key.length,value.length))
    }
    return""
  }