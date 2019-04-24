import React from 'react'
import { VerifiedCard } from '../providers/fakeGiftCardProvider'
import injectSheet, { ClassNameMap } from 'react-jss/lib/injectSheet'

const styles = {
  container: {
    backgroundColor: '#F2F2F2',
    height: 56,
    padding: 10,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 12,
  },
  cardNumber: {
    marginTop: 5,
    fontWeight: 300,
  },
  discount: {
    fontWeight: 'bold',
  },
}

type Props = {
  card: VerifiedCard
  classes: ClassNameMap<keyof typeof styles>
}

function formatMoney(n: number) {
  return n.toFixed(2).replace('.', ',')
}

const GiftCardInfoComponent: React.FC<Props> = ({ card, classes }) => {
  return (
    <div className={classes.container}>
      <div>
        <div>Gift Card</div>
        <div className={classes.cardNumber}>
          **** **** **** **** {card.code}
        </div>
      </div>
      <div className={classes.discount}>-€{formatMoney(card.discount)}</div>
    </div>
  )
}

export const GiftCardInfo = injectSheet(styles)(GiftCardInfoComponent)
