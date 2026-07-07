import { useNavbarSecondaryMenu } from '@docusaurus/theme-common/internal'
import UserCard from '@site/src/components/UserCard'
import { cn } from '@site/src/lib/utils'
import type { Props } from '@theme/Navbar/MobileSidebar/Layout'
import { JSX } from 'react'
import styles from './styles.module.css'

export default function NavbarMobileSidebarLayout({ header, primaryMenu, secondaryMenu }: Props): JSX.Element {
    const { shown: secondaryMenuShown } = useNavbarSecondaryMenu()
    return (
        <div className="navbar-sidebar">
            {header}
            <div className={styles.sidebar}>
                <UserCard isNavbar />
                <div
                    className={cn(
                        'navbar-sidebar__items',
                        styles.scrollArea,
                        { 'navbar-sidebar__items--show-secondary': secondaryMenuShown },
                    )}
                >
                    <div className="navbar-sidebar__item menu">{primaryMenu}</div>
                    <div className="navbar-sidebar__item menu">{secondaryMenu}</div>
                </div>
            </div>
        </div>
    )
}
