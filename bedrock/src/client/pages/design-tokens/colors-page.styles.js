import styled from 'styled-components';

export const ColorsDemoBox = styled.div`
  display: inline-block;
  min-height: 135px;
  margin: 0 2.5rem 2.5rem 0;
  position: relative;
  width: 325px;
  vertical-align: top;
  padding: 0.7rem;
`;

export const TextColorDemo = styled.div`
  display: inline-block;
  margin: 0 2.5rem 2rem 0;
  position: relative;
  width: 325px;
  vertical-align: top;
  padding: 0.7rem;
  * {
  color: ${props => props.color};
  }
`;

export const HrDemoWrapper = styled.div`
  margin-bottom: 3rem;
  p {
    margin: 0;
    display: block;
    clear: left;
  }
  hr {
    float: left;
  }
`;

export const HrDemo = styled.hr`
  display: block;
  width: 300px;
  color: ${props => props.color};
`;
