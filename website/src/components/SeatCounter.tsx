"use client";

import { AlertCircle, CheckCircle } from "lucide-react";

interface SeatInfo {
  className: string;
  totalSeats: number;
  filledSeats: number;
}

const seatData: SeatInfo[] = [
  { className: "Playgroup", totalSeats: 20, filledSeats: 12 },
  { className: "Nursery", totalSeats: 30, filledSeats: 26 },
  { className: "LKG", totalSeats: 35, filledSeats: 30 },
  { className: "UKG", totalSeats: 25, filledSeats: 22 },
  { className: "Class 1–3", totalSeats: 75, filledSeats: 56 },
  { className: "Class 4–8", totalSeats: 150, filledSeats: 88 },
];

export function SeatCounter() {
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {seatData.map((seat) => {
          const remaining = seat.totalSeats - seat.filledSeats;
          const percentFilled = (seat.filledSeats / seat.totalSeats) * 100;
          const isLow = remaining <= 5;

          return (
            <div
              key={seat.className}
              className={`card-static !p-4 ${isLow ? "ring-1 ring-red-200 bg-red-50/30" : ""}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-primary-dark text-sm">
                  {seat.className}
                </span>
                {isLow ? (
                  <AlertCircle size={16} className="text-red-500" />
                ) : (
                  <CheckCircle size={16} className="text-primary/40" />
                )}
              </div>
              <div className="w-full h-2.5 bg-surface-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isLow ? "bg-red-500" : "bg-primary"
                  }`}
                  style={{ width: `${percentFilled}%` }}
                />
              </div>
              <p className={`text-xs mt-2 font-semibold ${isLow ? "text-red-600" : "text-text-muted"}`}>
                {isLow ? `Only ${remaining} seats left!` : `${remaining} seats available`}
              </p>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-text-muted text-center mt-4">
        Seat data is indicative. Call <strong>+91 94180 23454</strong> for exact availability.
      </p>
    </div>
  );
}

export default SeatCounter;
