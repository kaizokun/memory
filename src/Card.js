import React, {Component} from 'react'
import './Card.css'

const HIDDEN_SYMBOL = '❓'

class Card extends Component {

    constructor (props) {

        super(props)

        this.card = props.card;

        this.feedback = props.feedback;
    }

    render(){

        return(
            <div className={`card ${this.feedback}`} onClick={() => this.handleCardClick()}>
                <span className="symbol">
                    {this.feedback === 'hidden' ? HIDDEN_SYMBOL : this.card}
                </span>
            </div>
        )
    }

    handleCardClick() {

        console.log(this.card, 'clicked')
    }

}

export default Card
