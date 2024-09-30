import styles from './SchedulesToBook.module.scss';

export interface IScheduleToBookRow {
  id: number;
  date: Date;
  routes: {
    airports_routes_departureairportidToairports: {
      iatacode: string;
    };
    airports_routes_arrivalairportidToairports: {
      iatacode: string;
    };
  };

  aircrafts: {
    name: string;
  };
  finalPrice: number;
  flightNumber: string[];
  numberOfStops: number;
  connections: number;
}

const SchedulesToBookRow: React.FC<{
  data: IScheduleToBookRow;
  isSelected: boolean;
  onSelect: () => void;
}> = ({ data, isSelected, onSelect }) => {
  const [datePart, timePart] = data.date.toString().split("T");

  const formattedDate = datePart.split("-").reverse().join("/");

  const formattedTime = timePart.substring(0, 5);

  const flightNumberDisplay = Array.isArray(data.flightNumber)
    ? data.flightNumber.join("-")
    : data.flightNumber;

  return (
    <tr className={isSelected ? styles.okRow : ''}>
      <td>
        {data.routes.airports_routes_departureairportidToairports.iatacode}
      </td>
      <td>{data.routes.airports_routes_arrivalairportidToairports.iatacode}</td>
      <td>{formattedDate}</td>
      <td>{formattedTime}</td>
      <td>{flightNumberDisplay}</td>
      <td>{data.finalPrice}</td>
      <td>{data.connections}</td>
      <td>
        <input
          type="radio"
          checked={isSelected}
          onChange={onSelect}
        />
      </td>
    </tr>
  );
};

export default SchedulesToBookRow;
