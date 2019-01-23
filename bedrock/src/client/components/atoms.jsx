import styled from 'styled-components';

export const PatternStatusIcon = styled.span.attrs({
  title: props => props.title,
})`
  background-color: ${props => (props.color ? props.color : '#ccc')};
  width: 0.5em;
  height: 0.5em;
  display: inline-block;
  border-radius: 0.5em;
  margin-left: 0.5em;
`;
