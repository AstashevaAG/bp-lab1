import styles from "./Schedules.module.scss";
import { Pencil, SquareCheckBig, SquareX } from "lucide-react";

export interface IScheduleRow {
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
  economyprice: number;
  flightnumber: string;
  confirmed: boolean;
}

const SchedulesRow: React.FC<{
  data: IScheduleRow;
  onEdit: () => void;
  onDisable: () => void;
}> = ({ data, onEdit, onDisable }) => {
  const [datePart, timePart] = data.date.toString().split("T");

  const formattedDate = datePart.split("-").reverse().join("/");

  const formattedTime = timePart.substring(0, 5);

  return (
    <tr className={!data.confirmed ? styles.errorRow : ""}>
      <td>{formattedDate}</td>
      <td>{formattedTime}</td>
      <td>
        {data.routes.airports_routes_departureairportidToairports.iatacode}
      </td>
      <td>{data.routes.airports_routes_arrivalairportidToairports.iatacode}</td>
      <td>{data.flightnumber}</td>
      <td>{data.aircrafts.name}</td>
      <td>{data.economyprice}</td>
      <td>{Math.floor(Number(data.economyprice) * 1.35)}</td>
      <td>{Math.floor(Number(data.economyprice) * 1.35 * 1.3)}</td>
      <td>
        <Pencil color="black" onClick={onEdit} />
      </td>
      <td>
        {data.confirmed ? (
          <SquareX color="black" onClick={onDisable} />
        ) : (
          <SquareCheckBig color="black" onClick={onDisable} />
        )}
      </td>
    </tr>
  );
};

export default SchedulesRow;
