import type { IconType } from "react-icons";

import { ActionIcons } from "./action";
import { AppIcons } from "./app";
import { EditorIcons } from "./editor";
import { FileIcons } from "./file";
import { GeneralIcons } from "./general";
import { NavigationIcons } from "./navigation";

export type Icon = IconType;

export const Icons = {
  ...ActionIcons,
  ...EditorIcons,
  ...FileIcons,
  ...GeneralIcons,
  ...NavigationIcons,
  ...AppIcons,
};
