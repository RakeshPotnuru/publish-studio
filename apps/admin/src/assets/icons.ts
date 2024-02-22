import {
  BiChevronLeft,
  BiChevronRight,
  BiSolidErrorAlt,
  BiSolidHide,
} from "react-icons/bi";
import { BsArrowDownShort, BsArrowUpShort, BsCheck } from "react-icons/bs";
import { IoMdLogOut } from "react-icons/io";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
import { PiPlusCircleLight } from "react-icons/pi";
import { RxCaretSort, RxCross2, RxMixerHorizontal } from "react-icons/rx";
import { TbLoader } from "react-icons/tb";

export const Icons = {
  Error: BiSolidErrorAlt,
  Loading: TbLoader,
  SortAsc: BsArrowUpShort,
  SortDesc: BsArrowDownShort,
  Sort: RxCaretSort,
  HorizontalMixer: RxMixerHorizontal,
  Check: BsCheck,
  CircleAdd: PiPlusCircleLight,
  LeftChevron: BiChevronLeft,
  RightChevron: BiChevronRight,
  LeftDoubleArrow: MdKeyboardDoubleArrowLeft,
  RightDoubleArrow: MdKeyboardDoubleArrowRight,
  Close: RxCross2,
  Logout: IoMdLogOut,
  Hide: BiSolidHide,
};
