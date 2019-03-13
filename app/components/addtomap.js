import React from 'react'
import SimpleReactValidator from 'simple-react-validator'
import FormField from 'components/common/formfield'
import { translate } from 'utils/common'


export default class AddToMap extends React.Component {
    constructor(props){
        super(props)
        this.state = {location:this.props.itemToEdit}
        this.handleInputChange = this.handleInputChange.bind(this)
        this.addLocation = this.addLocation.bind(this)
    }
    
    componentWillMount(){
        this.validator = new SimpleReactValidator();
    }

    handleInputChange(event) {
		var location = this.state.location;
		location[event.target.name] = event.target.value;
        this.setState((state) => {
            return {location: location};
        })
    }

    addLocation(){
        if (this.validator.allValid()) {
            this.props.addLocation(this.state.location)
        } else {
            this.validator.showMessages()
            this.forceUpdate();
        }
    }

    render(){
        return(<div className="addMapContainer">
                <FormField 
                    name="placeName"
                    value={this.state.location.placeName}
                    onChange={this.handleInputChange}
                    label={translate("mapcontainer.add_form.label.place_name")} ></FormField>
                {this.validator.message('placeName', this.state.location.placeName, 'required')}
                <FormField 
                    name="tooltip"
                    onChange={this.handleInputChange}
                    value={this.state.location.tooltip}
                    label={translate("mapcontainer.add_form.label.tooltip")} 
                    type="textarea"
                ></FormField>
                <FormField 
                    name="latitude" 
                    onChange={this.handleInputChange}
                    value={this.state.location.latitude}
                    label={translate("mapcontainer.add_form.label.lat")} ></FormField>
                {this.validator.message('latitude', this.state.location.latitude, 'required|numeric')}
                <FormField 
                    name="longitude" 
                    onChange={this.handleInputChange}
                    value={this.state.location.longitude}
                    label={translate("mapcontainer.add_form.label.long")} ></FormField>
                {this.validator.message('longitude', this.state.location.longitude, 'required|numeric')}
                <div className="operations">
                    <button className="btn btn-success" onClick={this.addLocation}>{translate('mapcontainer.add_form.operations.save')}</button> or <button className="btn" onClick={this.props.cancel}>{translate('mapcontainer.add_form.operations.cancel')}</button>
                </div>
            </div>)
    }
}