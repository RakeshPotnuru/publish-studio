import type { JSONContent } from "@tiptap/core";
import Blockquote from "@tiptap/extension-blockquote";
import Bold from "@tiptap/extension-bold";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import HardBreak from "@tiptap/extension-hard-break";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Italic from "@tiptap/extension-italic";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import Strike from "@tiptap/extension-strike";
import type { MarkdownSerializerState } from "@tiptap/pm/markdown";
import {
    defaultMarkdownSerializer,
    MarkdownSerializer as ProseMirrorMarkdownSerializer,
} from "@tiptap/pm/markdown";
import type {
    Mark as ProseMirrorMark,
    Node as ProseMirrorNode,
    Schema as ProseMirrorSchema,
} from "@tiptap/pm/model";
import { DOMParser as ProseMirrorDOMParser } from "@tiptap/pm/model";
import DOMPurify from "dompurify";
import { marked } from "marked";

const tableMap = new WeakMap<ProseMirrorNode, boolean>();

function isInTable(node: ProseMirrorNode): boolean {
    return tableMap.has(node);
}

export function renderHardBreak(
    state: MarkdownSerializerState,
    node: ProseMirrorNode,
    parent: ProseMirrorNode,
    index: number,
) {
    const br = isInTable(parent) ? "<br>" : "\\\n";
    for (let i = index + 1; i < parent.childCount; i += 1) {
        if (parent.child(i).type !== node.type) {
            state.write(br);
            return;
        }
    }
}

export function renderOrderedList(state: MarkdownSerializerState, node: ProseMirrorNode) {
    const { parens } = node.attrs;
    const start = node.attrs.start || 1;
    const maxW = String(start + node.childCount - 1).length;
    const space = state.repeat(" ", maxW + 2);
    const delimiter = parens ? ")" : ".";
    state.renderList(node, space, i => {
        const nStr = String(start + i);
        return `${state.repeat(" ", maxW - nStr.length) + nStr}${delimiter} `;
    });
}

export function isPlainURL(
    link: ProseMirrorMark,
    parent: ProseMirrorNode,
    index: number,
    side: number,
) {
    if (link.attrs.title || !/^\w+:/.test(link.attrs.href)) return false;
    const content = parent.child(index + (side < 0 ? -1 : 0));
    if (!content.isText || content.text !== link.attrs.href || content.marks.at(-1) !== link)
        return false;
    if (index === (side < 0 ? 1 : parent.childCount - 1)) return true;
    const next = parent.child(index + (side < 0 ? -2 : 1));
    return !link.isInSet(next.marks);
}

const serializerMarks = {
    ...defaultMarkdownSerializer.marks,
    [Bold.name]: defaultMarkdownSerializer.marks.strong,
    [Strike.name]: {
        open: "~~",
        close: "~~",
        mixable: true,
        expelEnclosingWhitespace: true,
    },
    [Italic.name]: {
        open: "_",
        close: "_",
        mixable: true,
        expelEnclosingWhitespace: true,
    },
    [Code.name]: defaultMarkdownSerializer.marks.code,
    [Link.name]: {
        open(
            _: MarkdownSerializerState,
            mark: ProseMirrorMark,
            parent: ProseMirrorNode,
            index: number,
        ) {
            return isPlainURL(mark, parent, index, 1) ? "<" : "[";
        },
        close(
            state: MarkdownSerializerState,
            mark: ProseMirrorMark,
            parent: ProseMirrorNode,
            index: number,
        ) {
            const href = mark.attrs.canonicalSrc || mark.attrs.href;

            const title = mark.attrs.title ? mark.attrs.title : "";
            return isPlainURL(mark, parent, index, -1) ? ">" : `](${state.esc(href)}${title})`;
        },
    },
};

const serializerNodes = {
    ...defaultMarkdownSerializer.nodes,
    [Paragraph.name]: defaultMarkdownSerializer.nodes.paragraph,
    [BulletList.name]: defaultMarkdownSerializer.nodes.bullet_list,
    [ListItem.name]: defaultMarkdownSerializer.nodes.list_item,
    [HorizontalRule.name]: defaultMarkdownSerializer.nodes.horizontal_rule,
    [OrderedList.name]: renderOrderedList,
    [HardBreak.name]: renderHardBreak,
    [CodeBlockLowlight.name]: (state: MarkdownSerializerState, node: ProseMirrorNode) => {
        state.write(`\`\`\`${node.attrs.language || ""}\n`);
        state.text(node.textContent, false);
        state.ensureNewLine();
        state.write("```");
        state.closeBlock(node);
    },
    [Blockquote.name]: (state: MarkdownSerializerState, node: ProseMirrorNode) => {
        if (node.attrs.multiline) {
            state.write(">>>");
            state.ensureNewLine();
            state.renderContent(node);
            state.ensureNewLine();
            state.write(">>>");
            state.closeBlock(node);
        } else {
            state.wrapBlock("> ", null, node, () => state.renderContent(node));
        }
    },
};

export function serialize(schema: ProseMirrorSchema, content: JSONContent) {
    const proseMirrorDocument = schema.nodeFromJSON(content);
    const serializer = new ProseMirrorMarkdownSerializer(serializerNodes, serializerMarks);

    return serializer.serialize(proseMirrorDocument, {
        tightLists: true,
    });
}

export function deserialize(schema: ProseMirrorSchema, content: string): JSON | null {
    const html = DOMPurify.sanitize(marked.parse(content));

    if (!html) return null;

    const parser = new DOMParser();
    const { body } = parser.parseFromString(html, "text/html");

    // append original source as a comment that nodes can access
    body.append(document.createComment(content));

    const state = ProseMirrorDOMParser.fromSchema(schema).parse(body);

    return state.toJSON();
}
