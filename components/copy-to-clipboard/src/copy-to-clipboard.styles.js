import styled from 'styled-components';

export const CopiedText = styled.code`
  background-color: #6ed300;
  opacity: ${props => (props.hasCopied ? '1' : '0')};
  transition: opacity ease-in ${props => (props.hasCopied ? '0s' : '1s')};
  will-change: opacity;
  transform: translateZ(0);
  margin-left: 2px;
`;
