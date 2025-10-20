import { Link } from 'react-router-dom'
import { navClass } from './nav-class'
import { isActivePath } from './is-active'
import { getNavLinks } from './nav-links'

type Props = { pathname: string }

const DesktopNav = ({ pathname }: Props) => (
  <nav className="hidden md:flex items-center gap-1.5 ml-auto mr-4" aria-label="Primary">
    {getNavLinks().map(({ to, icon: Icon, title }) => (
      <Link key={to} to={to} className={navClass(isActivePath(pathname, to))} title={title} aria-label={title}>
        <Icon className="w-5 h-5" />
      </Link>
    ))}
  </nav>
)

export default DesktopNav
