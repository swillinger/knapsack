import styled from 'styled-components';

export const PageLayoutWithoutSidebar = styled.div`
  display: grid;
  grid-template: 86px 1fr 112px / 1fr;
  height: 100vh;
  @media (max-width: 649px) {
    grid-template: 86px 1fr 178px / 1fr;
  }
`;
