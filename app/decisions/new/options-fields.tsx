"use client";

import { useState } from "react";

const minimumOptions = 2;
const maximumOptions = 6;

export function OptionsFields() {
  const [optionIds, setOptionIds] = useState([0, 1]);
  const [nextId, setNextId] = useState(2);

  function addOption() {
    if (optionIds.length >= maximumOptions) {
      return;
    }

    setOptionIds((current) => [...current, nextId]);
    setNextId((current) => current + 1);
  }

  function removeOption(optionId: number) {
    if (optionIds.length <= minimumOptions) {
      return;
    }

    setOptionIds((current) => current.filter((id) => id !== optionId));
  }

  return (
    <fieldset className="decisionOptions">
      <legend>선택지</legend>
      <p>최소 2개, 최대 6개까지 직접 입력할 수 있습니다.</p>

      <div className="optionFields">
        {optionIds.map((optionId, index) => (
          <div className="optionField" key={optionId}>
            <label htmlFor={`option-${optionId}`}>
              선택지 {index + 1}
            </label>
            <input
              id={`option-${optionId}`}
              maxLength={120}
              name="options"
              placeholder={index === 0 ? "예: 김치찌개" : "예: 돈가스"}
              required
              type="text"
            />
            {optionIds.length > minimumOptions ? (
              <button
                aria-label={`선택지 ${index + 1} 삭제`}
                className="removeOptionButton"
                onClick={() => removeOption(optionId)}
                type="button"
              >
                삭제
              </button>
            ) : null}
          </div>
        ))}
      </div>

      {optionIds.length < maximumOptions ? (
        <button
          className="secondaryAction addOptionButton"
          onClick={addOption}
          type="button"
        >
          + 선택지 추가
        </button>
      ) : null}
    </fieldset>
  );
}
