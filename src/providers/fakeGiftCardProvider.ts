export type GiftCard = {
  number: string
  code: string
  discount?: number
}

export type VerifiedCard = Required<GiftCard>

export const fakeGiftCardProvider = {
  verifyCard(card: GiftCard): VerifiedCard {
    switch (card.number) {
      case '0000 1111 2222 3333 444':
      case '5555 6666 7777 8888 999':
      case '0000 0000 0000 0000 000':
      case '2222 2222 2222 2222 222':
      case '1111 1111 1111 1111 111':
        return {
          ...card,
          discount: Math.round(Math.random() * 100),
        }
      default:
        throw new Error(`Invalid card: ${JSON.stringify(card)}`)
    }
  },
}
