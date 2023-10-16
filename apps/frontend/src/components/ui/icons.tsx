import type { IconType } from "react-icons";
import {
    AiFillBell,
    AiFillDelete,
    AiFillEdit,
    AiFillProject,
    AiFillQuestionCircle,
    AiOutlineLink,
    AiOutlineOrderedList,
    AiOutlineStrikethrough,
    AiOutlineUnorderedList,
} from "react-icons/ai";
import {
    BiChevronLeft,
    BiChevronRight,
    BiCode,
    BiPlus,
    BiSolidErrorAlt,
    BiSolidHide,
} from "react-icons/bi";
import {
    BsArrowDownShort,
    BsArrowUpShort,
    BsCheck,
    BsFileEarmarkImage,
    BsFillPatchCheckFill,
    BsFillSunFill,
} from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaFolder, FaPaintRoller, FaPuzzlePiece } from "react-icons/fa";
import { FiItalic, FiUnderline } from "react-icons/fi";
import { GoBold } from "react-icons/go";
import { GrRedo, GrUndo } from "react-icons/gr";
import { HiDocumentDuplicate, HiOutlineArrowNarrowRight } from "react-icons/hi";
import { IoMdImage, IoMdLogOut } from "react-icons/io";
import { IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import {
    MdDriveFileMoveRtl,
    MdEditDocument,
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight,
    MdManageAccounts,
    MdPermMedia,
    MdScheduleSend,
    MdSettings,
    MdSpaceDashboard,
} from "react-icons/md";
import { PiCodeBlockBold, PiDotsThreeBold, PiPlusCircleLight } from "react-icons/pi";
import { RiFoldersFill } from "react-icons/ri";
import { RxCaretSort, RxCross2, RxDividerHorizontal, RxMixerHorizontal } from "react-icons/rx";
import { TbBlockquote } from "react-icons/tb";

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
    folder: FaFolder,
    plus: BiPlus,
    dashboard: MdSpaceDashboard,
    projects: AiFillProject,
    folders: RiFoldersFill,
    scheduled: MdScheduleSend,
    right: HiOutlineArrowNarrowRight,
    assets: MdPermMedia,
    imageFile: BsFileEarmarkImage,
    error: BiSolidErrorAlt,
};
