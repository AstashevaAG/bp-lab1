import { instance } from "@/api/axios";
import React, { useState, useEffect } from "react";

interface Amenity {
  id: number;
  service: string;
  price: string;
  selected: boolean;
}

const PurchaseAmenities = () => {
  const [bookingReference, setBookingReference] = useState("");
  const [flights, setFlights] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [passengerInfo, setPassengerInfo] = useState(null);
  const [includedAmenities, setIncludedAmenities] = useState<Amenity[]>([]);
  const [availableAmenities, setAvailableAmenities] = useState<Amenity[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<number[]>([]);
  const [initiallySelectedAmenities, setInitiallySelectedAmenities] = useState<number[]>([]);
  const [totals, setTotals] = useState({ items: 0, tax: 0, total: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookingDetails = async () => {
    try {
      const response = await instance.get(
        `/bookings/${bookingReference}/details`
      );
      setFlights(response.data);
    } catch (error) {
      console.error("Error fetching booking details:", error);
    }
  };

  const fetchAmenities = async (ticketId) => {
    if (!ticketId) {
      console.error("No ticket ID provided");
      return;
    }
    try {
      const response = await instance.get(`/amenities/${ticketId}`);
      setPassengerInfo(response.data.passenger);
      setIncludedAmenities(response.data.includedAmenities);
      setAvailableAmenities(response.data.amenities);
      const initialSelected = response.data.amenities
        .filter(amenity => amenity.selected)
        .map(amenity => amenity.id);
      setInitiallySelectedAmenities(initialSelected);
      setSelectedAmenities(initialSelected);
    } catch (error) {
      console.error("Error fetching amenities:", error);
    }
  };

  const handleFlightSelect = (flight) => {
    setSelectedFlight(flight);
    fetchAmenities(flight.ticketId); // Предполагаем, что у flight есть ticketId
  };

  const handleAmenityToggle = (amenityId: number) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const calculateTotals = () => {
    const items = availableAmenities
      .filter((a) => selectedAmenities.includes(a.id) && !initiallySelectedAmenities.includes(a.id))
      .reduce((sum, a) => sum + parseFloat(a.price), 0);
    const removedItems = availableAmenities
      .filter((a) => initiallySelectedAmenities.includes(a.id) && !selectedAmenities.includes(a.id))
      .reduce((sum, a) => sum + parseFloat(a.price), 0);
    const totalItems = items - removedItems;
    const tax = totalItems * 0.05; // Предполагаем 5% налог
    setTotals({ 
      items: Number(totalItems.toFixed(2)), 
      tax: Number(tax.toFixed(2)), 
      total: Number((totalItems + tax).toFixed(2))
    });
  };

  useEffect(() => {
    calculateTotals();
  }, [selectedAmenities, availableAmenities, initiallySelectedAmenities]);

  const handleSaveAndConfirm = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await instance.put(`/purchase/${selectedFlight.ticketId}/amenities`, {
        selectedAmenities,
      });
      
      setInitiallySelectedAmenities(selectedAmenities);
      setAvailableAmenities(availableAmenities.map(amenity => ({
        ...amenity,
        selected: selectedAmenities.includes(amenity.id)
      })));
      
      calculateTotals();
      
    } catch (error) {
      console.error("Error updating amenities:", error);
      setError("Failed to update amenities. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="purchase-amenities">
      <h2>Purchase Amenities</h2>
      <div>
        <input
          type="text"
          value={bookingReference}
          onChange={(e) => setBookingReference(e.target.value)}
          placeholder="Booking reference"
        />
        <button onClick={fetchBookingDetails}>OK</button>
      </div>

      {flights.length > 0 && (
        <div>
          <select onChange={(e) => handleFlightSelect(flights[e.target.value])}>
            <option value="">Choose your flights</option>
            {flights.map((flight, index) => (
              <option key={index} value={index}>
                {`${flight.flightNumber}, ${flight.departure}-${flight.arrival}, ${new Date(flight.flightDate).toLocaleString()}`}
              </option>
            ))}
          </select>
          <button onClick={() => fetchAmenities(selectedFlight.ticketId)}>
            Show Amenities
          </button>
        </div>
      )}

      {passengerInfo && (
        <div>
          <p>
            Full name: {passengerInfo.firstname} {passengerInfo.lastname}
          </p>
          <p>Passport number: {passengerInfo.passport}</p>
          <p>Your cabin class is: {passengerInfo.cabinType}</p>
        </div>
      )}

      <div>
        <h3>Included Amenities</h3>
        {includedAmenities.map((amenity) => (
          <div key={amenity.id}>
            <input
              type="checkbox"
              checked={true}
              disabled={true}
            />
            {amenity.service} (Included)
          </div>
        ))}
      </div>

      <div>
        <h3>Available Amenities</h3>
        {availableAmenities.map((amenity) => (
          <div key={amenity.id}>
            <input
              type="checkbox"
              checked={selectedAmenities.includes(amenity.id)}
              onChange={() => handleAmenityToggle(amenity.id)}
            />
            {amenity.service} (
            {parseFloat(amenity.price) === 0 ? "Free" : `$${parseFloat(amenity.price).toFixed(2)}`})
            {initiallySelectedAmenities.includes(amenity.id) && " (Already purchased)"}
          </div>
        ))}
      </div>

      <div>
        <p>Items selected: ${totals.items.toFixed(2)}</p>
        <p>Duties and taxes: ${totals.tax.toFixed(2)}</p>
        <p>{totals.total > 0 ? `Total payable: ${totals.total.toFixed(2)}` : `Total refund: ${-totals.total.toFixed(2)}`}</p>
      </div>

      {error && <p className="error-message">{error}</p>}

      <button onClick={handleSaveAndConfirm} disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Save and Confirm'}
      </button>
      <button
        onClick={() => {
          /* handle exit */
        }}
        disabled={isLoading}
      >
        Exit
      </button>
    </div>
  );
};

export default PurchaseAmenities;