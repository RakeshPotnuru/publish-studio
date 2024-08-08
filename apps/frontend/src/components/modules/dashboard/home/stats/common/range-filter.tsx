import { Tabs, TabsList, TabsTrigger } from "@itsrakesh/ui";

interface RangeFilterProps {
  onRangeChange: (range: 7 | 30 | 365 | undefined) => void;
  allTime?: boolean;
}

export default function RangeFilter({
  onRangeChange,
  allTime,
}: Readonly<RangeFilterProps>) {
  return (
    <Tabs
      defaultValue={allTime ? "all" : "week"}
      className="absolute right-4 top-0"
    >
      <TabsList className={"h-7 *:px-2 *:py-0.5 *:text-xs"}>
        <TabsTrigger value="week" onClick={() => onRangeChange(7)}>
          7d
        </TabsTrigger>
        <TabsTrigger value="month" onClick={() => onRangeChange(30)}>
          30d
        </TabsTrigger>
        <TabsTrigger value="year" onClick={() => onRangeChange(365)}>
          1y
        </TabsTrigger>
        {allTime && (
          <TabsTrigger value="all" onClick={() => onRangeChange(undefined)}>
            All
          </TabsTrigger>
        )}
      </TabsList>
    </Tabs>
  );
}
