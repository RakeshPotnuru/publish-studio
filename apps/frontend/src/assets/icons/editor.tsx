import {
  AiOutlineOrderedList,
  AiOutlineStrikethrough,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { BiCode } from "react-icons/bi";
import { FiItalic, FiUnderline } from "react-icons/fi";
import { GoBold } from "react-icons/go";
import { GrRedo, GrUndo } from "react-icons/gr";
import { HiTableCells } from "react-icons/hi2";
import { MdFormatClear } from "react-icons/md";
import { PiCodeBlockBold } from "react-icons/pi";
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
};
