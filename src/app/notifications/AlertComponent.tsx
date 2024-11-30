import React from "react";

type AlertProps = {
  alert: {
    id: string;
    type: string;
    message: string;
    timestamp: string;
    title: string;
  };
};

const AlertComponent: React.FC<AlertProps> = ({ alert }) => {
  const getAlertColor = (type: string) => {
    switch (type) {
      case "normal":
        return "bg-yellow-100 border-yellow-500 text-yellow-700";
      case "critical":
        return "bg-red-100 border-red-500 text-red-700";
      default:
        return "bg-gray-100 border-gray-500 text-gray-700";
    }
  };

  return (
    <div
      className={`alert-component border-l-4 cursor-pointer transition-all hover:scale-105 p-4 ${getAlertColor(
        alert.type
      )}`}
    >
      <div className="alert-header flex justify-between items-center">
        <span className="font-bold text-lg">{alert.type.toUpperCase()}</span>
        <span className="text-sm">{alert.timestamp}</span>
      </div>
      <p className="font-bold">{alert.title}</p>
      <p>{alert.message}</p>
    </div>
  );
};

export default AlertComponent;
