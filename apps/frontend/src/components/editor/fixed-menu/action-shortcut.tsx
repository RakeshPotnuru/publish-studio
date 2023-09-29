import { Badge } from "@itsrakesh/ui";
import { randomBytes } from "crypto";

interface ActionShortcutProps {
    shortcut: {
        mac: string;
        pc: string;
    };
    os: string;
}

export function ActionShortcut({ shortcut, os }: ActionShortcutProps) {
    const macKeys = shortcut.mac.split(" + ");
    const pcKeys = shortcut.pc.split(" + ");

    const keys = os === "mac" ? macKeys : pcKeys;

    const uuid = randomBytes(20).toString("hex");

    return (
        <div className="space-x-1">
            {keys.map(key => (
                <Badge key={uuid} variant="secondary">
                    {key}
                </Badge>
            ))}
        </div>
    );
}
