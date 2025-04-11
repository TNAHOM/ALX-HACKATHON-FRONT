import { ChevronRight } from "lucide-react";
import React from "react";
import { Button } from "./ui/button";

const BookingBar = () => {
  return (
    <section className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-4 z-10">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <h3 className="font-bold text-lg mr-2">Book Your Stay</h3>
          <ChevronRight size={16} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto">
          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Location</p>
            <select className="w-full border border-gray-300 rounded p-2">
              <option>Bishoftu</option>
            </select>
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Select Dates</p>
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2"
              defaultValue="04/11/2025 - 04/12/2025"
              readOnly
            />
          </div>

          <div>
            <p className="text-xs text-gray-500 uppercase mb-1">Guests</p>
            <select className="w-full border border-gray-300 rounded p-2">
              <option>2 Adults</option>
            </select>
          </div>
        </div>

        <Button className="w-full md:w-auto mt-4 md:mt-0 bg-white text-black border border-gray-300 hover:bg-gray-100">
          Check availability
        </Button>
      </div>
    </section>
  );
};

export default BookingBar;
