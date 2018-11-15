import styled from 'styled-components';

export const HomeSplashWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
`;

export const HomeSplashCore = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-sizing: border-box;
  text-align: right;
  min-height: 87vh;
  @media screen and (min-width: 450px) {
    min-height: 85vh;
    padding: 2rem;
  }
`;

export const EyeBrow = styled.h2`
  color: grey;
  margin: 0 0 -0.25rem;
  font-size: 3.75vw;
  @media screen and (min-width: 600px) {
    font-size: 2.75vw;
  }
  @media screen and (min-width: 1000px) {
    margin: 0;
  }
`;

export const Title = styled.h1`
  font-size: ${props => (props.vw ? props.vw : 10)}vw;
  line-height: 1;
`;

export const Subtitle = styled.h2`
  font-size: 4vw;
  @media screen and (min-width: 600px) {
    font-size: 3vw;
  }
`;

export const VersionTag = styled.p`
  margin-top: -1rem;
  font-size: 3vw;
  @media screen and (min-width: 600px) {
    font-size: 2vw;
  }
`;
