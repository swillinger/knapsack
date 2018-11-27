import styled from 'styled-components';

export const FooterWrapper = styled.footer`
  padding: 1.5rem;
  border-top: 1px solid #000000;
  background-color: ${props => props.theme.footer.background};
  color: white;
  display: flex;
  flex-direction: column;
  p,
  && a {
    color: white;
  }
  ul,
  li {
    margin-bottom: 2px;
  }
`;

export const FooterInner = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const FooterMenu = styled.ul`
  display: flex;
  list-style: none;
  padding: 0;
`;

export const FooterMenuItem = styled.li`
  margin-right: 10px;
`;

export const SubFooterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  color: white;
  p {
    font-size: 0.65rem;
    a {
      text-decoration: underline;
    }
  }
  p,
  && a {
    color: white;
  }
`;
