"use client";

import { AlertCircle, CheckCircle } from "lucide-react";

interface SeatInfo {
  className: string;
  totalSeats: number;
  filledSeats: number;
}

const seatData: SeatInfo[] = [
  { className: "Playgroup", totalSeats: 25, filledSeats: 21 },
  { className: "Nursery", totalSeats: 25, filledSeats: 19 },
  { className: "KG", totalSeats: 30, filledSeats: 24 },
  { className: "Class 1", totalSeats: 30, filledSeats: 22 },
  { className: "Class 2–5", totalSeats: 35, filledSeats: 28 },
  { className: "Class 6–8", totalSeats: 35, filledSeats: 26 },
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
        Seat data is indicative. Call <strong>+91 98180 97475</strong> for exact availability.
      </p>
    </div>
  );
}

export default SeatCounter;
