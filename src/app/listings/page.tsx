"use client";

import { useState } from "react";

const LISTINGS = [
  { id: 1, name: "'71 Datsun 510", series: "Car Culture", condition: "Mint", price: 24 },
  { id: 2, name: "Porsche 911 GT3 RS", series: "Premium", condition: "Near Mint", price: 18 },
  { id: 3, name: "Toyota AE86 Sprinter", series: "Japan Historics", condition: "Mint", price: 32 },
  { id: 4, name: "'55 Chevy Bel Air Gasser", series: "Legends Tour", condition: "Excellent", price: 15 },
  { id: 5, name: "Nissan Skyline GT-R R34", series: "Boulevard", condition: "Mint", price: 28 },
  { id: 6, name: "McLaren F1 GTR", series: "Car Culture", condition: "Near Mint", price: 22 },
  { id: 7, name: "BMW M3 E30", series: "Modern Classics", condition: "Mint", price: 19 },
  { id: 8, name: "Ford GT40", series: "Race Day", condition: "Excellent", price: 26 },
  { id: 9, name: "Lamborghini Countach", series: "Retro Entertainment", condition: "Mint", price: 35 },
];

export default function ListingsPage() {
  const [search, setSearch] = useState("");

  const filtered = LISTINGS.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.series.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-2">Browse Listings</h1>
      <p className="text-gray-500 mb-8">Find your next grail piece from verified sellers</p>

      <div className="flex gap-3 mb-10">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, series, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-royal-blue/30 focus:border-royal-blue"
          />
        </div>
        <button className="rounded-lg border border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((car) => (
          <div
            key={car.id}
            className="group rounded-xl border border-card-border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="aspect-[4/3] bg-gray-100 relative">
              <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                </svg>
              </div>
              <div className="absolute top-3 left-3">
                <span className="rounded-full bg-royal-blue/90 px-3 py-0.5 text-xs font-medium text-white">
                  {car.series}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="rounded-full bg-white/90 px-3 py-0.5 text-xs font-medium text-gray-700">
                  {car.condition}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-base group-hover:text-royal-blue transition-colors">
                {car.name}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <p className="text-lg font-bold">${car.price}</p>
                <span className="text-xs text-gray-400">Listed 2h ago</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No listings found</p>
          <p className="text-sm mt-1">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
}
