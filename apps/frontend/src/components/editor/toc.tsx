import Link from "next/link";

import { cn } from "@itsrakesh/utils";
import { TextSelection } from "@tiptap/pm/state";
import { type Editor } from "@tiptap/react";
import { type TableOfContentDataItem } from "@tiptap-pro/extension-table-of-content";

interface ToCProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TableOfContentDataItem[];
  editor: Editor;
}

const ToCEmptyState = () => (
  <div className="text-muted-foreground">
    <p>Start editing your document to see the outline.</p>
  </div>
);

const ToCItem = ({
  item,
  onItemClick,
}: {
  item: TableOfContentDataItem;
  onItemClick: (event: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}) => (
  <div
    className={cn("hover:text-primary", {
      "ml-4": item.level === 2,
      "ml-8": item.level === 3,
      "ml-12": item.level === 4,
      "ml-16": item.level === 5,
      "ml-20": item.level === 6,
      "font-semibold text-primary": item.isActive,
    })}
  >
    <Link href={`#${item.id}`} onClick={(event) => onItemClick(event, item.id)}>
      {item.itemIndex}. {item.textContent}
    </Link>
  </div>
);

export function ToC({ items = [], editor }: Readonly<ToCProps>) {
  if (items.length === 0) return <ToCEmptyState />;

  const onItemClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    event.preventDefault();

    const element = editor.view.dom.querySelector(`[data-toc-id="${id}"`);

    if (!element) return;

    const position = editor.view.posAtDOM(element, 0);

    // set focus
    const tr = editor.view.state.tr;

    tr.setSelection(new TextSelection(tr.doc.resolve(position)));

    editor.view.dispatch(tr);

    editor.view.focus();

    if (history.pushState) {
      history.pushState(null, "", `#${id}`);
    }

    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY,
      behavior: "smooth",
    });
  };

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <ToCItem onItemClick={onItemClick} key={item.id} item={item} />
      ))}
    </div>
  );
}
