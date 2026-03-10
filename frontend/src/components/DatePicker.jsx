import {useEffect, useRef} from "react";
import flatpickr from "flatpickr";

function DatePicker({ value, onChange }) {
  const datePickerRef = useRef(null);

  useEffect(() => {
    if (datePickerRef.current) {
      const fp = flatpickr(datePickerRef.current, {
        monthSelectorType: 'static',
        dateFormat: "Y-m-d", // Matches your backend requirement
        onChange: (selectedDates, dateStr) => {
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
