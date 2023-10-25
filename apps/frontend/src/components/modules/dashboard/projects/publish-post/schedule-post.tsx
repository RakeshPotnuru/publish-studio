import { Button, Calendar, Input, Popover, PopoverContent, PopoverTrigger } from "@itsrakesh/ui";
import { format } from "date-fns";
import { useState } from "react";

import { ErrorBox } from "@/components/ui/error-box";
import { Heading } from "@/components/ui/heading";

interface SchedulePostProps extends React.HTMLAttributes<HTMLElement> {}

const initialDate = new Date(new Date().getTime() + 60 * 60000);
const minDate = new Date(new Date().getTime() + 5 * 60000);

export function SchedulePost({ children }: SchedulePostProps) {
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date | undefined>(initialDate);

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const [hours, minutes] = event.target.value.split(":");
        const newTime = new Date(date || new Date());
        newTime.setHours(Number(hours));
        newTime.setMinutes(Number(minutes));
        setDate(newTime);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>{children}</PopoverTrigger>
            <PopoverContent className="w-[35rem] space-y-2">
                <div className="space-y-2">
                    <Heading level={4}>Schedule Post</Heading>
                    <p className="text-muted-foreground text-sm">
                        Schedule your post to be published at a later date and time.
                    </p>
                </div>
                <div className="flex flex-row space-x-2">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border"
                        fromDate={initialDate}
                    />
                    <div className="flex flex-col justify-between">
                        <div className="space-y-2">
                            <Input
                                onChange={handleTimeChange}
                                type="time"
                                value={format(date || initialDate, "HH:mm")}
                                min={format(minDate, "HH:mm")}
                                onKeyDown={event => event.preventDefault()}
                            />
                            {date && (
                                <p className="text-sm">
                                    <span className="font-semibold">Scheduled for:</span>{" "}
                                    {format(date, "PPPp")}
                                    <br />({format(date, "zzzz")})
                                </p>
                            )}
                            {date && date <= minDate && (
                                <ErrorBox
                                    title="Unsupported date"
                                    description="You can't schedule a post in the past. (Minimum 5 minutes into the future)"
                                />
                            )}
                        </div>
                        <div className="flex flex-row justify-end space-x-2">
                            <Button size="sm" variant="outline" onClick={() => setOpen(false)}>
                                Cancel
                            </Button>
                            <Button size="sm">Confirm</Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}