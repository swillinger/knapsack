import fontAvenirLightTTF from '@basalt/bedrock/src/client/assets/fonts/avenir--light.ttf';
import fontAvenirLightWOFF from '@basalt/bedrock/src/client/assets/fonts/avenir--light.woff';
import fontAvenirLightWOFF2 from '@basalt/bedrock/src/client/assets/fonts/avenir--light.woff2';
import fontAvenirMediumTTF from '@basalt/bedrock/src/client/assets/fonts/avenir--medium.ttf';
import fontAvenirMediumWOFF from '@basalt/bedrock/src/client/assets/fonts/avenir--medium.woff';
import fontAvenirMediumWOFF2 from '@basalt/bedrock/src/client/assets/fonts/avenir--medium.woff2';
import fontDinCondensedTTF from '@basalt/bedrock/src/client/assets/fonts/din-condensed--regular.ttf';
import fontDinCondensedWOFF from '@basalt/bedrock/src/client/assets/fonts/din-condensed--regular.woff';
import fontDinCondensedWOFF2 from '@basalt/bedrock/src/client/assets/fonts/din-condensed--regular.woff2';

export const addGlobalFonts = `
  @font-face {
      font-family: "AvenirLight";
      src: url("${fontAvenirLightWOFF2}") format("woff2"), url("${fontAvenirLightWOFF}") format("woff"), url("${fontAvenirLightTTF}") format("truetype");
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "AvenirMedium";
      src: url("${fontAvenirMediumWOFF2}") format("woff2"), url("${fontAvenirMediumWOFF}") format("woff"), url("${fontAvenirMediumTTF}") format("truetype");
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: "DinCondensed";
      src: url("${fontDinCondensedWOFF2}") format("woff2"), url("${fontDinCondensedWOFF}") format("woff"), url("${fontDinCondensedTTF}") format("truetype");
      font-weight: normal;
      font-style: normal;
    }
`;
