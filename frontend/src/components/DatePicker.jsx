import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Label } from "./ui/label";

function DatePicker({ id, value, onChange, label = "Due Date" }) {
  const selectedDate = value ? new Date(value + "T00:00:00") : new Date();

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(selectedDate, "PPP") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (date) {
                onChange(format(date, "yyyy-MM-dd"));
              }
            }}
            defaultMonth={selectedDate}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default DatePicker;
