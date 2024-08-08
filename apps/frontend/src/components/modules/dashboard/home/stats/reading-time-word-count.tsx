import { useState } from "react";

import { Skeleton } from "@itsrakesh/ui";

import { Center } from "@/components/ui/center";
import { detectBrowserLocale } from "@/utils/detect-locale";
import { trpc } from "@/utils/trpc";

import RangeFilter from "./common/range-filter";
import StatsShell from "./common/stats-shell";

export default function ReadingTimeAndWordCount() {
  const [rTRange, setRTRange] = useState<7 | 30 | 365 | undefined>(undefined);
  const [wCRange, setWCRange] = useState<7 | 30 | 365 | undefined>(undefined);

  const {
    data: rTData,
    isFetching: isRTLoading,
    error: rTError,
  } = trpc.stats.getReadingTime.useQuery({
    days: rTRange,
  });
  const {
    data: wCData,
    isFetching: isWCLoading,
    error: wCError,
  } = trpc.stats.getWords.useQuery({
    days: wCRange,
  });

  const rTBodyView = (
    <div className="mt-10">
      {isRTLoading ? (
        <Skeleton className="h-10 w-24" />
      ) : (
        <p className="flex items-baseline gap-1 text-4xl tabular-nums">
          {getHoursAndMinutes(rTData?.data.stats.read_time || 0).hours}{" "}
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            hr
          </span>{" "}
          {getHoursAndMinutes(rTData?.data.stats.read_time || 0).minutes}{" "}
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            min
          </span>
        </p>
      )}
      <p className="text-sm text-muted-foreground">Reading Time Generated</p>
    </div>
  );

  const wCBodyView = (
    <div className="mt-10 space-y-0">
      {isWCLoading ? (
        <Skeleton className="h-10 w-24" />
      ) : (
        <p className="text-4xl">
          {wCData?.data.stats.word_count.toLocaleString(detectBrowserLocale())}
        </p>
      )}
      <p className="text-sm text-muted-foreground">Words Written</p>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 border-none !p-0 *:relative *:h-1/2 *:items-start *:rounded-lg *:border *:px-4 *:pb-4">
      <StatsShell error={rTError?.message} heading="" className="">
        <RangeFilter onRangeChange={setRTRange} allTime />
        <Center>{rTBodyView}</Center>
      </StatsShell>
      <StatsShell error={wCError?.message} heading="" className="">
        <RangeFilter onRangeChange={setWCRange} allTime />
        <Center>{wCBodyView}</Center>
      </StatsShell>
    </div>
  );
}

function getHoursAndMinutes(milliseconds: number) {
  const totalMinutes = Math.floor(milliseconds / 60_000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return { hours, minutes };
}
