import {
  AiFillBell,
  AiFillProject,
  AiFillQuestionCircle,
  AiFillThunderbolt,
  AiOutlineCloudSync,
  AiOutlineLink,
} from "react-icons/ai";
import { BiSolidErrorAlt } from "react-icons/bi";
import {
  BsCheck,
  BsFillCloudCheckFill,
  BsFillCloudSlashFill,
  BsFillPatchCheckFill,
  BsFillSunFill,
} from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import {
  FaFolder,
  FaPaintRoller,
  FaPuzzlePiece,
  FaTools,
} from "react-icons/fa";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import { HiExternalLink } from "react-icons/hi";
import { IoCalendar, IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import {
  MdEditDocument,
  MdOutlineMobileOff,
  MdOutlineSupport,
  MdPermMedia,
  MdSecurity,
  MdSettings,
  MdSpaceDashboard,
} from "react-icons/md";
import { PiDotsThreeBold } from "react-icons/pi";
import { RiFoldersFill } from "react-icons/ri";
import { RxMixerHorizontal } from "react-icons/rx";
import { SiReadthedocs } from "react-icons/si";
import { TbLoader } from "react-icons/tb";

export const GeneralIcons = {
  Link: AiOutlineLink,
  ExternalLink: HiExternalLink,
  Draft: MdEditDocument,
  Published: IoCheckmarkDoneCircleSharp,
  RowActions: PiDotsThreeBold,
  Appearance: FaPaintRoller,
  Connections: FaPuzzlePiece,
  Connected: BsFillPatchCheckFill,
  Question: AiFillQuestionCircle,
  Profile: CgProfile,
  Sun: BsFillSunFill,
  Notification: AiFillBell,
  Settings: MdSettings,
  HorizontalMixer: RxMixerHorizontal,
  Check: BsCheck,
  Folder: FaFolder,
  Dashboard: MdSpaceDashboard,
  Projects: AiFillProject,
  Folders: RiFoldersFill,
  Assets: MdPermMedia,
  Error: BiSolidErrorAlt,
  Synced: BsFillCloudCheckFill,
  Syncing: AiOutlineCloudSync,
  Offline: BsFillCloudSlashFill,
  Calendar: IoCalendar,
  Loading: TbLoader,
  Dot: GoDotFill,
  Magic: FaWandMagicSparkles,
  Support: MdOutlineSupport,
  Tools: FaTools,
  Pro: AiFillThunderbolt,
  MobileOff: MdOutlineMobileOff,
  Security: MdSecurity,
  Docs: SiReadthedocs,
};
