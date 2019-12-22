import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { plugins } from '@knapsack/core';
import urlJoin from 'url-join';
import { KsButton } from '@knapsack/design-system';
import knapsackLogo from '../assets/knapsack-logo-trans.svg';
import './site-header.scss';
import { useSelector, saveToServer, useDispatch } from '../store';
import { KnapsackNavItem } from '../../schemas/nav';
import { KnapsackSettings } from '../../schemas/knapsack.settings';
import { KsTemplateLanguageSelect } from './template-language-select';

type Props = {
  settings: KnapsackSettings;
  primaryNavItems: KnapsackNavItem[];
  isLocalDev: boolean;
  canEdit: boolean;
};

export const SiteHeader: React.FC<Props> = ({
  settings,
  primaryNavItems,
  isLocalDev,
  canEdit,
}: Props) => {
  const dispatch = useDispatch();
  const hasMultipleTemplateRenderers = useSelector(
    s => Object.keys(s.patternsState?.renderers ?? {}).length > 1,
  );

  // Use state instead of classes if dropdown is going to be used as a separate component
  const handleDropdown = () => {
    const btn = document.querySelector('.ks-site-header__nav-dropdown');
    if (btn.classList.contains('ks-site-header__nav-dropdown--active')) {
      btn.classList.remove('class', 'ks-site-header__nav-dropdown--active');
    } else {
      btn.classList.add('ks-site-header__nav-dropdown--active');
    }
  };

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

        {canEdit && (
          <li className="ks-site-header__nav-item">
            <NavLink className="ks-site-header__nav-link" to="/settings">
              Settings
            </NavLink>
          </li>
        )}

        {plugins.getPlugins().map(plugin => {
          if (!plugin.addPages) {
            return null;
          }
          return plugin
            .addPages()
            .filter(page => page.includeInPrimaryNav)
            .map(page => {
              const path = urlJoin('/', plugin.id, page.path);
              return (
                <li key={path} className="ks-site-header__nav-item">
                  <NavLink to={path} className="ks-site-header__nav-link">
                    {page.navTitle}
                  </NavLink>
                </li>
              );
            });
        })}

        {isLocalDev && (
          <li className="ks-site-header__nav-item">
            <KsButton
              kind="standard"
              size="s"
              onClick={() =>
                dispatch(saveToServer({ storageLocation: 'local' }))
              }
            >
              Save
            </KsButton>
          </li>
        )}

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
        <li className="ks-site-header__nav-item">
          <span className="ks-site-header__nav-icon">
            <KsButton
              icon="settings"
              kind="icon"
              size="m"
              onClick={handleDropdown}
              onKeyPress={handleDropdown}
            />
          </span>
          <div className="ks-site-header__nav-dropdown">
            <ul className="ks-site-header__nav-dropdown-list">
              <li className="ks-site-header__nav-dropdown-item">
                <NavLink to="/settings">General Settings</NavLink>
              </li>
              <li className="ks-site-header__nav-dropdown-item">
                <a href="https://knapsack.basalt.io/docs/getting-started">
                  Knapsack Docs
                </a>
              </li>
              <li className="ks-site-header__nav-dropdown-item">
                <a href="/demo-urls">Demo URLs</a>
              </li>
              <li className="ks-site-header__nav-dropdown-item">
                <NavLink to="/changelog">Changelog</NavLink>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </header>
  );
};

export const SiteHeaderConnected: React.FC = () => {
  const settings = useSelector(s => s.settingsState.settings);
  const primaryNavItems = useSelector(s => s.navsState.primary);
  const isLocalDev = useSelector(s => s.userState.isLocalDev);
  const canEdit = useSelector(s => s.userState.canEdit);
  return (
    <SiteHeader
      settings={settings}
      primaryNavItems={primaryNavItems}
      isLocalDev={isLocalDev}
      canEdit={canEdit}
    />
  );
};
