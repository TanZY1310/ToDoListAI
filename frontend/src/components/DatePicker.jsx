import {useEffect, useRef, useState} from "react";
import flatpickr from "flatpickr";

function DatePicker({ value, onChange }) {
  const datePickerRef = useRef(null);

  // Function to get current date to display in date picker instead of empty value
  const getCurrentDate = () => {
    if (value) return value;
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  const [selectedDate, setSelectedDate] = useState(getCurrentDate);

  useEffect(() => {
    if (datePickerRef.current) {
      const fp = flatpickr(datePickerRef.current, {
        monthSelectorType: 'static',
        dateFormat: "Y-m-d",
        defaultDate: selectedDate, // Pass initial date to flatpickr
        onChange: (selectedDates, dateStr) => {
          setSelectedDate(dateStr); // Keep local state in sync
          onChange(dateStr); // Update your React state
        },
      });

      // Cleanup on unmount
      return () => fp.destroy();
    }
  }, [onChange]);

  return (
    <div className="w-full max-w-sm">
      <label className="label-text mb-1 block" htmlFor="date-input">Due Date</label>
      <input
        ref={datePickerRef} // This connects the input to the Flatpickr logic
        type="text"
        className="input w-full"
        // ...
      />
    </div>
  );
}

export default DatePicker;
