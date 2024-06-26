import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import arrowRight from '../../image/arrow_right.png';
import calenderIcon from '../../image/calendericon.png';

const Title = styled.div`
    color: #333;
    font-family: "Wanted Sans";
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FullContainer = styled.div`
    display: flex;
    width: 304px;
    justify-content: center;
    align-items: center;
    gap: 8px;
`;

const DateContainer = styled.div`
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    font-family: "Pretendard";
    font-size: 12px;
    border-radius: 2.5px;
    border: 1px solid #D9D9D9;
    background: #FFF;
    display: flex; 
    align-items: center; 
`;

const DateInput = styled(DatePicker)`
    width: 100%; 
    border-radius: 5px;
    font-family: "Pretendard";
    font-size: 12px;
    border: none; 
    margin-left: 8px; 
`;

const Arrow = styled.img`
    width: 20px;
    height: 20px;
    flex-shrink: 0;
`;

const CalenderIcon = styled.img`
    width: 16px;
    height: 16px;
    flex-shrink: 0;
`;

function DateRange({ onDateRangeSelect }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  useEffect(() => {
    if (startDate && endDate) {
      onDateRangeSelect(startDate, endDate);
    }
  }, [startDate, endDate, onDateRangeSelect]);

  return (
    <Container>
      <Title>Date Range</Title>
      <FullContainer>
        <DateContainer onClick={() => setShowStartDatePicker(true)}>
          <CalenderIcon src={calenderIcon} alt="Calender" />
          <DateInput
            selected={startDate}
            onChange={(date) => {
              setStartDate(date);
              setShowStartDatePicker(false);
            }}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy/MM/dd"
            onClickOutside={() => setShowStartDatePicker(false)}
          />
        </DateContainer>
        <Arrow src={arrowRight} alt="Arrow" />
        <DateContainer onClick={() => setShowEndDatePicker(true)}>
          <CalenderIcon src={calenderIcon} alt="Calender" />
          <DateInput
            selected={endDate}
            onChange={(date) => {
              setEndDate(date);
              setShowEndDatePicker(false);
            }}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy/MM/dd"
            onClickOutside={() => setShowEndDatePicker(false)}
          />
        </DateContainer>
      </FullContainer>
    </Container>
  );
}

export default DateRange;
