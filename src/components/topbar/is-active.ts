export const isActivePath = (pathname: string, path: string): boolean => {
  if (path === '/') return pathname === '/'
  return pathname === path || pathname.startsWith(path + '/')
}
