import { Event, EventDetail } from "@/types/event";

export const mockEvents: Event[] = [
  {
    id: "1",
    timestamp: "2025-05-22 20:55",
    user: "Joe Fam",
    anomaly: 0.72,
    label: "Anomaly",
    event: "Event1",
  },
  {
    id: "2",
    timestamp: "2025-05-21 19:35",
    user: "JuserB",
    anomaly: 0.35,
    label: "Normal",
    event: "Event2",
  },
  {
    id: "3",
    timestamp: "2025-05-19 21:32",
    user: "John Aoe",
    anomaly: 0.42,
    label: "Normal",
    event: "Event3",
  },
  {
    id: "4",
    timestamp: "2025-05-19 21:32",
    user: "Joe Yun",
    anomaly: 0.91,
    label: "Anomaly",
    event: "Event4",
  },
  {
    id: "5",
    timestamp: "2025-05-19 21:32",
    user: "Tim Wan",
    anomaly: 0.83,
    label: "Anomaly",
    event: "Event5",
  },
  {
    id: "6",
    timestamp: "2025-05-19 21:32",
    user: "Tim Wan",
    anomaly: 0.83,
    label: "Anomaly",
    event: "Event6",
  },
  {
    id: "7",
    timestamp: "2025-05-19 21:32",
    user: "Tim Wan",
    anomaly: 0.83,
    label: "Anomaly",
    event: "Event7",
  },
];

export const mockEventDetail: EventDetail = {
  id: "3",
  date: "2025-05-19",
  anomalyScore: 0.42,
  incident: "User login from an unusual location",
  rowData: {
    ip_address: "172.158.32.33",
    user: "John Aoe",
    number: "1012303",
    location: "bin/bash",
  },
};
