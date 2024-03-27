import TiptapTableHeader from "@tiptap/extension-table-header";
import { Plugin } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

import { getCellsInRow, isColumnSelected, selectColumn } from "./utils";

export const TableHeader = TiptapTableHeader.extend({
  addAttributes() {
    return {
      colspan: {
        default: 1,
      },
      rowspan: {
        default: 1,
      },
      colwidth: {
        default: null,
        parseHTML: (element) => {
          const colwidth = element.getAttribute("colwidth");
          return colwidth
            ? colwidth.split(",").map((item) => Number.parseInt(item, 10))
            : null;
        },
      },
      style: {
        default: null,
      },
    };
  },

  addProseMirrorPlugins() {
    const { isEditable } = this.editor;

    return [
      new Plugin({
        props: {
          /* eslint-disable sonarjs/cognitive-complexity */
          decorations: (state) => {
            if (!isEditable) {
              return DecorationSet.empty;
            }

            const { doc, selection } = state;
            const decorations: Decoration[] = [];
            const cells = getCellsInRow(0)(selection);

            if (cells) {
              for (const [index, { pos }] of cells.entries()) {
                decorations.push(
                  Decoration.widget(pos + 1, () => {
                    const colSelected = isColumnSelected(index)(selection);
                    let className = "grip-column";

                    if (colSelected) {
                      className += " selected";
                    }

                    if (index === 0) {
                      className += " first";
                    }

                    if (index === cells.length - 1) {
                      className += " last";
                    }

                    const grip = document.createElement("a");

                    grip.className = className;
                    grip.addEventListener("mousedown", (event) => {
                      event.preventDefault();
                      event.stopImmediatePropagation();

                      /* eslint-disable unicorn/consistent-destructuring */
                      this.editor.view.dispatch(
                        selectColumn(index)(this.editor.state.tr),
                      );
                    });

                    return grip;
                  }),
                );
              }
            }

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },
});

export default TableHeader;
