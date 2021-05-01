import { useRef, useState } from "react";
import { CARD_NUMBER, FORMAT_CHAR } from "../constants";

import { isNumberValue } from "../utils";

const unformatCardNumbers = (formattedValue) => {
  return formattedValue.replace(FORMAT_CHAR.CARD_NUMBERS_SEPARATOR_REG, "");
};

const splitCardNumbers = (value) => {
  return value.replace(/\D/g, "").match(/.{1,4}/g) || [];
};

const useCardNumbers = (initialCardNumbers) => {
  const [cardNumbers, setCardNumbers] = useState(initialCardNumbers);
  const cardNumbersInputRef = useRef();

  const onCardNumbersChange = (event) => {
    const { value, selectionStart } = event.target;
    const joinedCardNumbers = cardNumbers.join(
      FORMAT_CHAR.CARD_NUMBERS_SEPARATOR
    );
    const diff = value.length - joinedCardNumbers.length;
    let updatedCardNumbers = joinedCardNumbers;

    const mod =
      CARD_NUMBER.PARTIAL_LENGTH + FORMAT_CHAR.CARD_NUMBERS_SEPARATOR.length;
    const remainder = selectionStart % mod;

    const isSelectionValid = [
      ...Array(FORMAT_CHAR.CARD_NUMBERS_SEPARATOR.length),
    ].every((_, index) => remainder !== (mod - index) % mod);

    const fixedSelectionStart = isSelectionValid
      ? selectionStart
      : selectionStart + ((mod + 1 - remainder) % mod);

    cardNumbersInputRef?.current?.setSelectionRange(
      fixedSelectionStart,
      fixedSelectionStart
    );

    switch (true) {
      case diff > 0:
        if (!isNumberValue(value[selectionStart - 1])) {
          return;
        }

        updatedCardNumbers =
          joinedCardNumbers.slice(0, selectionStart - 1) +
          value[selectionStart - 1] +
          joinedCardNumbers.slice(selectionStart - 1);
        break;
      case diff === 0:
        if (!isNumberValue(value[selectionStart - 1])) {
          return;
        }

        updatedCardNumbers =
          joinedCardNumbers.slice(0, selectionStart - 1) +
          value[selectionStart - 1] +
          joinedCardNumbers.slice(selectionStart);
        break;
      case diff < 0:
        updatedCardNumbers =
          joinedCardNumbers.slice(0, selectionStart) +
          joinedCardNumbers.slice(selectionStart + 1);
        break;
      default:
    }

    const unformattedValue = unformatCardNumbers(updatedCardNumbers);
    const splitNumbers = splitCardNumbers(unformattedValue);

    setCardNumbers(splitNumbers);
  };

  return [cardNumbers, cardNumbersInputRef, onCardNumbersChange];
};

export default useCardNumbers;
