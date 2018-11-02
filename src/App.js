import React, {Component} from 'react'
import shuffle from 'lodash.shuffle'
import './App.css'
import Card from './Card'
import GuessCount from './GuessCount'
import HallOfFame, {FAKE_HOF} from './HallOfFame'

const SIDE = 6
const SYMBOLS = '😀🎉💖🎩🐶🐱🦄🐬🌍🌛🌞💫🍎🍌🍓🍐🍟🍿'
const VISUAL_PAUSE_MSECS = 750

class App extends Component {

    /*
    *     - currentPair  est un tableau représentant la paire en cours de sélection par la joueuse.
    *       À vide, aucune sélection en cours. Un élément signifie qu’une première carte a été retournée.
    *       Deux éléments signifient qu’on a retourné une seconde carte, ce qui déclenchera une analyse
    *       de la paire et l’avancée éventuelle de la partie.
    *
    *     - guesses est le nombre de tentatives de la partie en cours (nombre de paires tentées, pas nombre de clics)
    *
    *     - matchedCardIndices  liste les positions des cartes appartenant aux paires déjà réussies,
    *       et donc visibles de façon permanente.
    * */

    state = {
        cards: this.generateCards(),
        currentPair: [],
        guesses: 0,
        matchedCardIndices: [],
    }

    generateCards() {

        const result = []
        const size = SIDE * SIDE
        const candidates = shuffle(SYMBOLS)
        while (result.length < size) {
            const card = candidates.pop()
            result.push(card, card)
        }
        //les cartes identiques sont les unes à coté des autres donc re-shuffle
        return shuffle(result)
    }

    getFeedbackForCard(index) {
        const {currentPair, matchedCardIndices} = this.state
        const indexMatched = matchedCardIndices.includes(index)

        //on a retourné une carte lors d'une manche
        //elle est visible si elle fait parti d'une paire trouvé par le joueur precedemment
        //ou si c'est la carte qui vient d'être retourné
        if (currentPair.length < 2) {
            return indexMatched || index === currentPair[0] ? 'visible' : 'hidden'
        }
        //on a retourné exactement deux cartes
        //cette fois si l'indice se trouve dans currentPair
        //et qu'il est également enregistré dans les pairs réussies
        //c'est qu'on vient de trouver une bonne paire
        if (currentPair.includes(index)) {
            return indexMatched ? 'justMatched' : 'justMismatched'
        }
        //0 cartes joués visible si paire déja trouvé invisible sinon
        return indexMatched ? 'visible' : 'hidden'
    }

    // Arrow fx for binding
    handleCardClick = index => {
        const {currentPair} = this.state

        if (currentPair.length === 2) {

            //this.setState({currentPair: []})

            return
        }

        if (currentPair.length === 0) {
            this.setState({currentPair: [index]})
            return
        }
        // if (currentPair.length === 1)
        this.handleNewPairClosedBy(index)
    }


    handleNewPairClosedBy(index) {
        const { cards, currentPair, guesses, matchedCardIndices } = this.state

        const newPair = [currentPair[0], index]

        const newGuesses = guesses + 1

        const matched = cards[newPair[0]] === cards[newPair[1]]

        this.setState({ currentPair: newPair, guesses: newGuesses })

        if (matched) {

            this.setState({ matchedCardIndices: [...matchedCardIndices, ...newPair] })
        }

        setTimeout(() => this.setState({ currentPair: [] }), VISUAL_PAUSE_MSECS)
    }

    render() {

        const {cards, guesses, matchedCardIndices} = this.state;

        const won = matchedCardIndices.length === cards.length;

        return (
            <div className="memory">
                <GuessCount guesses={guesses}/>
                {cards.map((card, index) => (
                    <Card
                        card={card}
                        feedback={this.getFeedbackForCard(index)}
                        index={index}
                        key={index}
                        onClick={this.handleCardClick}/>
                ))}
                {won && <HallOfFame entries={FAKE_HOF}/>}
            </div>
        )
    }
}

export default App
