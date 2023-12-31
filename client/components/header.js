import Link from 'next/link';

const Header = ({ currentUser }) => {
    const links = [
        !currentUser && { label: 'Sign up', href: '/auth/signup' },
        !currentUser && { label: 'Sign in', href: '/auth/signin' }, 
        currentUser && { label: 'Sell Tickets', href:'/tickets/new'},
        currentUser && { label: 'My Orders' , href:'/orders'},
        currentUser && { label: 'Sign Out', href: '/auth/signout'},
      ].filter(linkConfig => linkConfig).map(({ label,href }) => (
        <li key={href} className="nav-item">
          <Link href={href} className="link-opacity-100">
            {label}
          </Link>
        </li>
      ));

  return (
    <nav className="container navbar navbar-light bg-light">
      <Link href="/" className="navbar-brand">
        GitTix
      </Link>
      <div className="d-flex justify-content-end">
        <ul className='navbar-nav'>
          {links}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
