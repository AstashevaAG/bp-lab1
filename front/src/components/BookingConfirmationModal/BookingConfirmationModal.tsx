import React, { useState } from 'react';
import styles from './BookingConfirmationModal.module.scss';
import Button from '@/ui/Button/Button';

interface Passenger {
  firstname: string;
  lastname: string;
  phone: string;
  passportnumber: string;
  passportcountry: string;
  email: string; // Add this line
}

interface BookingConfirmationModalProps {
  outboundFlight: {
    from: string;
    to: string;
    cabinType: string;
    date: string;
    flightNumber: string;
  };
  returnFlight?: {
    from: string;
    to: string;
    cabinType: string;
    date: string;
    flightNumber: string;
  };
  onClose: () => void;
  onConfirm: (passengers: Passenger[]) => void;
}

export const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  outboundFlight,
  returnFlight,
  onClose,
  onConfirm,
}) => {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [newPassenger, setNewPassenger] = useState<Passenger>({
    firstname: '',
    lastname: '',
    phone: '',
    passportnumber: '',
    passportcountry: '',
    email: '', // Add this line
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPassenger((prev) => ({ ...prev, [name]: value }));
  };

  const addPassenger = () => {
    setPassengers((prev) => [...prev, newPassenger]);
    setNewPassenger({
      firstname: '',
      lastname: '',
      phone: '',
      passportnumber: '',
      passportcountry: '',
      email: '', // Add this line
    });
  };

  const removePassenger = (index: number) => {
    setPassengers((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <h2>Booking confirmation</h2>
        <div className={styles.flightDetails}>
          <h3>Outbound flight details:</h3>
          <p>From: {outboundFlight.from} To: {outboundFlight.to}</p>
          <p>Cabin Type: {outboundFlight.cabinType} Date: {outboundFlight.date}</p>
          <p>Flight number: {outboundFlight.flightNumber}</p>
        </div>
        {returnFlight && (
          <div className={styles.flightDetails}>
            <h3>Return flight details:</h3>
            <p>From: {returnFlight.from} To: {returnFlight.to}</p>
            <p>Cabin Type: {returnFlight.cabinType} Date: {returnFlight.date}</p>
            <p>Flight number: {returnFlight.flightNumber}</p>
          </div>
        )}
        <div className={styles.passengerForm}>
          <input
            type="text"
            name="firstname"
            value={newPassenger.firstname}
            onChange={handleInputChange}
            placeholder="First Name"
          />
          <input
            type="text"
            name="lastname"
            value={newPassenger.lastname}
            onChange={handleInputChange}
            placeholder="Last Name"
          />
          <input
            type="tel"
            name="phone"
            value={newPassenger.phone}
            onChange={handleInputChange}
            placeholder="Phone"
          />
          <input
            type="text"
            name="passportnumber"
            value={newPassenger.passportnumber}
            onChange={handleInputChange}
            placeholder="Passport number"
          />
          <input
            type="text"
            name="passportcountry"
            value={newPassenger.passportcountry}
            onChange={handleInputChange}
            placeholder="Passport country"
          />
          <input
            type="email"
            name="email"
            value={newPassenger.email}
            onChange={handleInputChange}
            placeholder="Email"
          />
          <Button text="Add passenger" onClick={addPassenger} />
        </div>
        <div className={styles.passengersList}>
          <h3>Passengers list</h3>
          <table>
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Phone</th>
                <th>Passport number</th>
                <th>Passport country</th>
                <th>Email</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map((passenger, index) => (
                <tr key={index}>
                  <td>{passenger.firstname}</td>
                  <td>{passenger.lastname}</td>
                  <td>{passenger.phone}</td>
                  <td>{passenger.passportnumber}</td>
                  <td>{passenger.passportcountry}</td>
                  <td>{passenger.email}</td>
                  <td>
                    <Button text="Remove passenger" onClick={() => removePassenger(index)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.actions}>
          <Button text="Back to search for flights" onClick={onClose} />
          <Button text="Confirm booking" onClick={() => onConfirm(passengers)} />
        </div>
      </div>
    </div>
  );
};
