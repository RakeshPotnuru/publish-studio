import {
  AiFillBell,
  AiFillProject,
  AiFillQuestionCircle,
  AiFillSnippets,
  AiFillThunderbolt,
  AiOutlineCloudSync,
  AiOutlineLink,
} from "react-icons/ai";
import { BiSolidErrorAlt } from "react-icons/bi";
import {
  BsFillCloudCheckFill,
  BsFillCloudSlashFill,
  BsFillPatchCheckFill,
  BsFillSunFill,
} from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import {
  FaFolder,
  FaGlobe,
  FaPaintRoller,
  FaPuzzlePiece,
  FaRandom,
  FaTools,
} from "react-icons/fa";
import { FaBrain, FaCheck, FaWandMagicSparkles } from "react-icons/fa6";
import { GoDotFill, GoHomeFill } from "react-icons/go";
import { HiExternalLink } from "react-icons/hi";
import { IoIosCard } from "react-icons/io";
import { IoCalendar, IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import {
  MdBugReport,
  MdEditDocument,
  MdMail,
  MdOutlineDragIndicator,
  MdOutlineMobileOff,
  MdOutlineSupport,
  MdPermMedia,
  MdSecurity,
  MdSettings,
  MdSpaceDashboard,
} from "react-icons/md";
import { PiDotsThreeBold, PiNoteFill } from "react-icons/pi";
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
  Check: FaCheck,
  Folder: FaFolder,
  Dashboard: MdSpaceDashboard,
  Projects: PiNoteFill,
  Folders: RiFoldersFill,
  Assets: MdPermMedia,
  Planner: AiFillProject,
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
  Bug: MdBugReport,
  Globe: FaGlobe,
  Home: GoHomeFill,
  Mail: MdMail,
  DragHandle: MdOutlineDragIndicator,
  Brain: FaBrain,
  Random: FaRandom,
  Billing: IoIosCard,
  Snippets: AiFillSnippets,
};
