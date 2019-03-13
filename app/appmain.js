import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/sass/home.scss';
import {getCookie} from 'utils/cookie';

import dataService from 'utils/dataservice';
import {setLang,getCurrentPathWithQuery} from 'utils/common';
import {LANG} from 'utils/constants';

import Loader from 'components/loader';
import { LazyLoadModule } from "./lazy";

const defaultLang = 'en';
window.app = window.app || {pageParams : {lang:defaultLang}};


class Main extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {appinit:false}

        this.languageChanged = this.languageChanged.bind(this);    

        this.initApp = this.initApp.bind(this)
        
        this.initApp();
    }
    
    async loadConfig(){

        try {
            let response = await fetch(process.env.CONFIG_PATH);
            if (!response.ok) {
                throw Error(response.statusText);
            }
            console.log('before response');
            let data = await response.json();
            console.log(data);
            window.app = { ...window.app, ...data };
            this.loadPortalSettings();
            return data;
          } catch(err) {
           
            console.log(err);
            
          }
        
    }
    
    initApp(){
        app.apiConfig = this.loadConfig();
       
        app.defaultLocale = defaultLang;
        app.selectedLocale = defaultLang;
        app.pageUris = {};
        app.routesMap = {};
        app.pageInfo = {query:{},params:{}};
    }
 
    languageChanged([newLang]){
        setLang(newLang);
        const history = app.history;
        app.history = null;
        const url = getCurrentPathWithQuery({lang:newLang});
        if(history){
            history.push(url);
        } else {
            location.reload();
        }
        
        this.setState({appinit:false});
        this.loadPortalSettings();
    }

    loadPortalSettings(){     
        let localeCode =  getCookie(LANG) || 'en';
        dataService.get('portalSettings',{localeCode:localeCode}).then(res=>{
            window.app = { ...window.app, ...res };
            this.setState({appinit:true});
        }).catch((err) => {
        });
    }

    render () {
        if(!this.state.appinit)  return <Loader />
        return(
            <div className="mapContainer">
                {this.state.appinit && <LazyLoadModule resolve={() => import("./components/maploader")} /> }
            </div>
            
        )
    }
}

ReactDOM.render(<Main />, document.getElementById('approot'))
