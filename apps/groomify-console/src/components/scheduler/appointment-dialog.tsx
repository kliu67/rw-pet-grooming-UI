import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

interface Appointment {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  description?: string;
  color?: string;
}

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (appointment: Omit<Appointment, "id"> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  appointment?: Appointment;
  selectedDate?: Date;
}

const COLOR_OPTIONS = [
  { value: "bg-blue-100 text-blue-700", label: "Blue" },
  { value: "bg-green-100 text-green-700", label: "Green" },
  { value: "bg-purple-100 text-purple-700", label: "Purple" },
  { value: "bg-orange-100 text-orange-700", label: "Orange" },
  { value: "bg-pink-100 text-pink-700", label: "Pink" },
  { value: "bg-yellow-100 text-yellow-700", label: "Yellow" },
];

export function AppointmentDialog({
  open,
  onOpenChange,
  onSave,
  onDelete,
  appointment,
  selectedDate,
}: AppointmentDialogProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);

  useEffect(() => {
    if (appointment) {
      setTitle(appointment.title);
      setDate(format(new Date(appointment.date), "yyyy-MM-dd"));
      setStartTime(appointment.startTime);
      setEndTime(appointment.endTime);
      setDescription(appointment.description || "");
      setColor(appointment.color || COLOR_OPTIONS[0].value);
    } else if (selectedDate) {
      setDate(format(selectedDate, "yyyy-MM-dd"));
      setTitle("");
      // If selectedDate has time information, use it
      const hours = selectedDate.getHours();
      const minutes = selectedDate.getMinutes();
      if (hours !== 0 || minutes !== 0) {
        const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        setStartTime(timeString);
        // Set end time to 1 hour later
        const endDate = new Date(selectedDate);
        endDate.setHours(hours + 1);
        const endTimeString = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;
        setEndTime(endTimeString);
      } else {
        setStartTime("09:00");
        setEndTime("10:00");
      }
      setDescription("");
      setColor(COLOR_OPTIONS[0].value);
    }
  }, [appointment, selectedDate, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !date || !startTime || !endTime) return;

    onSave({
      ...(appointment && { id: appointment.id }),
      title,
      date: new Date(date),
      startTime,
      endTime,
      description,
      color,
    });

    onOpenChange(false);
  };

  const handleDelete = () => {
    if (appointment && onDelete) {
      onDelete(appointment.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Edit Appointment" : "New Appointment"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Appointment title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add notes or description..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setColor(option.value)}
                    className={`w-10 h-10 rounded-lg ${option.value} ${
                      color === option.value
                        ? "ring-2 ring-gray-900 ring-offset-2"
                        : ""
                    }`}
                    title={option.label}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            {appointment && onDelete && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                className="mr-auto"
              >
                Delete
              </Button>
            )}
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}