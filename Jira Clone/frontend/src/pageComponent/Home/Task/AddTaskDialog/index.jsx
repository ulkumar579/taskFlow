/* eslint-disable no-unused-vars */
import { useForm, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { CalendarIcon, ItalicIcon, Plus } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";
import { Toggle } from "@/components/ui/toggle";
import axios from "axios";
import api from "@/utils/api";

export function AddTaskDialog() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState();
  const [month, setMonth] = useState();
  const [value, setValue] = useState();
  const [project, setProject] = useState([]);
  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      taskTitle: "",
      description: "",
      project: "",
      priority: "",
      assignedTo: "",
      dueDate: null,
      label: [],
    },
  });

  const onSubmit = (values) => {
    console.log("Form Values:", values);
    api.post("task/addTask", {
      data: values,
    });
  };

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await api.get("/project/getProject");
      setProject(res.data.data.resultset);
    };

    fetchProjects();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 px-3 py-1 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30 cursor-pointer">
          <Plus className="w-5 h-5" />
          Add Task
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldSet>
            <FieldGroup>
              {/* Task Title */}
              <Field>
                <FieldLabel>Task Title</FieldLabel>
                <Input
                  placeholder="Enter task title"
                  {...register("taskTitle", { required: true })}
                />
              </Field>

              {/* Description */}
              <Field>
                <FieldLabel>Description</FieldLabel>
                <Textarea
                  placeholder="Enter description"
                  {...register("description")}
                />
              </Field>

              {/* Project Select */}
              <Field>
                <FieldLabel>Project</FieldLabel>
                <Controller
                  name="project"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {
                            project.map((p)=>{
                              return <SelectItem value="p?.Id">{p?.name}</SelectItem>
                            })
                          }
                          
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                {/* Due Date */}
                <Field>
                  <FieldLabel>Due Date</FieldLabel>
                  <Controller
                    name="dueDate"
                    control={control}
                    render={({ field }) => (
                      <InputGroup>
                        <InputGroupInput
                          id="date-required"
                          value={field.value}
                          placeholder="June 01, 2025"
                          // onChange={(e) => {
                          //   const date = new Date(e.target.value);
                          //   setValue(e.target.value);
                          //   if (date) {
                          //     setDate(date);
                          //     setMonth(date);
                          //   }
                          // }}
                          onChange={field.onChange}
                          onKeyDown={(e) => {
                            if (e.key === "ArrowDown") {
                              e.preventDefault();
                              setOpen(true);
                            }
                          }}
                        />
                        <InputGroupAddon align="inline-end">
                          <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                              <InputGroupButton
                                id="date-picker"
                                variant="ghost"
                                size="icon-xs"
                                aria-label="Select date"
                              >
                                <CalendarIcon />
                                <span className="sr-only">Select date</span>
                              </InputGroupButton>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto overflow-hidden p-0"
                              align="end"
                              alignOffset={-8}
                              sideOffset={10}
                            >
                              <Calendar
                                mode="single"
                                selected={date}
                                month={month}
                                onMonthChange={setMonth}
                                onSelect={field.onChange}
                              />
                            </PopoverContent>
                          </Popover>
                        </InputGroupAddon>
                      </InputGroup>
                    )}
                  />
                </Field>

                {/* Priority */}
                <Field>
                  <FieldLabel>Priority</FieldLabel>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </Field>
              </div>

              {/* Assigned To */}
              <Field>
                <FieldLabel>Assigned To</FieldLabel>
                <Controller
                  name="assignedTo"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select user" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user1">User 1</SelectItem>
                        <SelectItem value="user2">User 2</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              {/* Label */}
              <Field>
                <FieldLabel>Label</FieldLabel>
                <Controller
                  name="label"
                  control={control}
                  render={({ field }) => {
                    const options = ["frontend", "backend", "urgent", "bug"];
                    return (
                      <div className="flex gap-2 flex-wrap">
                        {options.map((label) => {
                          const isSelected = field.value?.includes(label);

                          return (
                            <Toggle
                              key={label}
                              pressed={isSelected}
                              onPressedChange={(pressed) => {
                                if (pressed) {
                                  field.onChange([...field.value, label]);
                                } else {
                                  field.onChange(
                                    field.value?.filter((l) => l !== label),
                                  );
                                }
                              }}
                            >
                              {label}
                            </Toggle>
                          );
                        })}
                      </div>
                    );
                  }}
                />
              </Field>

              {/* Submit */}
              <Field>
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </DialogContent>
    </Dialog>
  );
}
