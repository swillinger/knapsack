import styled from 'styled-components';

export const SwatchWrapper = styled.div`
  width: 49%;
  margin-bottom: 10px;
  border: solid 1px ${props => props.theme.globals.colors.neutral};
  display: flex;
  flex-direction: column;
  position: relative;
  h5 {
    margin: 0 0 0.5rem;
  }
`;

export const SwatchColorGradientBackground = styled.div`
  height: 100px;
  background-image: linear-gradient(
    to right,
    hsl(0, 0%, 0%),
    hsl(0, 0%, 0%) 9%,
    hsl(0, 0%, 10%) 9%,
    hsl(0, 0%, 10%) 18%,
    hsl(0, 0%, 20%) 18%,
    hsl(0, 0%, 20%) 27%,
    hsl(0, 0%, 30%) 27%,
    hsl(0, 0%, 30%) 36%,
    hsl(0, 0%, 40%) 36%,
    hsl(0, 0%, 40%) 45%,
    hsl(0, 0%, 50%) 45%,
    hsl(0, 0%, 50%) 54%,
    hsl(0, 0%, 60%) 54%,
    hsl(0, 0%, 60%) 63%,
    hsl(0, 0%, 70%) 63%,
    hsl(0, 0%, 70%) 72%,
    hsl(0, 0%, 80%) 72%,
    hsl(0, 0%, 80%) 81%,
    hsl(0, 0%, 90%) 81%,
    hsl(0, 0%, 90%) 90%,
    hsl(0, 0%, 100%) 90%,
    hsl(0, 0%, 100%)
  );
  margin-top: auto;
`;

export const SwatchColor = styled.div`
  background-color: ${props => (props.colorValue ? props.colorValue : 'auto')};
  margin: ${props => (props.hasOpacity ? '20px' : '0')};
  height: calc(100% - ${props => (props.hasOpacity ? '40px' : '0px')});
`;

export const SwatchInfo = styled.div`
  padding: 5px;
  background-color: ${props => (props.colorValue ? props.colorValue : 'auto')};
  margin-top: auto;
`;

export const RightLabel = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export const SwatchesWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
`;

export const CopyToClipboardWrapper = styled.span`
  cursor: pointer;
`;
