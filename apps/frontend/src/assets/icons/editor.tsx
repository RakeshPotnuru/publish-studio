import {
  AiOutlineOrderedList,
  AiOutlineStrikethrough,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { BiCode, BiHighlight } from "react-icons/bi";
import { FiItalic, FiUnderline } from "react-icons/fi";
import { GoBold } from "react-icons/go";
import { GrRedo, GrTextAlignFull, GrUndo } from "react-icons/gr";
import { HiTableCells } from "react-icons/hi2";
import {
  LuArrowDownToLine,
  LuArrowLeftToLine,
  LuArrowRightToLine,
  LuArrowUpToLine,
  LuGripVertical,
} from "react-icons/lu";
import { MdFormatClear, MdShortText } from "react-icons/md";
import { PiCodeBlockBold } from "react-icons/pi";
import { RiRobot2Fill, RiVoiceprintLine } from "react-icons/ri";
import { RxDividerHorizontal } from "react-icons/rx";
import { TbBlockquote } from "react-icons/tb";
import { VscNewline } from "react-icons/vsc";

export const EditorIcons = {
  HorizontalDivider: RxDividerHorizontal,
  Undo: GrUndo,
  Redo: GrRedo,
  Bold: GoBold,
  Italic: FiItalic,
  Underline: FiUnderline,
  Strike: AiOutlineStrikethrough,
  Code: BiCode,
  Blockquote: TbBlockquote,
  Codeblock: PiCodeBlockBold,
  Bulletlist: AiOutlineUnorderedList,
  Orderedlist: AiOutlineOrderedList,
  ClearFormatting: MdFormatClear,
  Hardbreak: VscNewline,
  Table: HiTableCells,
  AddRowBefore: LuArrowUpToLine,
  AddRowAfter: LuArrowDownToLine,
  AddColumnBefore: LuArrowLeftToLine,
  AddColumnAfter: LuArrowRightToLine,
  DragHandle: LuGripVertical,
  Robot: RiRobot2Fill,
  Tone: RiVoiceprintLine,
  Shorten: MdShortText,
  Expand: GrTextAlignFull,
  Highlight: BiHighlight,
};
