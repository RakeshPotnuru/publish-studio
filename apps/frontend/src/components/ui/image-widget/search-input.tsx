import { Input } from "@itsrakesh/ui";

import { TProvider } from ".";

interface SearchInputProps extends React.HTMLAttributes<HTMLInputElement> {
    provider: TProvider;
}

export function SearchInput({ provider, ...props }: SearchInputProps) {
    return <Input placeholder={`Search ${provider}...`} className="rounded-full" {...props} />;
}
