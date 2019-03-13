import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { translate } from 'utils/common';
import AddToMap from 'components/addtomap'
import dataService from 'utils/dataservice'
import Loader from 'components/loader'

const key = window.app.apiKey
  
export class MapContainer extends React.Component {
    constructor(props){
        super(props)
        this.onShow = this.onShow.bind(this)
        this.onCancel = this.onCancel.bind(this)
        this.onEdit = this.onEdit.bind(this)
        this.onDelete = this.onDelete.bind(this);
        this.showMessage = this.showMessage.bind(this);
        this.addLocation = this.addLocation.bind(this)

        this.state = { 
            locations: [],
            showForm:false,
            location: {},
            loading:true,
            center: {
                lat: 51.146166, lng: 9.771430
            }
        }
      }
    componentDidMount(){
        dataService.get("markerList",{})
        .then(res=> {
            console.log(res);
            this.setState((state) => {
                return {locations: res.markersList, loading:false};
            })
            
        }).catch((err) => {
            this.showMessage('error', err.message || "!Error");
            this.setState({loading: false});
        });
    }
    
    addLocation(location){
        this.setState({loading: true},()=>{
            let processResponse = (res)=>{
                if(res.status == "SUCCESS")
                {
                    if(location.id)
                    {
                        this.setState((state)=>{
                            let newLocations = [...state.locations.filter(c=>c.id!==location.id), location]
                            return {locations: newLocations}
                        })
                    }
                    else
                    {
                        location.id=res.data;
                    
                        this.setState((state)=>{
                            let newLocations = [...state.locations,location]
                            return {locations: newLocations}
                        })
                    }
                    this.showMessage('success', res.message);
                    this.onCancel();
                }
                else if(res.status == "FAILURE")
                {
                    this.showMessage('error', res.message);
                }
                this.setState({loading: false}); 
            }

            let processError = (err)=> {
                this.showMessage('error', err.message || "!Error");
                this.setState({loading: false});
            }
            if(location.id)
                dataService.put("markerUpdate",location)
                .then(res=> {
                    processResponse(res);
                }).catch((err) => {
                    processError(err)
                })
            else
                dataService.post("markerInsert",location)
                .then(res=> {
                    processResponse(res);
                }).catch((err) => {
                    processError(err)
                })
        })
    }

    onShow(){
        this.setState({showForm: false},() => {
            this.setState({showForm: true, location: {}});
        }) 
    }

    onCancel() {
        this.setState((state) => {
            return {showForm: false, location: {}};
        })
    }

    onDelete(location) {
        this.setState({loading: true},()=>{
            dataService.delete("markerDelete",{id:location.id})
            .then(res=> {
                if(res.status == "SUCCESS")
                {
                    this.setState((state) => {
                        let locations = this.state.locations;
                        locations = locations.filter(c=>c.id != location.id)
                        return {locations: locations};
                    })
                    this.showMessage('success', res.message);
                }
                else if(res.status == "FAILURE")
                {
                    this.showMessage('error', res.message);
                }
                this.setState({loading: false});    
            }).catch((err) => {
                this.showMessage('error', err.message || "!Error");
                this.setState({loading: false});
            });
        });
    }

    onEdit(location){
        this.setState({showForm: false},() => {
            this.setState({showForm: true, location: location});
        }) 
    }
    showMessage(type, message){
        this.setState({messageType: type, message: message});
        setTimeout(() => {
            this.setState({messageType: "none"})
        }, 3000);
    }

    render(){
        return(
            <React.Fragment >
                {this.state.loading && <Loader />}
                <Map
                    google={this.props.google}
                    initialCenter={this.state.center}
                    className="map"
                    zoom={7}>
                    {
                        this.state.locations && this.state.locations.map(
                        (location, index) => <Marker
                                        key={index}
                                        name={location.placeName}
                                        position={{ lat: location.latitude, lng: location.longitude }}
                                        title={location.tooltip}
                                        />
                        )    
                    }
                    
                </Map>
                <div className="grid">
                    <div>
                        <button className="btn btn-primary" 
                            onClick={this.onShow}
                            >{translate('mapcontainer.operations.add_map')}</button>
                        <label className={"message "+this.state.messageType}>{this.state.message}</label>
                    </div>
                    {this.state.showForm && <AddToMap cancel={this.onCancel} 
                        itemToEdit={this.state.location} 
                        inputChange={this.handleInputChange}
                        addLocation={this.addLocation}
                    />}
                    <hr></hr>
                    {this.state.locations && this.state.locations.map((location, index)=><div className="item" key={"item"+index}>
                        <div className="header">{location.placeName}</div>
                        <div>{location.tooltip}</div>
                        <div>{translate('mapcontainer.label.lat')}: {location.latitude}</div>
                        <div>{translate('mapcontainer.label.long')}: {location.longitude}</div>
                        <div className="btn-container">
                            <button className="btn btn-default" onClick={(e) => {this.onEdit(location)}} >{translate('mapcontainer.operations.edit')}</button> or <button className="btn btn-danger" onClick={(e) => {this.onDelete(location)}} >{translate('mapcontainer.operations.delete')}</button>
                        </div>
                    </div>)}
                   
                </div>
            </React.Fragment>
            )
    }

}

export default GoogleApiWrapper({
    apiKey: key
  })(MapContainer);