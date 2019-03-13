import React from 'react'

function getField(props){
    let type = props.type||'text';
    let p = {
        id: (props.id || (props.name + new Date().getTime())),
        name: props.name,
        value: (props.value || '')
    }
    props.onChange && (p['onChange'] = props.onChange);
    switch (props.type) {
        case 'textarea': return <textarea {...p} ></textarea>
        default: return <input type={type} {...p} />
    }
}

export default class FormField extends React.Component {
    constructor(props){
        super(props)
    }
    
    render(){
        return(<div className="formField">
            <label className="text">{this.props.label}</label>
            {getField(this.props)}
            <label className="validation"></label>
        </div>)
    }
}