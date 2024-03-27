import { constants } from "@publish-studio/core/src/config/constants";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import CharacterCount from "@tiptap/extension-character-count";
import Code from "@tiptap/extension-code";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Document from "@tiptap/extension-document";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import HardBreak from "@tiptap/extension-hard-break";
import TiptapHeading from "@tiptap/extension-heading";
import History from "@tiptap/extension-history";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Image from "@tiptap/extension-image";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import Strike from "@tiptap/extension-strike";
import Text from "@tiptap/extension-text";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { all, createLowlight } from "lowlight";

import SpeechRecognition from "../custom-extensions/speech-recognition";
import { Table, TableCell, TableHeader, TableRow } from "./table";

const lowlight = createLowlight(all);

export const extensions = [
  Document,
  Bold,
  Text,
  Paragraph,
  Underline,
  ListItem,
  Typography,
  SpeechRecognition,
  History,
  Italic,
  Strike,
  HardBreak,
  HorizontalRule,
  Dropcursor,
  Gapcursor,
  TableRow,
  TableHeader,
  TableCell,
  Table,
  Code.configure({
    HTMLAttributes: {
      spellcheck: false,
    },
  }),
  Blockquote.configure({
    HTMLAttributes: {
      class:
        "p-2 my-2 border-l-4 border-gray-300 bg-gray-50 italic dark:border-gray-500 dark:bg-gray-800",
    },
  }),
  BulletList,
  OrderedList,
  Placeholder.configure({
    placeholder: "Once upon a time...",
  }),
  TiptapHeading,
  CodeBlockLowlight.configure({
    lowlight,
    HTMLAttributes: {
      spellcheck: false,
    },
  }),
  Image.configure({
    inline: true,
    HTMLAttributes: {
      class: "cursor-move",
    },
  }),
  CharacterCount.configure({
    limit: constants.project.body.MAX_LENGTH,
  }),
  Link.configure({
    HTMLAttributes: {
      class: "text-blue-500 underline hover:text-blue-600",
    },
  }),
];
