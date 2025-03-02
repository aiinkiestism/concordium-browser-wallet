import React, { PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { NavLink, useLocation } from 'react-router-dom';

import Logo from '@assets/svg/concordium.svg';
import CheckmarkIcon from '@assets/svg/checkmark-blue.svg';
import NavList from '@popup/shared/NavList';
import Button from '@popup/shared/Button';
import { absoluteRoutes } from '@popup/constants/routes';

type HeaderLinkProps = PropsWithChildren<{
    onClick(): void;
    to: string;
}>;

function HeaderLink({ to, children, onClick }: HeaderLinkProps) {
    return (
        <NavLink
            onClick={onClick}
            className={({ isActive }) =>
                clsx('main-layout-header__nav-item', isActive && 'main-layout-header__nav-item--active')
            }
            to={to}
        >
            {({ isActive }) => (
                <div className="inline-flex align-center relative">
                    {children}
                    {isActive && <CheckmarkIcon />}
                </div>
            )}
        </NavLink>
    );
}

export default function Header() {
    const { t } = useTranslation('mainLayout');
    const { pathname } = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    // eslint-disable-next-line no-nested-ternary
    const title = pathname.includes(absoluteRoutes.home.identities.path)
        ? t('header.ids')
        : pathname.includes(absoluteRoutes.home.settings.path)
        ? t('header.settings')
        : t('header.accounts');

    return (
        <>
            <header className={clsx('main-layout-header', isOpen && 'main-layout-header--open')}>
                <div className="main-layout-header__bar">
                    <Button className="main-layout-header__logo" clear onClick={() => setIsOpen((o) => !o)}>
                        <Logo />
                    </Button>
                    <h1>{title}</h1>
                </div>
                <NavList className="main-layout-header__nav">
                    <HeaderLink onClick={() => setIsOpen(false)} to={absoluteRoutes.home.path}>
                        {t('header.accounts')}
                    </HeaderLink>
                    <HeaderLink onClick={() => setIsOpen(false)} to={absoluteRoutes.home.identities.path}>
                        {t('header.ids')}
                    </HeaderLink>
                    <HeaderLink onClick={() => setIsOpen(false)} to={absoluteRoutes.home.settings.path}>
                        {t('header.settings')}
                    </HeaderLink>
                </NavList>
            </header>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
            {isOpen && <div className="absolute t-0 w-full h-full" onClick={() => setIsOpen(false)} />}
        </>
    );
}
