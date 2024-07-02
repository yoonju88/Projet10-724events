import React, { useEffect, useState, useMemo } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";
import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  const byDateDesc = useMemo(() => {
    if (!data?.focus) return []; // data?.focus가 없는 경우 빈 배열을 반환합니다.
    return data.focus.slice().sort((evtA, evtB) => new Date(evtA.date) < new Date(evtB.date) ? -1 : 1);
  }, [data]); // data가 변경될 때마다 새로 계산합니다.

  // 다음 카드를 설정하는 함수
  const nextCard = () => {
    setIndex(prevIndex => prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0);
  };
  // useEffect를 사용하여 다음 카드를 5초마다 변경합니다.
  useEffect(() => {
    const timer = setTimeout(nextCard, 5000);
    return () => clearTimeout(timer); // cleanup 함수에서 타이머를 정리합니다.
  }, [index, byDateDesc]);  

  return (
    <div className="SlideCardList">
      {byDateDesc?.map((event, idx) => (
        <React.Fragment key={event.title}>
          <div className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}>
            <img src={event.cover} alt="forum" />
            <div className="SlideCard__descriptionContainer">
              <div className="SlideCard__description">
                <h3>{event.title}</h3>
                <p>{event.description}</p>
                <div>{getMonth(new Date(event.date))}</div>
              </div>
            </div>
          </div>
          <div className="SlideCard__paginationContainer">
            <div className="SlideCard__pagination">
              {byDateDesc.map((radio, radioIdx) => (
                <input
                  key={radio.title}
                  type="radio"
                  name="radio-button"
                  checked={index === radioIdx}
                  readOnly
                />
              ))}
            </div>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

export default Slider;
