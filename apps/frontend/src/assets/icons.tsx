import type { IconType } from "react-icons";
import {
    AiFillBell,
    AiFillDelete,
    AiFillEdit,
    AiFillProject,
    AiFillQuestionCircle,
    AiOutlineCloudSync,
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
    BiSolidFileTxt,
    BiSolidHide,
    BiSolidMicrophone,
    BiSolidMicrophoneOff,
    BiSolidSave,
} from "react-icons/bi";
import {
    BsArrowDownShort,
    BsArrowUpShort,
    BsCheck,
    BsFileEarmarkImage,
    BsFileEarmarkPdfFill,
    BsFillCloudCheckFill,
    BsFillCloudSlashFill,
    BsFillPatchCheckFill,
    BsFillSunFill,
} from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { FaFileCsv, FaFolder, FaMarkdown, FaPaintRoller, FaPuzzlePiece } from "react-icons/fa";
import { FiItalic, FiUnderline } from "react-icons/fi";
import { GoBold, GoDotFill } from "react-icons/go";
import { GrRedo, GrUndo } from "react-icons/gr";
import { HiDocumentDuplicate, HiOutlineArrowNarrowRight } from "react-icons/hi";
import { HiTableCells } from "react-icons/hi2";
import { IoMdImage, IoMdLogOut } from "react-icons/io";
import { IoCalendar, IoCheckmarkDoneCircleSharp } from "react-icons/io5";
import {
    MdDriveFileMoveRtl,
    MdEditDocument,
    MdFormatClear,
    MdKeyboardDoubleArrowLeft,
    MdKeyboardDoubleArrowRight,
    MdManageAccounts,
    MdOutlineFullscreen,
    MdOutlineFullscreenExit,
    MdPermMedia,
    MdScheduleSend,
    MdSettings,
    MdSpaceDashboard,
} from "react-icons/md";
import { PiCodeBlockBold, PiDotsThreeBold, PiPlusCircleLight } from "react-icons/pi";
import { RiFoldersFill } from "react-icons/ri";
import { RxCaretSort, RxCross2, RxDividerHorizontal, RxMixerHorizontal } from "react-icons/rx";
import { TbBlockquote, TbLoader, TbPlugConnected } from "react-icons/tb";
import { TiDownload, TiLockClosed, TiLockOpen } from "react-icons/ti";
import { VscNewline } from "react-icons/vsc";

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
    EditProfile: MdManageAccounts,
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
    Question: AiFillQuestionCircle,
    Sun: BsFillSunFill,
    Notifications: AiFillBell,
    Profile: CgProfile,
    Settings: MdSettings,
    Logout: IoMdLogOut,
    sortAsc: BsArrowUpShort,
    sortDesc: BsArrowDownShort,
    sort: RxCaretSort,
    hide: BiSolidHide,
    mixer: RxMixerHorizontal,
    check: BsCheck,
    add: PiPlusCircleLight,
    ChevronLeft: BiChevronLeft,
    ChevronRight: BiChevronRight,
    First: MdKeyboardDoubleArrowLeft,
    Last: MdKeyboardDoubleArrowRight,
    move: MdDriveFileMoveRtl,
    folder: FaFolder,
    Plus: BiPlus,
    dashboard: MdSpaceDashboard,
    projects: AiFillProject,
    folders: RiFoldersFill,
    schedule: MdScheduleSend,
    right: HiOutlineArrowNarrowRight,
    assets: MdPermMedia,
    imageFile: BsFileEarmarkImage,
    Error: BiSolidErrorAlt,
    lock: TiLockClosed,
    unlock: TiLockOpen,
    synced: BsFillCloudCheckFill,
    syncing: AiOutlineCloudSync,
    offline: BsFillCloudSlashFill,
    connect: TbPlugConnected,
    save: BiSolidSave,
    calendar: IoCalendar,
    fullscreen: MdOutlineFullscreen,
    fullscreenexit: MdOutlineFullscreenExit,
    clearFormatting: MdFormatClear,
    mic: BiSolidMicrophone,
    micoff: BiSolidMicrophoneOff,
    hardbreak: VscNewline,
    markdown: FaMarkdown,
    pdf: BsFileEarmarkPdfFill,
    csv: FaFileCsv,
    txt: BiSolidFileTxt,
    import: TiDownload,
    table: HiTableCells,
    Loading: TbLoader,
    LoadingDot: GoDotFill,
};
