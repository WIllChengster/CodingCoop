import React, {Component} from 'react';

class UpVote extends Component{
    constructor(props){
        super(props);

        this.state= {
            value: 0
        }
        this.handleAddVote = this.handleAddVote.bind(this);
        this.handleDeleteVote = this.handleDeleteVote.bind(this);
    }

    handleAddVote(){        
        console.log('handleAddVote: ', this.state.value);       

        this.setState({
           value: this.state.value + 1
        });
    }

    handleDeleteVote(){        
        console.log('handledeleteVote: ', this.state.value);           
        
        this.setState({
            value: this.state.value - 1
        });

        if(this.state.value < 1) {
            this.setState({
                value: 0
            });
        } 
    }

    render(){



    
        return(

            <div className="col justify-content-center">                                           
                <div className="text-center" onClick={this.handleAddVote}> <i className="fas fa-angle-up fa-2x"></i></div>                 

                <div className="text-center">{this.state.value}</div>

                <div className="" onClick={this.handleDeleteVote}> <i className="fas fa-angle-down fa-2x"></i> </div>
            </div>
        )
    }
}

export default UpVote;