const Header = ({ children }: { children: React.ReactNode }) => (
  <th scope="col" className="px-4 py-3 text-right font-medium">
    {children}
  </th>
);

export default Header;
