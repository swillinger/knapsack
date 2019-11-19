import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { BASE_PATHS } from '../../lib/constants';
import knapsackLogo from '../assets/knapsack-logo-trans.svg';
import './site-header.scss';
import { useSelector } from '../store';
import { KnapsackCustomSection } from '../../schemas/custom-pages';
import { KnapsackNavItem } from '../../schemas/nav';

type Props = {
  settings: KnapsackSettings;
  customSections: KnapsackCustomSection[];
  primaryNavItems: KnapsackNavItem[];
};

export const SiteHeader: React.FC<Props> = ({
  settings,
  customSections,
  primaryNavItems,
}: Props) => {
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

      <ul>
        {primaryNavItems.map(navItem => (
          <li key={navItem.id}>
            {navItem.path ? (
              <NavLink className="ks-site-header__nav-link" to={navItem.path}>
                {navItem.name}
              </NavLink>
            ) : (
              <span>{navItem.name}</span>
            )}
          </li>
        ))}

        {settings.parentBrand.title && settings.parentBrand.homepage && (
          <li>
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
                  alt={settings.parentBrand.title}
                  style={{ height: '1rem' }}
                />
              )) ||
                settings.parentBrand.title}
            </a>
          </li>
        )}
      </ul>
    </header>
  );
};

export const SiteHeaderConnected: React.FC = () => {
  const settings = useSelector(s => s.settingsState.settings);
  const customSections = useSelector(s => s.customPagesState.sections);
  const primaryNavItems = useSelector(s => s.navsState.primary);
  return (
    <SiteHeader
      settings={settings}
      customSections={customSections}
      primaryNavItems={primaryNavItems}
    />
  );
};
