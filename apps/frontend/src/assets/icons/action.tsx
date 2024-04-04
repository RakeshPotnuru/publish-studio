import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import {
  BiPlus,
  BiSolidHide,
  BiSolidMicrophone,
  BiSolidMicrophoneOff,
  BiSolidSave,
} from "react-icons/bi";
import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs";
import { HiDocumentDuplicate, HiOutlineClipboardCopy } from "react-icons/hi";
import { IoMdLogOut, IoMdRefresh } from "react-icons/io";
import { IoShareSocial } from "react-icons/io5";
import {
  MdDriveFileMoveRtl,
  MdManageAccounts,
  MdOutlineFullscreen,
  MdOutlineFullscreenExit,
  MdScheduleSend,
} from "react-icons/md";
import { PiPlusCircleLight } from "react-icons/pi";
import { RxCaretSort, RxCross2 } from "react-icons/rx";
import { TbPlugConnected } from "react-icons/tb";
import { TiDownload, TiLockClosed, TiLockOpen } from "react-icons/ti";

export const ActionIcons = {
  EditProfile: MdManageAccounts,
  Delete: AiFillDelete,
  Edit: AiFillEdit,
  Duplicate: HiDocumentDuplicate,
  Close: RxCross2,
  Hide: BiSolidHide,
  Logout: IoMdLogOut,
  SortAsc: BsArrowUpShort,
  SortDesc: BsArrowDownShort,
  Sort: RxCaretSort,
  CircleAdd: PiPlusCircleLight,
  Add: BiPlus,
  Move: MdDriveFileMoveRtl,
  Schedule: MdScheduleSend,
  Lock: TiLockClosed,
  Unlock: TiLockOpen,
  Connect: TbPlugConnected,
  Save: BiSolidSave,
  Fullscreen: MdOutlineFullscreen,
  ExitFullscreen: MdOutlineFullscreenExit,
  Mic: BiSolidMicrophone,
  MicOff: BiSolidMicrophoneOff,
  Import: TiDownload,
  Refresh: IoMdRefresh,
  Copy: HiOutlineClipboardCopy,
  Share: IoShareSocial,
};
