import React, { Component } from 'react'
import MaskedInput from 'react-text-mask'
import {
  fakeGiftCardProvider,
  GiftCard,
  VerifiedCard,
} from '../providers/fakeGiftCardProvider'
import { GiftCardInfo } from './GiftCardInfo'
import injectSheet, { ClassNameMap } from 'react-jss'

const styles = {
  form: {
    fontFamily: "'Work Sans', monospace",
    width: 432,
    color: '#333',
    fontSize: 12,
    padding: 10,

    '& button': {
      fontFamily: "'Work Sans', monospace",
      fontSize: 12,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#FFFFFF',
      height: 44,
      width: 140,
      padding: '15px 0',
      display: 'block',
      background: '#333333',
      border: '1px solid #000000',
    },
  },
  formTitle: {
    fontWeight: 500,
    fontSize: 14,
  },
  hintMessage: {
    color: '#666666',
    fontWeight: 300,
  },
  cardInfoWrapper: {
    marginTop: 5,
  },
  cardInputsContainer: {
    display: 'flex',
    '& input': {
      height: 44,
      padding: 10,
      background: '#FFFFFF',
      border: '1px solid #CCCCCC',
      margin: '14px 0 10px',

      '&:first-child': {
        flexGrow: 1,
      },
      '&:last-child': {
        width: 100,
        marginLeft: 10,
      },
      '&::placeholder': {
        fontFamily: "'Work Sans', monospace",
        fontSize: 12,
        color: '#666666',
        fontWeight: 300,
      },
    },
  },
}

type Props = {
  classes: ClassNameMap<keyof typeof styles>
}

type State = {
  hasGiftCard: boolean
  cards: VerifiedCard[]
  newCard: GiftCard
}

class FormGiftCards extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasGiftCard: false,
      cards: [],
      newCard: {
        number: '',
        code: '',
      },
    }
  }

  onHasGiftCardChanged = () => {
    this.setState(prevState => ({
      hasGiftCard: !prevState.hasGiftCard,
    }))
  }

  onSubmit = (card: GiftCard) => {
    if (this.state.cards.find(c => c.number === card.number)) {
      // do nothing - no task description
      return
    }
    try {
      const verifiedCard = fakeGiftCardProvider.verifyCard(card)
      this.setState(prevState => ({
        cards: prevState.cards.concat(verifiedCard),
        newCard: {
          number: '',
          code: '',
        },
      }))
    } catch (err) {
      // do nothing - no task description
      console.info(err)
    }
  }

  onNewCardChanged = (card: Partial<GiftCard>) => {
    this.setState(prevState => ({
      newCard: {
        ...prevState.newCard,
        ...card,
      },
    }))
  }

  render() {
    const { classes } = this.props
    const cardNumberMask = Array.from('xxxx xxxx xxxx xxxx xxx').map(char => {
      return char === 'x' ? /\d/ : char
    })

    return (
      <form
        className={classes.form}
        onSubmit={e => {
          e.preventDefault() // added submit only to see html5 validation
          this.onSubmit(this.state.newCard)
        }}
      >
        <h4 className={classes.formTitle}>Gift Cards</h4>

        {/*
        I've not implemented custom checkbox because in figma you have it as a picture
         and only in one state.
        Plus it's ok to have some implementation of such component in project,
        so I just don't want to waste time on creating it from scratch now.
        */}
        <label>
          <input
            type="checkbox"
            checked={this.state.hasGiftCard}
            onChange={this.onHasGiftCardChanged}
          />
          <span>Do you have a gift card?</span>
        </label>

        {this.state.hasGiftCard && (
          <>
            <p className={classes.hintMessage}>
              Please enter the 19-digit number and code from your gift card
              below.
            </p>
            {this.state.cards.map(card => (
              <div className={classes.cardInfoWrapper}>
                <GiftCardInfo key={card.number + card.code} card={card} />
              </div>
            ))}
            <div className={classes.cardInputsContainer}>
              <MaskedInput
                value={this.state.newCard.number}
                mask={cardNumberMask}
                placeholder="Gift Card Number"
                pattern="\d{4} \d{4} \d{4} \d{4} \d{3}"
                required
                onChange={e =>
                  this.onNewCardChanged({ number: e.target.value })
                }
              />
              <MaskedInput
                value={this.state.newCard.code}
                mask={[/\d/, /\d/, /\d/]}
                placeholder="Control Code"
                pattern="\d{3}"
                required
                onChange={e => this.onNewCardChanged({ code: e.target.value })}
              />
            </div>
            <button>APPLY</button>
          </>
        )}
      </form>
    )
  }
}

export default injectSheet(styles)(FormGiftCards)
