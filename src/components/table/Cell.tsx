const Cell = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <td className={`px-4 py-3 text-right tabular-nums ${className}`}>
    {children}
  </td>
);

export default Cell;
