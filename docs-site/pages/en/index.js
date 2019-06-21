/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const { MarkdownBlock } = CompLibrary; /* Used to read markdown */
const { Container } = CompLibrary;
const { GridBlock } = CompLibrary;

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = '' } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle">
        Welcome to {siteConfig.title}
        <small>{siteConfig.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <a href="#getting-started" className="button button--c2a">Install</a>
            <a href={docUrl('getting-started')} className="button">Getting Started</a>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = '' } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Block = props => (
      <Container
        id={props.id}
        background={props.background}
        className={props.className}
      >
        {props.title &&
          <h1 className="blockSectionTitle">{props.title}</h1>
        }
        <GridBlock
          align="center"
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const GettingStarted = () => (
      <div className="gettingStartedBlock" id="getting-started">
        <h1 className="blockSectionTitle">Getting Started</h1>
        <code>
          npm create knapsack my-design-system<br />
          cd my-design-system<br />
          npm install<br />
          npm start
        </code>
        <PromoSection>
          <a href={docUrl('getting-started')} className="button">Read the Docs</a>
          <a href={siteConfig.repoUrl} className="button button--c2a" target="_blank">GitHub</a>
        </PromoSection>
      </div>
    );

    const LearnMore = () => (
      <div className="learnMoreBlock" style={{ textAlign: 'center' }}>
        <h1 className="blockSectionTitle">Want to learn more about Knapsack?</h1>
        <a href="mailto:knapsack@basalt.io" className="button">Contact Us</a>
      </div>
    );

    const Features = () => (
      <Block className="featuresBlock" layout="fourColumn" title="A new, open source, scalable platform for multi-brand design systems">
        {[
          {
            content: 'Allows integration points cross-discipline',
            image: `/icon/route.svg`,
            imageAlign: 'top',
            title: '',
          },
          {
            content: 'Facilitates documentation to ensure clear component intention, properties, and use cases',
            image: `/icon/documentation.svg`,
            imageAlign: 'top',
            title: '',
          },
          {
            content: 'Prototypes full experiences in our Page Builder',
            image: `/icon/pagebuilder.svg`,
            imageAlign: 'top',
            title: '',
          },
          {
            content: 'Builds coded components for your design system',
            image: `/icon/component.svg`,
            imageAlign: 'top',
            title: '',
          },
        ]}
      </Block>
    );

    const Showcase = () => {
      if ((siteConfig.users || []).length === 0) {
        return null;
      }

      const showcase = siteConfig.users
        .filter(user => user.pinned)
        .map(user => (
          <figure className="user-badge" key={user.id}>
            <div className="img-wrapper">
              <img src={user.image} alt="" />
            </div>
            <figcaption>
              <blockquote>{user.caption}</blockquote>
              <h5>- {user.byline}</h5>
            </figcaption>
          </figure>
        ));

      const pageUrl = page => baseUrl + (language ? `${language}/` : '') + page;

      return (
        <div className="productShowcaseSection">
          <div className="inner">
            <h1 className="blockSectionTitle">What are people saying about Knapsack?</h1>
            <div className="user-wrapper">{showcase}</div>
            {/*<div className="more-users">*/}
              {/*<a className="button" href={pageUrl('users.html')}>*/}
                {/*More {siteConfig.title} Users*/}
              {/*</a>*/}
            {/*</div>*/}
          </div>
        </div>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <Features />
          <GettingStarted />
          <Showcase />
          <LearnMore />
        </div>
      </div>
    );
  }
}

module.exports = Index;
