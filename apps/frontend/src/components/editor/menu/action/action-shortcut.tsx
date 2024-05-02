import { Badge } from "@itsrakesh/ui";

interface ActionShortcutProps {
  shortcut: {
    mac: string;
    pc: string;
  };
  os: string;
}

export function ActionShortcut({
  shortcut,
  os,
}: Readonly<ActionShortcutProps>) {
  const macKeys = shortcut.mac.split(" + ");
  const pcKeys = shortcut.pc.split(" + ");

  const keys = os === "mac" ? macKeys : pcKeys;

  return (
    <div className="space-x-1">
      {keys.map((key) => (
        <Badge key={key} variant="secondary" className="px-1.5 py-0.5">
          <kbd>{key}</kbd>
        </Badge>
      ))}
    </div>
  );
}
