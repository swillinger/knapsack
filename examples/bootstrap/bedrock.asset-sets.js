const globalBedrockOverrideArtifacts = [
  { src: './public/css/bedrock-overrides.css' },
  ];

module.exports = {
  bootstrap: {
    id: 'bootstrap',
    title: 'Bootstrap',
    // inlineJs: `document.body.setAttribute('data-theme', 'bootstrap');`,
    assets: [
      { src: './public/css/bootstrap.css' },
      { src: './public/js/bootstrap.bundle.js' },
      ...globalBedrockOverrideArtifacts,
    ],
  },
  material: {
    id: 'material',
    title: 'Material',
    // inlineJs: `document.body.setAttribute('data-theme', 'bootstrap');`,
    assets: [
      { src: './public/css/material.css' },
      { src: './public/css/material-theming.css' },
      ...globalBedrockOverrideArtifacts,
    ],
  },
};
