import type { IconType } from "react-icons";
import {
    AiFillBell,
    AiFillDelete,
    AiFillEdit,
    AiFillQuestionCircle,
    AiOutlineLink,
    AiOutlineOrderedList,
    AiOutlineStrikethrough,
    AiOutlineUnorderedList,
} from "react-icons/ai";
import { BiChevronLeft, BiChevronRight, BiCode, BiSolidHide } from "react-icons/bi";
import {
    BsArrowDownShort,
    BsArrowUpShort,
    BsCheck,
    BsFillPatchCheckFill,
    BsFillSunFill,
} from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaPaintRoller, FaPuzzlePiece } from "react-icons/fa";
import { FiItalic, FiUnderline } from "react-icons/fi";
import { GoBold } from "react-icons/go";
import { GrRedo, GrUndo } from "react-icons/gr";
import { HiDocumentDuplicate } from "react-icons/hi";
import { IoMdImage, IoMdLogOut } from "react-icons/io";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import {
    MdEditDocument,
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight,
    MdManageAccounts,
    MdSettings,
} from "react-icons/md";
import { PiCodeBlockBold, PiDotsThreeBold, PiPlusCircleLight } from "react-icons/pi";
import { RxCaretSort, RxCross2, RxDividerHorizontal, RxMixerHorizontal } from "react-icons/rx";
import { TbBlockquote } from "react-icons/tb";
import { MdDriveFileMoveRtl } from "react-icons/md";

export type Icon = IconType;

export const Icons = {
    image: IoMdImage,
    divider: RxDividerHorizontal,
    undo: GrUndo,
    redo: GrRedo,
    link: AiOutlineLink,
    bold: GoBold,
    italic: FiItalic,
    underline: FiUnderline,
    strike: AiOutlineStrikethrough,
    code: BiCode,
    blockquote: TbBlockquote,
    codeblock: PiCodeBlockBold,
    bulletlist: AiOutlineUnorderedList,
    orderedlist: AiOutlineOrderedList,
    editprofile: MdManageAccounts,
    draft: MdEditDocument,
    published: IoCheckmarkDoneCircleSharp,
    rowactions: PiDotsThreeBold,
    delete: AiFillDelete,
    edit: AiFillEdit,
    duplicate: HiDocumentDuplicate,
    close: RxCross2,
    appearance: FaPaintRoller,
    integrations: FaPuzzlePiece,
    connected: BsFillPatchCheckFill,
    question: AiFillQuestionCircle,
    sun: BsFillSunFill,
    notifications: AiFillBell,
    profile: CgProfile,
    settings: MdSettings,
    logout: IoMdLogOut,
    sortAsc: BsArrowUpShort,
    sortDesc: BsArrowDownShort,
    sort: RxCaretSort,
    hide: BiSolidHide,
    mixer: RxMixerHorizontal,
    check: BsCheck,
    add: PiPlusCircleLight,
    previous: BiChevronLeft,
    next: BiChevronRight,
    first: MdKeyboardDoubleArrowLeft,
    last: MdKeyboardDoubleArrowRight,
    move: MdDriveFileMoveRtl,
};
