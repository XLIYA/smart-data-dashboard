import { Link } from 'react-router-dom'

type Props = { onClick?: () => void }

const Brand = ({ onClick }: Props) => (
  <Link
    to="/"
    className="flex items-center gap-3 group hover:opacity-80 transition-opacity"
    onClick={onClick}
  >
    <img
      src="/logo.png"
      alt="BluViz"
      className="w-14 h-14 transition-shadow object-cover"
    />
    <div>
      <span className="font-bold text-lg bg-gradient-to-r from-accent-600 to-cyan-600 dark:from-accent-400 dark:to-cyan-400 bg-clip-text text-transparent">
        BluViz
      </span>
      <p className="text-xs text-gray-500 dark:text-gray-500 leading-none">Smart Dashboard Builder</p>
    </div>
  </Link>
)

export default Brand
