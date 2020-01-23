import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import urlJoin from 'url-join';
import { KsButton, KsPopover } from '@knapsack/design-system';
import knapsackLogo from '@knapsack/design-system/src/assets/knapsack-logo-trans.svg';
import { plugins } from '../plugins';
import { Navs } from '../../schemas/plugins';
import './site-header.scss';
import { useSelector } from '../store';
import { KsTemplateLanguageSelect } from './template-language-select';

export const SiteHeader: React.FC = () => {
  const settings = useSelector(s => s.settingsState.settings);
  const primaryNavItems = useSelector(s => s.navsState.primary);
  const canEdit = useSelector(s => s.userState.canEdit);
  const hasMultipleTemplateRenderers = useSelector(
    s => Object.keys(s.patternsState?.renderers ?? {}).length > 1,
  );

  const settingsMenuContent = (
    <ul className="ks-site-header__settings-menu">
      {canEdit && (
        <li>
          <NavLink to="/settings">General Settings</NavLink>
        </li>
      )}
      <li>
        <a
          href="https://knapsack.basalt.io/docs/getting-started"
          target="_blank"
          rel="noopener noreferrer"
        >
          Knapsack Docs
        </a>
      </li>
      <li>
        <a href="/demo-urls">Demo URLs</a>
      </li>
      {plugins.getPlugins().map(plugin => {
        if (!plugin.addPages) {
          return null;
        }
        return plugin
          .addPages()
          .filter(page => page?.navItem?.nav === Navs.primarySub)
          .map(page => {
            const path = urlJoin('/', plugin.id, page.path);
            return (
              <li key={path} className="ks-site-header__nav-item">
                <NavLink to={path} className="ks-site-header__nav-link">
                  {page.navItem.title}
                </NavLink>
              </li>
            );
          });
      })}
    </ul>
  );

  return (
    <header className="ks-site-header">
      <h3>
        <img
          className="ks-site-header__logo"
          src={knapsackLogo}
          alt="Knapsack Logo Mark"
        />
        <Link className="ks-site-header__header-link" to="/">
          {settings.title}
        </Link>
      </h3>

      <ul className="ks-site-header__nav">
        {primaryNavItems.map(navItem => (
          <li className="ks-site-header__nav-item" key={navItem.id}>
            {navItem.path ? (
              <NavLink className="ks-site-header__nav-link" to={navItem.path}>
                <strong>{navItem.name}</strong>
              </NavLink>
            ) : (
              <span>{navItem.name}</span>
            )}
          </li>
        ))}

        {plugins.getPlugins().map(plugin => {
          if (!plugin.addPages) {
            return null;
          }
          return plugin
            .addPages()
            .filter(page => page?.navItem?.nav === Navs.primary)
            .map(page => {
              const path = urlJoin('/', plugin.id, page.path);
              return (
                <li key={path} className="ks-site-header__nav-item">
                  <NavLink to={path} className="ks-site-header__nav-link">
                    {page.navItem.title}
                  </NavLink>
                </li>
              );
            });
        })}

        {hasMultipleTemplateRenderers && (
          <li className="ks-site-header__nav-item">
            <KsTemplateLanguageSelect />
          </li>
        )}

        {settings.parentBrand?.title && settings.parentBrand?.homepage && (
          <li className="ks-site-header__nav-item">
            <a
              href={settings.parentBrand.homepage}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'white',
                textDecoration: 'none',
              }}
            >
              {(settings.parentBrand.logo && (
                <img
                  src={settings.parentBrand.logo}
                  alt={settings.parentBrand?.title}
                  style={{ height: '1rem' }}
                />
              )) ||
                settings.parentBrand?.title}
            </a>
          </li>
        )}
        <li className="ks-site-header__nav-item ks-site-header__nav-icon">
          <KsPopover content={settingsMenuContent} trigger="click">
            <KsButton icon="settings" kind="icon" size="m" />
          </KsPopover>
        </li>
      </ul>
    </header>
  );
};
