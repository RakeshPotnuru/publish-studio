type ProTextProps = React.HTMLAttributes<HTMLSpanElement>;

export function ProText({ children, ...props }: Readonly<ProTextProps>) {
  return (
    <span
      className="bg-gradient-to-r from-primary via-purple-500 to-blue-500 bg-clip-text text-transparent"
      {...props}
    >
      {children}
    </span>
  );
}
